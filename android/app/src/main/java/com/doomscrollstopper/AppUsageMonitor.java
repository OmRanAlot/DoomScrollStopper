package com.doomscrollstopper;

import android.app.usage.UsageStats;
import android.app.usage.UsageEvents;
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
import android.content.SharedPreferences;


import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.SortedMap;
import java.util.TreeMap;
import java.util.concurrent.ConcurrentHashMap;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

/*
 * AppUsageMonitor
 * ----------------
 * Core detection loop for foreground app usage and overlay intervention.
 * Responsibilities:
 *  - Poll UsageStats for current foreground app at 1s interval (battery-aware)
 *  - Show delay overlay for apps in the blocked list, unless explicitly allowed this session
 *  - Maintain a lightweight in-memory session allowlist (`allowedThisSession`)
 *  - Persist blocked apps in SharedPreferences (doomscroll_prefs)
 *
 * Notes on Performance & Battery:
 *  - Polling is kept at 1000ms to balance responsiveness and battery usage.
 *  - Handler bound to main Looper schedules the runnable only while `isMonitoring` is true.
 *  - Overlay operations run on UI thread; avoid heavy work inside callbacks.
 */

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
    // Cooldown tracking to prevent immediate re-triggers after dismissal or allow
    private final Map<String, Long> popupCooldown = new ConcurrentHashMap<>();
    private static final long POPUP_COOLDOWN_MS = 1000; // 1s cooldown to avoid rapid re-triggers after Continue

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
        try{
            if (!hasUsageStatsPermission()) {
                requestUsageStatsPermission();
                return;
            }
            
            if (!hasOverlayPermission()) {
                requestOverlayPermission();
                return;
            }
            
            loadBlockedAppsFromPrefs();
            Log.d(TAG, "Loaded blocked apps count=" + (blockedApps != null ? blockedApps.size() : 0));
            isMonitoring = true;

            new Thread(() -> {
                monitorApps();
            }).start();
        } catch (Exception e){
            Log.e(TAG, "Error starting monitoring", e);
        }
    }
    
    public void loadBlockedAppsFromPrefs() {
        SharedPreferences prefs = context.getSharedPreferences("doomscroll_prefs", Context.MODE_PRIVATE);
        Set<String> appSet = prefs.getStringSet("blocked_apps", new HashSet<>());
        blockedApps = new HashSet<>(appSet); // make a copy
    }

    private void monitorApps() {
        // Use the class-level handler to avoid redundant instances and reduce GC pressure.
        
        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                try{
                    String foregroundApp = getCurrentForegroundApp();
                    if (foregroundApp == null) {
                        Log.d(TAG, "Foreground app is null; skipping this tick");
                    }
        
                    if (foregroundApp != null && !foregroundApp.equals(context.getPackageName())) {
                        String appName = getAppName(foregroundApp);
                        boolean isBlocked = blockedApps.contains(foregroundApp);
                        boolean isAllowed = allowedThisSession.contains(foregroundApp);
                        Long lastShown = popupCooldown.get(foregroundApp);
                        long now = System.currentTimeMillis();
                        long remainingCooldown = (lastShown == null) ? 0 : Math.max(0, POPUP_COOLDOWN_MS - (now - lastShown));
                        Log.d(TAG, "Tick fgApp=" + foregroundApp + " blocked=" + isBlocked + " allowedThisSession=" + isAllowed + " overlayActive=" + isOverlayActive + " cooldownRemainingMs=" + remainingCooldown);
        
                        // Always trigger block if app is in blocked list
                        if (isBlocked && !isOverlayActive && !isAllowed) {
                            // Respect cooldown per app to prevent rapid re-triggers
                            if (lastShown != null && (now - lastShown) < POPUP_COOLDOWN_MS) {
                                Log.d(TAG, "Cooldown active for " + foregroundApp + ", skipping overlay");
                            } else {
                            Log.d("AppMonitor", "Blocked app detected: " + appName);
                            handleBlockedApp(foregroundApp, appName);
                            }
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
                } catch (Exception e){
                    Log.e(TAG, "Error monitoring apps", e);
                }   
            }
        };
    
        handler.post(runnable);
    }
    
    private String getCurrentForegroundApp() {
        // Prefer UsageEvents for higher fidelity foreground detection
        try {
            long endTime = System.currentTimeMillis();
            long startTime = endTime - 60000; // look back 60 seconds to capture last foreground event

            UsageEvents events = usageStatsManager.queryEvents(startTime, endTime);
            UsageEvents.Event event = new UsageEvents.Event();
            String lastForeground = null;
            long lastTs = 0;

            while (events != null && events.hasNextEvent()) {
                events.getNextEvent(event);
                int type = event.getEventType();
                long ts = event.getTimeStamp();
                if (ts >= lastTs) {
                    if (type == UsageEvents.Event.MOVE_TO_FOREGROUND || type == UsageEvents.Event.ACTIVITY_RESUMED) {
                        lastForeground = event.getPackageName();
                        lastTs = ts;
                    }
                }
            }

            if (lastForeground != null) {
                Log.d(TAG, "UsageEvents detected foreground: " + lastForeground + " at ts=" + lastTs);
                return lastForeground;
            }

            // Fallback to aggregated UsageStats if no events found
            List<UsageStats> stats = usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                endTime - 1000 * 60,
                endTime
            );
            if (stats != null && !stats.isEmpty()) {
                SortedMap<Long, UsageStats> sortedMap = new TreeMap<>();
                for (UsageStats usageStats : stats) {
                    sortedMap.put(usageStats.getLastTimeUsed(), usageStats);
                }
                if (!sortedMap.isEmpty()) {
                    String pkg = sortedMap.get(sortedMap.lastKey()).getPackageName();
                    Log.d(TAG, "Fallback UsageStats foreground: " + pkg);
                    return pkg;
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "Error getting current foreground app", e);
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
            // POPUP_MARKER: native overlay popup entry point (searchable)
            Log.i(TAG, "POPUP_MARKER showing delay overlay for " + appName + " (" + packageName + ")");
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
            
            // Start countdown; during this period the user cannot immediately continue.
            startCountdown(countdownText, continueButton, 15);
            
            continueButton.setOnClickListener(v -> {
                // Allow this app for the rest of the current session
                allowedThisSession.add(packageName);
                // Stamp cooldown to avoid rapid re-triggers
                popupCooldown.put(packageName, System.currentTimeMillis());
                removeOverlay();
                // App continues to open
            });
            
            backButton.setOnClickListener(v -> {
                // Don't add to allowed session when going back to home
                allowedThisSession.remove(packageName);
                // Intentionally NO cooldown on Back; we want immediate overlay on reopen
                Log.d(TAG, "Back pressed: no cooldown; will show immediately on next open for " + packageName);
                removeOverlay();

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
    }

    public String getAppName(String packageName) {
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
    
    public Set<String> getBlockedApps() {
        return new HashSet<>(blockedApps);
    }
    
    // New methods for getting app usage statistics
    public long getAppUsageTime(String packageName, long startTime, long endTime) {
        try {
            if (!hasUsageStatsPermission()) {
                return 0;
            }
            
            List<UsageStats> stats = usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                startTime,
                endTime
            );
            
            long totalTime = 0;
            for (UsageStats stat : stats) {
                if (stat.getPackageName().equals(packageName)) {
                    totalTime += stat.getTotalTimeInForeground();
                }
            }
            return totalTime;
        } catch (Exception e) {
            Log.e(TAG, "Error getting app usage time for " + packageName, e);
            return 0;
        }
    }
    
    public long getTotalScreenTime(long startTime, long endTime) {
        try {
            if (!hasUsageStatsPermission()) {
                return 0;
            }
            
            List<UsageStats> stats = usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                startTime,
                endTime
            );
            
            long totalTime = 0;
            for (UsageStats stat : stats) {
                totalTime += stat.getTotalTimeInForeground();
            }
            return totalTime;
        } catch (Exception e) {
            Log.e(TAG, "Error getting total screen time", e);
            return 0;
        }
    }
    
    public List<AppUsageInfo> getTopAppsByUsage(long startTime, long endTime, int limit) {
        List<AppUsageInfo> appUsageList = new ArrayList<>();
        
        try {
            if (!hasUsageStatsPermission()) {
                return appUsageList;
            }
            
            List<UsageStats> stats = usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                startTime,
                endTime
            );
            
            // Group by package name and sum up usage time
            Map<String, Long> appUsageMap = new HashMap<>();
            for (UsageStats stat : stats) {
                String packageName = stat.getPackageName();
                long usageTime = stat.getTotalTimeInForeground();
                
                if (appUsageMap.containsKey(packageName)) {
                    appUsageMap.put(packageName, appUsageMap.get(packageName) + usageTime);
                } else {
                    appUsageMap.put(packageName, usageTime);
                }
            }
            
            // Convert to AppUsageInfo objects and sort by usage time
            for (Map.Entry<String, Long> entry : appUsageMap.entrySet()) {
                String packageName = entry.getKey();
                long usageTime = entry.getValue();
                
                if (usageTime > 0) { // Only include apps with actual usage
                    String appName = getAppName(packageName);
                    appUsageList.add(new AppUsageInfo(packageName, appName, usageTime));
                }
            }
            
            // Sort by usage time (descending) and limit results
            appUsageList.sort((a, b) -> Long.compare(b.usageTime, a.usageTime));
            if (limit > 0 && appUsageList.size() > limit) {
                appUsageList = appUsageList.subList(0, limit);
            }
            
        } catch (Exception e) {
            Log.e(TAG, "Error getting top apps by usage", e);
        }
        
        return appUsageList;
    }
    
    public long getTodayScreenTime() {
        long endTime = System.currentTimeMillis();
        long startTime = endTime - (24 * 60 * 60 * 1000); // Last 24 hours
        return getTotalScreenTime(startTime, endTime);
    }
    
    public long getAppTodayUsageTime(String packageName) {
        long endTime = System.currentTimeMillis();
        long startTime = endTime - (24 * 60 * 60 * 1000); // Last 24 hours
        return getAppUsageTime(packageName, startTime, endTime);
    }
    
    // Helper class to hold app usage information
    public static class AppUsageInfo {
        public String packageName;
        public String appName;
        public long usageTime;
        
        public AppUsageInfo(String packageName, String appName, long usageTime) {
            this.packageName = packageName;
            this.appName = appName;
            this.usageTime = usageTime;
        }
    }
}