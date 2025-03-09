
import React from 'react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { Layout } from '@/components/Layout';
import { StudyPlan } from '@/components/StudyPlan';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Schedule() {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [currentWeekStart, setCurrentWeekStart] = React.useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  
  // Generate the days for the current week view
  const weekDays = Array.from({ length: 7 }, (_, i) => 
    addDays(currentWeekStart, i)
  );
  
  const navigateToPreviousWeek = () => {
    const newWeekStart = addDays(currentWeekStart, -7);
    setCurrentWeekStart(newWeekStart);
    setSelectedDate(newWeekStart);
  };
  
  const navigateToNextWeek = () => {
    const newWeekStart = addDays(currentWeekStart, 7);
    setCurrentWeekStart(newWeekStart);
    setSelectedDate(newWeekStart);
  };
  
  const navigateToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentWeekStart(startOfWeek(today, { weekStartsOn: 1 }));
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Study Schedule</h1>
            <p className="text-muted-foreground mt-1">
              Your personalized daily study plan
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={navigateToPreviousWeek}
            >
              <ChevronLeft size={16} />
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={navigateToToday}
            >
              Today
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={navigateToNextWeek}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
        
        {/* Week selector */}
        <div className="glass rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">
              {format(currentWeekStart, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center gap-2">
              <CalendarIcon size={18} className="text-muted-foreground" />
              <span className="text-sm">
                {format(currentWeekStart, 'MMM d')} - {format(addDays(currentWeekStart, 6), 'MMM d')}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => {
              const isToday = isSameDay(day, new Date());
              const isSelected = isSameDay(day, selectedDate);
              
              return (
                <button
                  key={day.toISOString()}
                  className={cn(
                    "p-2 rounded-lg flex flex-col items-center justify-center hover:bg-primary/5 transition-colors",
                    isToday && "border border-primary/30",
                    isSelected && "bg-primary text-white hover:bg-primary/90"
                  )}
                  onClick={() => setSelectedDate(day)}
                >
                  <span className="text-xs font-medium">
                    {format(day, 'EEE')}
                  </span>
                  <span className={cn(
                    "text-lg font-semibold",
                    isSelected ? "text-white" : isToday ? "text-primary" : ""
                  )}>
                    {format(day, 'd')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Daily schedule */}
        <StudyPlan date={selectedDate} />
      </div>
    </Layout>
  );
}
