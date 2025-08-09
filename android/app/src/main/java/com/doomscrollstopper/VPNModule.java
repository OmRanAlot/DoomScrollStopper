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

import java.util.List;
import java.util.HashSet;
import java.util.Set;
import android.app.ActivityManager;
import android.content.Context;
import android.net.VpnService;
import android.os.Build;

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
        try {
            appMonitor.startMonitoring();
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("START_ERROR", e.getMessage());
        }
    }
    
    @ReactMethod
    public void stopMonitoring(Promise promise) {
        try {
            appMonitor.stopMonitoring();
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("STOP_ERROR", e.getMessage());
        }
    }
    
    @ReactMethod
    public void setBlockedApps(ReadableArray apps, Promise promise) {
        try {
            Set<String> blockedApps = new HashSet<>();
            for (int i = 0; i < apps.size(); i++) {
                blockedApps.add(apps.getString(i));
            }
            appMonitor.setBlockedApps(blockedApps);
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
            
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("PERMISSION_ERROR", e.getMessage());
        }
    }
    
    @ReactMethod
    public void requestOverlayPermission(Promise promise) {
        try {
            Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            reactContext.startActivity(intent);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("OVERLAY_PERMISSION_ERROR", e.getMessage());
        }
    }
    
    @ReactMethod
    public void getInstalledApps(Promise promise) {
        try {
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
            
            promise.resolve(apps);
        } catch (Exception e) {
            promise.reject("GET_APPS_ERROR", e.getMessage());
        }
    }
    
    private WritableMap createAppEvent(String packageName, String appName) {
        WritableMap event = Arguments.createMap();
        event.putString("packageName", packageName);
        event.putString("appName", appName);
        event.putDouble("timestamp", System.currentTimeMillis());
        return event;
    }
    
    private void sendEvent(String eventName, WritableMap params) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
    }

}
