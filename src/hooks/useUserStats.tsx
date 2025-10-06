import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUserStats = (userId: string | undefined) => {
  const [stats, setStats] = useState({
    timesOpenedThisMonth: 0,
    timesOpenedThisYear: 0,
    daysOpenedThisYear: 0,
    surahsRead: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const initializeStats = async () => {
      try {
        // Get or create user stats
        const { data: existingStats, error: fetchError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (fetchError) throw fetchError;

        const today = new Date().toISOString().split('T')[0];
        const isNewDay = !existingStats || existingStats.last_opened_date !== today;
        const isNewMonth = !existingStats || 
          new Date(existingStats.last_opened_date).getMonth() !== new Date().getMonth();
        const isNewYear = !existingStats || 
          new Date(existingStats.last_opened_date).getFullYear() !== new Date().getFullYear();

        let updatedStats = existingStats;

        if (!existingStats) {
          // Create new stats record
          const { data: newStats, error: insertError } = await supabase
            .from('user_stats')
            .insert({
              user_id: userId,
              times_opened_this_month: 1,
              times_opened_this_year: 1,
              days_opened_this_year: 1,
              last_opened_date: today,
              surahs_read: 0,
            })
            .select()
            .single();

          if (insertError) throw insertError;
          updatedStats = newStats;
        } else {
          // Update existing stats
          const newTimesMonth = isNewMonth ? 1 : (existingStats.times_opened_this_month || 0) + 1;
          const newTimesYear = isNewYear ? 1 : (existingStats.times_opened_this_year || 0) + 1;
          const newDaysYear = isNewYear ? 1 : 
            (isNewDay ? (existingStats.days_opened_this_year || 0) + 1 : existingStats.days_opened_this_year);

          const { data: updated, error: updateError } = await supabase
            .from('user_stats')
            .update({
              times_opened_this_month: newTimesMonth,
              times_opened_this_year: newTimesYear,
              days_opened_this_year: newDaysYear,
              last_opened_date: today,
            })
            .eq('user_id', userId)
            .select()
            .single();

          if (updateError) throw updateError;
          updatedStats = updated;
        }

        if (updatedStats) {
          setStats({
            timesOpenedThisMonth: updatedStats.times_opened_this_month || 0,
            timesOpenedThisYear: updatedStats.times_opened_this_year || 0,
            daysOpenedThisYear: updatedStats.days_opened_this_year || 0,
            surahsRead: updatedStats.surahs_read || 0,
          });
        }
      } catch (error) {
        console.error('Error initializing user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeStats();
  }, [userId]);

  return { stats, loading };
};