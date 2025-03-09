
import React from 'react';
import { format } from 'date-fns';
import { Atom, BookOpen, Coffee, FlaskConical, Brain, Calculator, Sigma } from 'lucide-react';
import { DailySchedule } from '@/lib/data';
import { generateDailyStudySessions, getDaysUntilExam } from '@/lib/studyPlanGenerator';
import { cn } from '@/lib/utils';

interface StudyPlanProps {
  date?: Date;
  className?: string;
}

export function StudyPlan({ date = new Date(), className }: StudyPlanProps) {
  const [schedule, setSchedule] = React.useState<DailySchedule | null>(null);
  const daysUntilExam = getDaysUntilExam();
  
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
    <div className={cn("p-6 glass relative rounded-xl overflow-hidden", className)}>
      {/* Physics-inspired background elements */}
      <div className="absolute -right-8 -top-8 w-16 h-16 rounded-full bg-primary/20 blur-xl animate-pulse-slow" />
      <div className="absolute left-1/3 top-1/4 w-1 h-1 rounded-full bg-primary/80 animate-ping" />
      <div className="absolute right-1/4 bottom-1/3 w-2 h-2 rounded-full bg-primary/40 animate-pulse-slow" />
      <div className="absolute left-1/2 bottom-1/4 w-3 h-3 border border-primary/30 rounded-full" />
      
      {/* Mathematical equations as decorative elements */}
      <div className="absolute top-8 right-12 text-primary/10 text-3xl font-mono rotate-12">E=mc²</div>
      <div className="absolute bottom-12 left-8 text-primary/10 text-2xl font-mono -rotate-15">∇×E=-∂B/∂t</div>
      
      {/* Header with electron orbit design */}
      <div className="relative mb-6 pb-4 border-b border-border/40">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold">
              {format(date, 'EEEE, MMMM d')}
            </h3>
            <div className="flex items-center mt-1">
              <div className="relative h-4 w-4 mr-2">
                <div className="absolute inset-0 border border-primary/40 rounded-full animate-spin-slow" />
                <div className="absolute inset-[30%] bg-primary/60 rounded-full" />
                <div className="electron" style={{animationDelay: "0ms"}}></div>
              </div>
              <span className="text-sm text-muted-foreground">
                {daysUntilExam} days until exam
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm px-3 py-1.5 bg-primary/5 backdrop-blur rounded-lg border border-primary/20">
            <Calculator size={16} className="text-primary" />
            <span className="font-mono">{allActivities.length} activities</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 relative z-10">
        {allActivities.map((activity, index) => {
          const startTime = activity.time;
          const endTime = activity.type === 'study' 
            ? activity.time + Math.ceil(activity.duration / 60)
            : activity.time + Math.ceil(activity.duration / 60);
          
          return (
            <div 
              key={activity.id} 
              className={cn(
                "p-4 rounded-lg border transition-all duration-300 hover:shadow-md relative overflow-hidden",
                activity.type === 'study' 
                  ? "bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20" 
                  : "bg-gradient-to-r from-secondary/20 to-secondary/30 border-secondary/30"
              )}
            >
              {/* Physics particle decoration */}
              {activity.type === 'study' && (
                <>
                  <div className="absolute -right-1 -top-1 w-8 h-8 rounded-full bg-primary/5 blur-md" />
                  <div className="absolute right-1/4 bottom-1/3 w-1 h-1 rounded-full bg-primary/40 animate-pulse-slow" />
                </>
              )}
              
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-3">
                  {activity.type === 'study' ? (
                    <>
                      {activity.notes?.includes("Quantum") || activity.notes?.includes("Physics") ? (
                        <Atom className="text-primary" size={20} />
                      ) : activity.notes?.includes("Eco") ? (
                        <Calculator className="text-primary" size={20} />
                      ) : activity.notes?.includes("Comput") ? (
                        <FlaskConical className="text-primary" size={20} />
                      ) : (
                        <BookOpen className="text-primary" size={20} />
                      )}
                    </>
                  ) : activity.type === 'cooking' ? (
                    <Coffee className="text-orange-500" size={20} />
                  ) : (
                    <Brain className="text-gray-500" size={20} />
                  )}
                  
                  <div>
                    <h4 className="font-medium">
                      {activity.type === 'study' 
                        ? activity.notes 
                        : activity.type === 'cooking' 
                          ? 'Cooking/Meal Time' 
                          : 'Rest Break'}
                    </h4>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span className="font-mono">
                        {startTime}:00 - {endTime}:00
                      </span>
                      <span className="mx-1">•</span>
                      <span className="font-mono">
                        ({activity.duration / 60} hr)
                      </span>
                    </div>
                  </div>
                </div>
                
                {activity.type === 'study' && (
                  <div className="flex flex-col items-end">
                    <span className="px-2 py-1 text-xs font-mono rounded-full bg-primary/10 text-primary border border-primary/20">
                      {Math.round(activity.duration / 60 * 10) / 10} hrs
                    </span>
                    
                    {/* Small atom decoration */}
                    <div className="relative h-4 w-4 mt-2">
                      <div className="absolute inset-0 border border-primary/40 rounded-full" />
                      <div className="absolute inset-[35%] bg-primary/60 rounded-full" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Formula decoration at bottom */}
      <div className="mt-6 pt-4 border-t border-border/40 flex justify-between items-center text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Sigma size={14} className="text-primary" />
          <span className="font-mono">{allActivities.filter(a => a.type === 'study').length} study sessions</span>
        </div>
        <div className="font-mono text-primary/30">ψ(x,t) = Ae^i(kx-ωt)</div>
      </div>
    </div>
  );
}
