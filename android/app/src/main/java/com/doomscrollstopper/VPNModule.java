package com.doomscrollstopper;

import android.content.Intent;
import android.net.VpnService;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


//This module doesn't send any packet or traffic data back to React Native.
//It's just a "control switch" — start/stop the VPN.
// Just turns the VPN on or off from react native code
public class VPNModule extends ReactContextBaseJavaModule {
    public VPNModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }


    @Override
    public String getName() {
        return "VPNModule";
    }

    @ReactMethod
    public void startVPN() {
        Intent intent = new Intent(getReactApplicationContext(),MyVpnService.class);
        getReactApplicationContext().startService(intent);
    }

    @ReactMethod
    public void stopVPN() {
        Intent intent = new Intent(getReactApplicationContext(),MyVpnService.class);
        getReactApplicationContext().stopService(intent);
    }

}
