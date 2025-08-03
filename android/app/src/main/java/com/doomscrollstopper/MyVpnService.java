package com.doomscrollstopper;
import android.net.VpnService;
import android.content.Intent;
import android.os.ParcelFileDescriptor;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import android.util.Log;

// The actual VPN that READS the incoming data
public class MyVpnService extends VpnService {
    
    private ParcelFileDescriptor vpnInterface = null;
    private Thread vpnThread;

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (vpnInterface == null) {
            Builder builder = new Builder();
            builder.setSession("Doom Scroll Stopper");
            builder.addAddress("10.0.0.2", 24);
            builder.addRoute("0.0.0.0", 0);

            vpnInterface = builder.establish();

            vpnThread = new Thread(() -> {
                try {
                    FileInputStream in = new FileInputStream(vpnInterface.getFileDescriptor());
                    FileOutputStream out = new FileOutputStream(vpnInterface.getFileDescriptor());
                    byte[] buffer = new byte[32767];
                    while (true) {
                        int n = in.read(buffer);
                        if (n <= 0) {
                            inspectPacket(buffer, n);
                        }
                        out.write(buffer, 0, n);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });
            vpnThread.start();
        }   
        
        return START_STICKY;
    }

    private void inspectPacket(byte[] buffer, int length) {
        Log.d("MyVpnService", "Packet received: " + length);
    }

    @Override
    public void onDestroy() {
        try {
            if (vpnInterface != null) {
                vpnInterface.close();
            }
            if (vpnThread != null) {
                vpnThread.interrupt();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        super.onDestroy();
        
    }
}
