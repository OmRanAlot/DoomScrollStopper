package com.doomscrollstopper;

import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.graphics.PixelFormat;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.TextView;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.SortedMap;
import java.util.TreeMap;
import java.util.concurrent.ConcurrentHashMap;

public class AppUsageMonitor {
    private static final String TAG = "AppUsageMonitor";
    private Context context;
    private UsageStatsManager usageStatsManager;
    private Handler handler;
    private boolean isMonitoring = false;
    private Set<String> blockedApps = new HashSet<>();
    private ConcurrentHashMap<String, Long> appDelayTimes = new ConcurrentHashMap<>();
    private WindowManager windowManager;
    private View overlayView;
    private String lastDetectedApp = "";
    private boolean isOverlayActive = false;
    private String lastAppPackage = "";
    private String currentForegroundApp = "";
    private Set<String> allowedThisSession = new HashSet<>();


    public interface AppDetectionListener {
        void onAppDetected(String packageName, String appName);
        void onBlockedAppOpened(String packageName, String appName);
    }
    
    private AppDetectionListener listener;
    
    public AppUsageMonitor(Context context) {
        this.context = context;
        this.usageStatsManager = (UsageStatsManager) context.getSystemService(Context.USAGE_STATS_SERVICE);
        this.windowManager = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
        this.handler = new Handler(Looper.getMainLooper());
    }
    
    public void startMonitoring() {
        if (!hasUsageStatsPermission()) {
            requestUsageStatsPermission();
            return;
        }
        
        if (!hasOverlayPermission()) {
            requestOverlayPermission();
            return;
        }
        
        isMonitoring = true;
        monitorApps();
    }
    
    private void monitorApps() {
        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                String foregroundApp = getCurrentForegroundApp();
    
                if (foregroundApp != null && !foregroundApp.equals(context.getPackageName())) {
                    String appName = getAppName(foregroundApp);
    
                    // Always trigger block if app is in blocked list
                    if (blockedApps.contains(foregroundApp) && !isOverlayActive 
                        && !allowedThisSession.contains(foregroundApp)) {
                        Log.d("AppMonitor", "Blocked app detected: " + appName);
                        handleBlockedApp(foregroundApp, appName);
                    }

                    // If user switches away from an allowed app, remove it from allowed session
                    if (!foregroundApp.equals(currentForegroundApp)) {
                        if (currentForegroundApp != null && !currentForegroundApp.isEmpty()) {
                            allowedThisSession.remove(currentForegroundApp);
                        }
                        currentForegroundApp = foregroundApp;
                    }   

                }   
                // // Repeat every second
                // handler.postDelayed(this, 1000);

                // Repeat every second
                if (isMonitoring) {
                    handler.postDelayed(this, 1000);
                }   
            }
        };
    
        handler.post(runnable);
    }
    
    private String getCurrentForegroundApp() {
        long currentTime = System.currentTimeMillis();
        List<UsageStats> stats = usageStatsManager.queryUsageStats(
            UsageStatsManager.INTERVAL_DAILY, 
            currentTime - 1000 * 60, // Last minute
            currentTime
        );
        
        if (stats != null && !stats.isEmpty()) {
            SortedMap<Long, UsageStats> sortedMap = new TreeMap<>();
            for (UsageStats usageStats : stats) {
                sortedMap.put(usageStats.getLastTimeUsed(), usageStats);
            }
            
            if (!sortedMap.isEmpty()) {
                return sortedMap.get(sortedMap.lastKey()).getPackageName();
            }
        }
        return null;
    }
    
    private void handleBlockedApp(String packageName, String appName) {
        if (isOverlayActive && packageName.equals(lastAppPackage)) {
            Log.d(TAG, "Overlay already active for: " + appName);
            return;
        }
    
        isOverlayActive = true;
        showDelayOverlay(packageName, appName);
    }
    
    private void showDelayOverlay(String packageName, String appName) {
        if (isOverlayActive && packageName.equals(lastAppPackage)) {
            // Already showing for this app — don't restart
            return;
        }
        lastAppPackage = packageName;
        isOverlayActive = true;

        handler.post(() -> {
            if (overlayView != null) {
                windowManager.removeView(overlayView);
            }
            
            // Create overlay view
            LayoutInflater inflater = LayoutInflater.from(context);
            overlayView = inflater.inflate(R.layout.delay_overlay, null);
            
            TextView titleText = overlayView.findViewById(R.id.title);
            TextView countdownText = overlayView.findViewById(R.id.countdown);
            Button continueButton = overlayView.findViewById(R.id.continueButton);
            Button backButton = overlayView.findViewById(R.id.backButton);
            
            titleText.setText("Opening " + appName);
            
            WindowManager.LayoutParams params = new WindowManager.LayoutParams(
                WindowManager.LayoutParams.MATCH_PARENT,
                WindowManager.LayoutParams.MATCH_PARENT,
                Build.VERSION.SDK_INT >= Build.VERSION_CODES.O ?
                    WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY :
                    WindowManager.LayoutParams.TYPE_PHONE,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE |
                WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
                PixelFormat.TRANSLUCENT
            );
            
            params.gravity = Gravity.CENTER;
            windowManager.addView(overlayView, params);
            
            // Start countdown
            startCountdown(countdownText, continueButton, 15);
            
            continueButton.setOnClickListener(v -> {
                removeOverlay();
                // App continues to open
            });
            
            backButton.setOnClickListener(v -> {
                removeOverlay();

                // Don't add to allowed session when going back to home
                allowedThisSession.remove(packageName);

                // Return to home screen
                Intent homeIntent = new Intent(Intent.ACTION_MAIN);
                homeIntent.addCategory(Intent.CATEGORY_HOME);
                homeIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(homeIntent);
            });
        });
    }
    
    private void startCountdown(TextView countdownText, Button continueButton, int seconds) {
        continueButton.setEnabled(false);
        
        handler.postDelayed(new Runnable() {
            int remaining = seconds;
            
            @Override
            public void run() {
                if (overlayView == null) return;
                
                countdownText.setText("Wait " + remaining + " seconds");
                remaining--;
                
                if (remaining >= 0) {
                    handler.postDelayed(this, 1000);
                } else {
                    countdownText.setText("You can continue now");
                    continueButton.setEnabled(true);
                }
            }
        }, 0);
    }
    
    private void removeOverlay() {
        if (overlayView != null) {
            windowManager.removeView(overlayView);
            overlayView = null;
        }
        isOverlayActive = false;
        lastAppPackage = "";

        // Add the current app to allowed session when user clicks "continue"
        String currentApp = getCurrentForegroundApp();
        if (currentApp != null && blockedApps.contains(currentApp)) {
            allowedThisSession.add(currentApp);
        }   

    }

    private String getAppName(String packageName) {
        try {
            PackageManager pm = context.getPackageManager();
            ApplicationInfo appInfo = pm.getApplicationInfo(packageName, 0);
            return pm.getApplicationLabel(appInfo).toString();
        } catch (PackageManager.NameNotFoundException e) {
            return packageName;
        }
    }
    
    private boolean hasUsageStatsPermission() {
        long currentTime = System.currentTimeMillis();
        List<UsageStats> stats = usageStatsManager.queryUsageStats(
            UsageStatsManager.INTERVAL_DAILY,
            currentTime - 1000 * 60,
            currentTime
        );
        return stats != null && !stats.isEmpty();
    }
    
    private void requestUsageStatsPermission() {
        Intent intent = new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(intent);
    }
    
    private boolean hasOverlayPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            return Settings.canDrawOverlays(context);
        }
        return true;
    }
    
    private void requestOverlayPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(intent);
        }
    }
    
    public void stopMonitoring() {
        isMonitoring = false;
        removeOverlay();
    }
    
    public void setBlockedApps(Set<String> apps) {
        this.blockedApps = apps;
    }
    
    public void setListener(AppDetectionListener listener) {
        this.listener = listener;
    }
}