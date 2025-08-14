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
import android.app.ActivityManager;
import android.content.Context;
import android.net.VpnService;
import android.os.Build;
import android.util.Log;
//This module doesn't send any packet or traffic data back to React Native.
//It's just a "control switch" — start/stop the VPN.
// Just turns the VPN on or off from react native code

public class VPNModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "VPNModule";
    private ReactApplicationContext reactContext;
    private AppUsageMonitor appMonitor;
    
    public VPNModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.appMonitor = new AppUsageMonitor(reactContext);
        
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
    
    @ReactMethod
    public void startMonitoring(Promise promise) {
        Log.d("VPNModule", "startMonitoring called");
        try {
            Log.d("VPNModule", "Starting monitoring");
            appMonitor.startMonitoring();
            Log.d("VPNModule", "startMonitoring success, resolving promise");
            promise.resolve(true);
        } catch (Exception e) {
            Log.d("VPNModule", "startMonitoring failed, rejecting promise");
            promise.reject("START_ERROR", e.getMessage());
        }
    }
    
    @ReactMethod
    public void stopMonitoring(Promise promise) {
        try {
            Log.d("VPNModule", "Stopping monitoring");
            appMonitor.stopMonitoring();
            Log.d("VPNModule", "stopMonitoring success, resolving promise");
            promise.resolve(true);
        } catch (Exception e) {
            Log.d("VPNModule", "stopMonitoring failed, rejecting promise");
            promise.reject("STOP_ERROR", e.getMessage());
        }
    }
    
    @ReactMethod
    public void setBlockedApps(ReadableArray apps, Promise promise) {
        try {
            Log.d("VPNModule", "Setting blocked apps");
            Set<String> blockedApps = new HashSet<>();
            for (int i = 0; i < apps.size(); i++) {
                blockedApps.add(apps.getString(i));
            }
            appMonitor.setBlockedApps(blockedApps);
            Log.d("VPNModule", "setBlockedApps success, resolving promise");
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
                // Permission needed
                reactContext.startActivityForResult(intent, 1, null);
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


}
