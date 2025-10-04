package com.doomscrollstopper;


import android.content.Intent;
import android.provider.Settings;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.Callback;

import java.util.List;
import java.util.HashSet;
import java.util.Set;
import java.util.ArrayList;
import android.app.ActivityManager;
import android.content.Context;
import android.net.VpnService;
import android.os.Build;
import android.util.Log;
import android.app.AppOpsManager;
import android.content.pm.ApplicationInfo;
import android.app.usage.UsageStatsManager;
import android.content.Intent;
import android.provider.Settings;
import java.util.Map;
import java.util.HashMap;
import android.content.pm.PackageManager;

//This module doesn't send any packet or traffic data back to React Native.
//It's just a "control switch" — start/stop the VPN.
// Just turns the VPN on or off from react native code

public class VPNModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "VPNModule";
    private ReactApplicationContext reactContext;
    private AppUsageMonitor appMonitor;
    private ScreenTimeTracker screenTimeTracker;
    
    public VPNModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.appMonitor = new AppUsageMonitor(reactContext);
        this.screenTimeTracker = new ScreenTimeTracker(reactContext);
        
        // Set up listener
        appMonitor.setListener(new AppUsageMonitor.AppDetectionListener() {
            @Override
            public void onAppDetected(String packageName, String appName) {
                sendEvent("onAppDetected", createAppEvent(packageName, appName));
            }
            
            @Override
            public void onBlockedAppOpened(String packageName, String appName) {
                sendEvent("onBlockedAppOpened", createAppEvent(packageName, appName));
            }
        });
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("isScreenTimePermissionGranted", isUsageAccessGranted());
        return constants;
    }

    private boolean isUsageAccessGranted() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            try {
                PackageManager packageManager = reactContext.getPackageManager();
                ApplicationInfo applicationInfo = packageManager.getApplicationInfo(reactContext.getPackageName(), 0);
                AppOpsManager appOps = (AppOpsManager) reactContext.getSystemService(Context.APP_OPS_SERVICE);
                int mode = appOps.checkOpNoThrow("android:get_usage_stats", applicationInfo.uid, applicationInfo.packageName);
                return (mode == AppOpsManager.MODE_ALLOWED);
            } catch (Exception e) {
                return false;
            }
        }
        return false;
    }

    @ReactMethod
    public void openUsageAccessSettings() {
        Intent intent = new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        reactContext.startActivity(intent);
    }

    @ReactMethod
    public void startMonitoring(Promise promise) {
        Log.d("VPNModule", "startMonitoring called");
        try {
            Log.d("VPNModule", "Starting monitoring");

            Intent serviceIntent = new Intent(reactContext, MyVpnService.class);
            serviceIntent.setAction("START_VPN");
            
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                reactContext.startForegroundService(serviceIntent);
            } else {
                reactContext.startService(serviceIntent);
            }

            appMonitor.startMonitoring();
            Log.d("VPNModule", "startMonitoring success, resolving promise");
            promise.resolve(true);
        } catch (Exception e) {
            Log.d("VPNModule", "startMonitoring failed, rejecting promise");
            promise.reject("START_ERROR", e.getMessage());
        }
    }
    
    @ReactMethod
    public void getScreenTimeStats(Promise promise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP_MR1) {
                Map<String, Long> stats = screenTimeTracker.getScreenTimeStats();
                WritableMap result = Arguments.createMap();
                result.putDouble("totalScreenTime", stats.get("totalScreenTime"));
                result.putDouble("startTime", stats.get("startTime"));
                result.putDouble("endTime", stats.get("endTime"));
                promise.resolve(result);
            } else {
                promise.reject("UNSUPPORTED", "Screen time tracking requires API level 22 or higher");
            }
        } catch (Exception e) {
            Log.e("VPNModule", "Error getting screen time stats", e);
            promise.reject("ERROR", "Failed to get screen time stats: " + e.getMessage());
        }
    }
    
    @ReactMethod
    public void stopMonitoring(Promise promise) {
        try {
            Log.d("VPNModule", "Stopping monitoring");
            appMonitor.stopMonitoring();
            
            Intent serviceIntent = new Intent(reactContext, MyVpnService.class);
            serviceIntent.setAction("STOP_VPN");
            reactContext.stopService(serviceIntent);
            
            Log.d("VPNModule", "stopMonitoring success, resolving promise");
            promise.resolve(true);
        } catch (Exception e) {
            Log.d("VPNModule", "stopMonitoring failed, rejecting promise");
            promise.reject("STOP_ERROR", e.getMessage());
        }
    }
    
    // New methods for getting app usage statistics
    @ReactMethod
    public void getAppUsageTime(String packageName, double startTime, double endTime, Promise promise) {
        try {
            long startTimeLong = (long) startTime;
            long endTimeLong = (long) endTime;
            long usageTime = appMonitor.getAppUsageTime(packageName, startTimeLong, endTimeLong);
            promise.resolve(usageTime);
        } catch (Exception e) {
            Log.e("VPNModule", "Error getting app usage time", e);
            promise.reject("USAGE_STATS_ERROR", e.getMessage());
        }
    }
    
    @ReactMethod
    public void getTotalScreenTime(double startTime, double endTime, Promise promise) {
        try {
            long startTimeLong = (long) startTime;
            long endTimeLong = (long) endTime;
            long totalTime = appMonitor.getTotalScreenTime(startTimeLong, endTimeLong);
            promise.resolve(totalTime);
        } catch (Exception e) {
            Log.e("VPNModule", "Error getting total screen time", e);
            promise.reject("USAGE_STATS_ERROR", e.getMessage());
        }
    }
    
    @ReactMethod
    public void getTodayScreenTime(Promise promise) {
        try {
            long todayTime = appMonitor.getTodayScreenTime();
            promise.resolve(todayTime);
        } catch (Exception e) {
            Log.e("VPNModule", "Error getting today's screen time", e);
            promise.reject("USAGE_STATS_ERROR", e.getMessage());
        }
    }
    
    @ReactMethod
    public void getAppTodayUsageTime(String packageName, Promise promise) {
        try {
            long usageTime = appMonitor.getAppTodayUsageTime(packageName);
            promise.resolve(usageTime);
        } catch (Exception e) {
            Log.e("VPNModule", "Error getting app's today usage time", e);
            promise.reject("USAGE_STATS_ERROR", e.getMessage());
        }
    }
    
    @ReactMethod
    public void getTopAppsByUsage(double startTime, double endTime, int limit, Promise promise) {
        try {
            long startTimeLong = (long) startTime;
            long endTimeLong = (long) endTime;
            List<AppUsageMonitor.AppUsageInfo> topApps = appMonitor.getTopAppsByUsage(startTimeLong, endTimeLong, limit);
            
            WritableArray appArray = Arguments.createArray();
            for (AppUsageMonitor.AppUsageInfo appInfo : topApps) {
                WritableMap appMap = Arguments.createMap();
                appMap.putString("packageName", appInfo.packageName);
                appMap.putString("appName", appInfo.appName);
                appMap.putDouble("usageTime", appInfo.usageTime);
                appArray.pushMap(appMap);
            }
            
            promise.resolve(appArray);
        } catch (Exception e) {
            Log.e("VPNModule", "Error getting top apps by usage", e);
            promise.reject("USAGE_STATS_ERROR", e.getMessage());
        }
    }
    
    @ReactMethod
    public void getBlockedAppsUsageStats(Promise promise) {
        try {
            // Get usage stats for all blocked apps
            Set<String> blockedApps = appMonitor.getBlockedApps();
            WritableArray blockedAppsStats = Arguments.createArray();
            
            long endTime = System.currentTimeMillis();
            long startTime = endTime - (24 * 60 * 60 * 1000); // Last 24 hours
            
            for (String packageName : blockedApps) {
                long usageTime = appMonitor.getAppUsageTime(packageName, startTime, endTime);
                if (usageTime > 0) {
                    WritableMap appStats = Arguments.createMap();
                    appStats.putString("packageName", packageName);
                    appStats.putString("appName", appMonitor.getAppName(packageName));
                    appStats.putDouble("usageTime", usageTime);
                    blockedAppsStats.pushMap(appStats);
                }
            }
            
            promise.resolve(blockedAppsStats);
        } catch (Exception e) {
            Log.e("VPNModule", "Error getting blocked apps usage stats", e);
            promise.reject("USAGE_STATS_ERROR", e.getMessage());
        }
    }
    
    @ReactMethod
    public void setBlockedApps(ReadableArray apps, Promise promise) {
        try {
            Set<String> blockedApps = new HashSet<>();

            if (apps != null){
                if (apps.size() == 1 && apps.getType(0) == com.facebook.react.bridge.ReadableType.String) {
                    String single = apps.getString(0);
                    if (single != null && single.contains(".")) {
                        blockedApps.add(single);
                    }
                } else {
                    // ✅ Normal case: proper array of strings
                    for (int i = 0; i < apps.size(); i++) {
                        if (apps.getType(i) == com.facebook.react.bridge.ReadableType.String) {
                            blockedApps.add(apps.getString(i));
                        }
                    }
                }
            }
    
            // Send intent to service
            Intent intent = new Intent(reactContext, MyVpnService.class);
            intent.setAction("UPDATE_BLOCKED_APPS");
            intent.putStringArrayListExtra("blockedApps", new ArrayList<>(blockedApps));

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                reactContext.startForegroundService(intent);
            } else {
                reactContext.startService(intent);
            }
    
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("SET_APPS_ERROR", e.getMessage());
        }
    }
    
    @ReactMethod
    public void requestPermissions(Promise promise) {
        try {
            // Request usage stats permission
            Intent intent = new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            reactContext.startActivity(intent);
            Log.d("VPNModule", "requestPermissions success, resolving promise");
            promise.resolve(true);
        } catch (Exception e) {
            Log.d("VPNModule", "requestPermissions failed, rejecting promise");
            promise.reject("PERMISSION_ERROR", e.getMessage());
        }
    }
    
    @ReactMethod
    public void requestOverlayPermission(Promise promise) {
        try {
            Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            reactContext.startActivity(intent);
            Log.d("VPNModule", "requestOverlayPermission success, resolving promise");
            promise.resolve(true);
        } catch (Exception e) {
            Log.d("VPNModule", "requestOverlayPermission failed, rejecting promise");
            promise.reject("OVERLAY_PERMISSION_ERROR", e.getMessage());
        }
    }
    
    @ReactMethod
    public void getInstalledApps(Promise promise) {
        try {
            Log.d("VPNModule", "getInstalledApps");
            WritableArray apps = Arguments.createArray();
            
            // Get list of installed apps
            android.content.pm.PackageManager pm = reactContext.getPackageManager();
            List<android.content.pm.ApplicationInfo> packages = pm.getInstalledApplications(
                android.content.pm.PackageManager.GET_META_DATA
            );
            
            for (android.content.pm.ApplicationInfo packageInfo : packages) {
                // Filter out system apps
                if ((packageInfo.flags & android.content.pm.ApplicationInfo.FLAG_SYSTEM) == 0) {
                    WritableMap app = Arguments.createMap();
                    app.putString("packageName", packageInfo.packageName);
                    app.putString("appName", pm.getApplicationLabel(packageInfo).toString());
                    apps.pushMap(app);
                }
            }
            
            Log.d("VPNModule", "getInstalledApps success, resolving promise");
            promise.resolve(apps);
        } catch (Exception e) {
            Log.d("VPNModule", "getInstalledApps failed, rejecting promise");
            promise.reject("GET_APPS_ERROR", e.getMessage());
        }
    }
    
    // VPN related methods (optional - you can remove these if not using VPN)
    @ReactMethod
    public void requestVpnPermission(Promise promise) {
        try {
            Intent intent = VpnService.prepare(reactContext);
            if (intent != null) {
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                reactContext.startActivity(intent);
                promise.resolve(false); // user must grant permission
            } else {
                // Permission already granted
                Log.d("VPNModule", "requestVpnPermission success, resolving promise");
                promise.resolve(true);
            }
        } catch (Exception e) {
            Log.d("VPNModule", "requestVpnPermission failed, rejecting promise");
            promise.reject("VPN_PERMISSION_ERROR", e.getMessage());
        }
    }
    
    @ReactMethod
    public void startVpnService(Promise promise) {
        try {
            Intent serviceIntent = new Intent(reactContext, MyVpnService.class);
            
            serviceIntent.setAction("START_VPN");
            
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                reactContext.startForegroundService(serviceIntent);
            } else {
                reactContext.startService(serviceIntent);
            }
            
            Log.d("VPNModule", "startVpnService success, resolving promise");
            promise.resolve(true);
        } catch (Exception e) {
            Log.d("VPNModule", "startVpnService failed, rejecting promise");
            promise.reject("START_VPN_ERROR", e.getMessage());
        }
    }
    
    @ReactMethod
    public void stopVpnService(Promise promise) {
        try {
            Intent serviceIntent = new Intent(reactContext, MyVpnService.class);
            serviceIntent.setAction("STOP_VPN");
            reactContext.startService(serviceIntent);
            Log.d("VPNModule", "stopVpnService success, resolving promise");
            promise.resolve(true);
        } catch (Exception e) {
            Log.d("VPNModule", "stopVpnService failed, rejecting promise");
            promise.reject("STOP_VPN_ERROR", e.getMessage());
        }
    }

    private WritableMap createAppEvent(String packageName, String appName) {
        WritableMap event = Arguments.createMap();
        event.putString("packageName", packageName);
        event.putString("appName", appName);
        event.putDouble("timestamp", System.currentTimeMillis());
        return event;
    }
    
    // Ensure this method exists and is working
    private void sendEvent(String eventName, WritableMap params) {
        if (reactContext != null && reactContext.hasActiveCatalystInstance()) {
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
        }
    }


    @ReactMethod
    public void checkPermissions(Promise promise) {
        WritableMap result = Arguments.createMap();
        result.putBoolean("overlay", Settings.canDrawOverlays(reactContext));
        result.putBoolean("usage", hasUsageAccessPermission());
        promise.resolve(result);
    }

    private boolean hasUsageAccessPermission() {
        try {
            AppOpsManager appOps = (AppOpsManager) reactContext.getSystemService(Context.APP_OPS_SERVICE);
            ApplicationInfo appInfo = reactContext.getPackageManager().getApplicationInfo(reactContext.getPackageName(), 0);
            int mode = appOps.checkOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS,
                    appInfo.uid, appInfo.packageName);
            return (mode == AppOpsManager.MODE_ALLOWED);
        } catch (Exception e) {
            return false;
        }
}

}
