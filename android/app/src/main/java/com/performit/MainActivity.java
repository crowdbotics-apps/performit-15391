package com.performit;

import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.os.Bundle;
import android.util.Base64;
import android.util.Log;

import org.devio.rn.splashscreen.SplashScreen;
import com.facebook.react.ReactActivity;

import java.security.MessageDigest;


public class MainActivity extends ReactActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        generateKeyHash();
        SplashScreen.show(this, R.style.SplashScreenTheme);
        super.onCreate(savedInstanceState);
    }
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Performit";
    }

    private String generateKeyHash() {
        try {
            PackageInfo info = getPackageManager().getPackageInfo(getPackageName(), PackageManager.GET_SIGNATURES);
            for (Signature signature : info.signatures) {
                MessageDigest md = (MessageDigest.getInstance("SHA"));
                md.update(signature.toByteArray());
                String hashKey = new String(Base64.encode(md.digest(), 0));
                Log.e("printHashKey", "printHashKey() Hash Key: " + hashKey);
            }
        }catch (Exception e) {
            Log.e("exception", e.toString());
        }
        return "key hash not found";
    }
}
