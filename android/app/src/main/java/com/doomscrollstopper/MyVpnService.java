package com.doomscrollstopper;

import android.app.ActivityManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.net.VpnService;
import android.os.Build;
import android.content.pm.PackageManager;
import androidx.core.app.NotificationCompat;

import java.io.IOException;
import java.net.InetSocketAddress;

import android.os.ParcelFileDescriptor;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import android.util.Log;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.DatagramChannel;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Locale;

// The actual VPN that READS the incoming data
public class MyVpnService extends VpnService {
    private static final String TAG = "MyVpnService";
    private static final String NOTIFICATION_CHANNEL_ID = "DoomScrollStopperVPN";
    private static final int NOTIFICATION_ID = 1;
    private static final String LOG_TAG = "VPNActivity";
    
    private ParcelFileDescriptor vpnInterface;
    private boolean isRunning = false;
    private Thread vpnThread;
    private ConcurrentHashMap<String, Long> appAccessTimes = new ConcurrentHashMap<>();
    private AppMonitorCallback callback;

    public interface AppMonitorCallback {
        void onAppDetected(String packageName);
    }
    
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null && "START_VPN".equals(intent.getAction())) {
            startVPN(intent);
        } else if (intent != null && "STOP_VPN".equals(intent.getAction())) {
            stopVPN(intent);
        }
        
        return START_STICKY;
    }

    private void startVPN(Intent intent) {
        if (vpnInterface == null) {
            startForeground(NOTIFICATION_ID, createNotification("VPN Active"));
            Builder builder = new Builder();
            builder.setSession("Doom Scroll Stopper")
                .addAddress("10.0.0.2", 24)
                .addRoute("0.0.0.0", 0)
                .addDnsServer("8.8.8.8")
                .addDnsServer("8.8.4.4")
                .setMtu(1400);
            
            try {
                builder.addDisallowedApplication(getPackageName());
            } catch (PackageManager.NameNotFoundException e){
                Log.e(TAG, "Failed to add disallowed application", e);
            }

            // Create the VPN interface
            vpnInterface = builder.establish();
            
            if (vpnInterface != null) {
                startMonitoring();
            }
        }
    }

    private void startMonitoring() {
        vpnThread = new Thread(() -> {
            try {
                DatagramChannel tunnel = DatagramChannel.open();
                tunnel.connect(new InetSocketAddress("127.0.0.1", 8087));
                tunnel.configureBlocking(false);
                
                FileInputStream in = new FileInputStream(vpnInterface.getFileDescriptor());
                FileOutputStream out = new FileOutputStream(vpnInterface.getFileDescriptor());
                
                ByteBuffer packet = ByteBuffer.allocate(32767);
                
                while (!Thread.interrupted()) {
                    int length = in.read(packet.array());
                    if (length > 0) {
                        packet.limit(length);
                        
                        // Parse packet to detect app
                        String detectedApp = parsePacket(packet);
                        if (detectedApp != null && callback != null) {
                            callback.onAppDetected(detectedApp);
                        }
                        
                        // Forward packet
                        out.write(packet.array(), 0, length);
                        packet.clear();
                    }
                    
                    Thread.sleep(10);
                }
            } catch (Exception e) {
                Log.e(TAG, "VPN monitoring error", e);
            }
        });
        vpnThread.start();
    }

    private String parsePacket(ByteBuffer packet) {
        // Simple packet inspection to detect app
        // This is a simplified version - you'd need more sophisticated parsing
        try {
            // Check IP version (4 or 6)
            byte version = (byte) ((packet.get(0) >> 4) & 0xF);
            
            if (version == 4) {
                // IPv4 packet
                int protocol = packet.get(9) & 0xFF;
                
                // Get destination port for TCP/UDP
                if (protocol == 6 || protocol == 17) { // TCP or UDP
                    int destPort = ((packet.get(22) & 0xFF) << 8) | (packet.get(23) & 0xFF);
                    
                    // Map common ports to apps (simplified)
                    return mapPortToApp(destPort);
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "Error parsing packet", e);
        }
        return null;
    }

    private String mapPortToApp(int port) {
        // This is a simplified mapping - you'd need a more comprehensive solution
        switch (port) {
            case 443:
            case 5228: // Google Play Services
                return "google";
            case 5222: // WhatsApp
                return "com.whatsapp";
            case 3478: // Facebook
                return "com.facebook.katana";
            default:
                return null;
        }
    }
    
    private void stopVPN(Intent intent) {
        if (vpnThread != null) {
            vpnThread.interrupt();
        }
        if (vpnInterface != null) {
            try {
                vpnInterface.close();
            } catch (Exception e) {
                Log.e(TAG, "Error closing VPN interface", e);
            }
            vpnInterface = null;
        }
    }
    
    private Notification createNotification(String text) {
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, "vpn_channel")
            .setContentTitle("DoomScrollStopper")
            .setContentText(text)
            .setSmallIcon(R.drawable.ic_vpn)
            .setPriority(NotificationCompat.PRIORITY_LOW);
    
        return builder.build();
    }
    

    public void setCallback(AppMonitorCallback callback) {
        this.callback = callback;
    }
    
    @Override
    public void onDestroy() {
            stopVPN(null);
        super.onDestroy();
    }
}
