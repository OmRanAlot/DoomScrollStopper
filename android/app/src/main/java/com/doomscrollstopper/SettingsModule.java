package com.doomscrollstopper;

import android.content.SharedPreferences;
import android.content.Context;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.Callback;

import java.util.HashSet;
import java.util.Set;

public class SettingsModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    
    public SettingsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "SettingsModule";
    }

    @ReactMethod
    public void getBlockedApps(com.facebook.react.bridge.Callback callback) {
        SharedPreferences prefs = reactContext.getSharedPreferences("doomscroll_prefs", Context.MODE_PRIVATE);
        Set<String> blockedApps = prefs.getStringSet("blocked_apps", new HashSet<>());
        callback.invoke((Object[]) blockedApps.toArray(new String[0]));
    }

    @ReactMethod
    public void saveBlockedApps(ReadableArray apps) {
        SharedPreferences prefs = reactContext.getSharedPreferences("doomscroll_prefs", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        Set<String> appSet = new HashSet<>();

        for (int i = 0; i < apps.size(); i++) {
            appSet.add(apps.getString(i));
        }
        
        editor.putStringSet("blocked_apps", appSet);
        editor.apply();
    }

}
