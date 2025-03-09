
import React from 'react';
import { format } from 'date-fns';
import { Book, Coffee, Clock } from 'lucide-react';
import { DailySchedule } from '@/lib/data';
import { generateDailyStudySessions } from '@/lib/studyPlanGenerator';
import { cn } from '@/lib/utils';

interface StudyPlanProps {
  date?: Date;
  className?: string;
}

export function StudyPlan({ date = new Date(), className }: StudyPlanProps) {
  const [schedule, setSchedule] = React.useState<DailySchedule | null>(null);
  
  React.useEffect(() => {
    const dailySchedule = generateDailyStudySessions(date);
    setSchedule(dailySchedule);
  }, [date]);
  
  if (!schedule) {
    return <div className="h-96 flex items-center justify-center">Loading schedule...</div>;
  }
  
  // Sort all activities chronologically
  const allActivities = [
    ...schedule.studySessions.map(session => ({
      ...session,
      type: 'study' as const,
      time: new Date(session.date).getHours(),
    })),
    ...schedule.breakActivities.map(activity => ({
      ...activity,
      type: activity.type,
      time: new Date(activity.date).getHours(),
    }))
  ].sort((a, b) => a.time - b.time);
  
  return (
    <div className={cn("p-6 glass rounded-xl", className)}>
      <h3 className="text-lg font-semibold mb-4">
        {format(date, 'EEEE, MMMM d')}
      </h3>
      
      <div className="space-y-4">
        {allActivities.map((activity, index) => {
          const startTime = activity.time;
          const endTime = activity.type === 'study' 
            ? activity.time + Math.ceil(activity.duration / 60)
            : activity.time + Math.ceil(activity.duration / 60);
          
          return (
            <div 
              key={activity.id} 
              className={cn(
                "p-4 rounded-lg border transition-all duration-300 hover:shadow-md",
                activity.type === 'study' 
                  ? "bg-primary/5 border-primary/20" 
                  : "bg-secondary/30 border-secondary/40"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {activity.type === 'study' ? (
                    <Book className="text-primary" size={20} />
                  ) : activity.type === 'cooking' ? (
                    <Coffee className="text-orange-500" size={20} />
                  ) : (
                    <Clock className="text-gray-500" size={20} />
                  )}
                  
                  <div>
                    <h4 className="font-medium">
                      {activity.type === 'study' 
                        ? activity.notes 
                        : activity.type === 'cooking' 
                          ? 'Cooking/Meal Time' 
                          : 'Rest Break'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {startTime}:00 - {endTime}:00 
                      ({activity.type === 'study' 
                        ? Math.round(activity.duration / 60 * 10) / 10 
                        : Math.round(activity.duration / 60 * 10) / 10} hours)
                    </p>
                  </div>
                </div>
                
                {activity.type === 'study' && (
                  <span className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground">
                    {activity.duration / 60} hrs
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
