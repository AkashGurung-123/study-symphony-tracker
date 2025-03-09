
import React from 'react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { Layout } from '@/components/Layout';
import { StudyPlan } from '@/components/StudyPlan';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Atom,
  Sigma
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
        {/* Header with physics-inspired design */}
        <div className="physics-card rounded-xl p-6 relative overflow-hidden">
          {/* Physics decorative elements */}
          <div className="absolute -left-10 -top-10 w-32 h-32 rounded-full bg-primary/10 blur-xl" />
          <div className="absolute right-1/3 top-1/4 w-2 h-2 rounded-full bg-primary/40 animate-pulse-slow" />
          <div className="absolute right-1/4 bottom-2/3 w-1 h-1 rounded-full bg-primary/60 animate-pulse-slow" />
          <div className="absolute right-20 top-10 text-primary/10 text-2xl font-mono">∫f(x)dx</div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Atom className="text-primary" size={24} />
                <h1 className="text-3xl font-bold">Study Schedule</h1>
              </div>
              <p className="text-muted-foreground mt-1 flex items-center">
                <Sigma className="mr-1 text-primary/60" size={16} />
                <span>Your personalized physics study plan</span>
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={navigateToPreviousWeek}
                className="border-primary/20 hover:bg-primary/5"
              >
                <ChevronLeft size={16} />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={navigateToToday}
                className="border-primary/20 hover:bg-primary/5"
              >
                Today
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={navigateToNextWeek}
                className="border-primary/20 hover:bg-primary/5"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Week selector with physics-inspired design */}
        <div className="glass rounded-xl p-4 backdrop-blur-md relative overflow-hidden">
          {/* Physics decorative elements */}
          <div className="absolute left-1/2 top-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute left-1/3 bottom-1/3 w-1 h-1 rounded-full bg-primary/60 animate-pulse-slow" />
          <div className="absolute right-1/4 top-2/3 w-2 h-2 rounded-full bg-primary/40 animate-ping" />
          
          <div className="relative z-10 flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <div className="relative h-5 w-5">
                <div className="absolute inset-0 border border-primary/40 rounded-full animate-spin-slow" />
                <div className="absolute inset-0 border border-primary/40 rounded-full rotate-45 animate-spin animate-duration-10000" />
                <div className="absolute inset-[30%] bg-primary/60 rounded-full" />
              </div>
              <span>{format(currentWeekStart, 'MMMM yyyy')}</span>
            </h2>
            <div className="flex items-center gap-2 text-sm px-3 py-1.5 bg-primary/5 backdrop-blur rounded-lg border border-primary/20">
              <CalendarIcon size={16} className="text-primary" />
              <span className="font-mono">
                {format(currentWeekStart, 'MMM d')} - {format(addDays(currentWeekStart, 6), 'MMM d')}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-2 relative z-10">
            {weekDays.map((day) => {
              const isToday = isSameDay(day, new Date());
              const isSelected = isSameDay(day, selectedDate);
              
              return (
                <button
                  key={day.toISOString()}
                  className={cn(
                    "relative p-2 rounded-lg flex flex-col items-center justify-center hover:bg-primary/5 transition-colors",
                    isToday && "border border-primary/30",
                    isSelected && "bg-primary text-white hover:bg-primary/90"
                  )}
                  onClick={() => setSelectedDate(day)}
                >
                  {/* Electron orbit for selected day */}
                  {isSelected && !isToday && (
                    <>
                      <div className="absolute inset-0 border border-white/30 rounded-lg"></div>
                      <div className="absolute top-0 right-0 w-1 h-1 bg-white/60 rounded-full animate-ping"></div>
                    </>
                  )}
                  
                  {/* Atomic nucleus for today */}
                  {isToday && !isSelected && (
                    <div className="absolute top-1 right-1 h-2 w-2">
                      <div className="absolute inset-0 bg-primary/60 rounded-full"></div>
                    </div>
                  )}
                  
                  <span className="text-xs font-medium font-mono">
                    {format(day, 'EEE')}
                  </span>
                  <span className={cn(
                    "text-lg font-mono",
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
