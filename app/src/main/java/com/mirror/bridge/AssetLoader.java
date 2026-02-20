package com.mirror.bridge;

import android.app.Activity;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class AssetLoader {

    public static String load(Activity activity, String filename) {
        try {
            InputStream is = activity.getAssets().open(filename);
            BufferedReader reader = new BufferedReader(new InputStreamReader(is));

            StringBuilder builder = new StringBuilder();
            String line;

            while ((line = reader.readLine()) != null) {
                builder.append(line).append("\n");
            }

            reader.close();
            is.close();

            return builder.toString();
        } catch (IOException e) {
            return "";
        }
    }
}
