package com.doomscrollstopper;

import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.os.Build;
import androidx.annotation.RequiresApi;

import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

public class ScreenTimeTracker {
    private Context context;
    
    public ScreenTimeTracker(Context context) {
        this.context = context;
    }
    
    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP_MR1)
    public Map<String, Long> getScreenTimeStats() {
        Map<String, Long> result = new HashMap<>();
        try {
            UsageStatsManager usageStatsManager = (UsageStatsManager) context.getSystemService(Context.USAGE_STATS_SERVICE);
            
            // Get calendar for time range (last 24 hours)
            Calendar calendar = Calendar.getInstance();
            long endTime = calendar.getTimeInMillis();
            calendar.add(Calendar.DAY_OF_YEAR, -1);
            long startTime = calendar.getTimeInMillis();
            
            // Get usage stats
            List<UsageStats> stats = usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY, 
                startTime, 
                endTime
            );
            
            // Calculate total screen time
            long totalScreenTime = 0;
            for (UsageStats usageStats : stats) {
                totalScreenTime += usageStats.getTotalTimeInForeground();
            }
            
            // Convert to minutes
            totalScreenTime = TimeUnit.MILLISECONDS.toMinutes(totalScreenTime);
            
            result.put("totalScreenTime", totalScreenTime);
            result.put("startTime", startTime);
            result.put("endTime", endTime);
            
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return result;
    }
}
