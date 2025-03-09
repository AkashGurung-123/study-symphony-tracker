
import React from 'react';
import { type Course } from '@/lib/data';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  course: Course;
  onClick?: () => void;
  className?: string;
}

export function CourseCard({ course, onClick, className }: CourseCardProps) {
  // Calculate completion percentage
  const totalHours = course.topics.reduce((total, topic) => total + topic.creditHours, 0);
  const completedHours = course.topics.reduce((total, topic) => total + topic.completed, 0);
  const progressPercentage = totalHours > 0 ? (completedHours / totalHours) * 100 : 0;
  
  return (
    <div 
      onClick={onClick}
      className={cn(
        "physics-card relative rounded-xl p-6 hover-scale cursor-pointer border border-border/40 transition-all overflow-hidden",
        "bg-gradient-to-br from-primary/5 to-primary/20 backdrop-blur-md",
        "before:absolute before:inset-0 before:rounded-xl before:border before:border-primary/10 before:bg-primary/5 before:opacity-0 before:transition-opacity hover:before:opacity-100",
        className
      )}
    >
      {/* Decorative physics elements */}
      <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-primary/10 blur-xl" />
      <div className="absolute right-1/4 bottom-1/3 h-2 w-2 rounded-full bg-primary/40 animate-pulse-slow" />
      <div className="absolute left-1/3 top-1/4 h-1 w-1 rounded-full bg-primary/60 animate-pulse-slow" />
      <div className="absolute right-1/3 bottom-1/4 h-3 w-3 border border-primary/30 rounded-full" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg">{course.name}</h3>
            <p className="text-sm text-muted-foreground">{course.code}</p>
          </div>
          <div className="text-center px-3 py-1 bg-primary/10 backdrop-blur rounded-lg border border-primary/20">
            <span className="text-sm font-semibold text-primary">{course.totalMarks}</span>
            <p className="text-xs text-muted-foreground">Marks</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>{completedHours} of {totalHours} hours</span>
              <span className="font-medium">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden backdrop-blur-sm relative">
              <div 
                className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/80 via-primary to-primary/80 blur-sm opacity-50"
                style={{ width: `${progressPercentage}%`, transform: 'translateX(-5%)' }}
              />
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500 ease-out relative z-10" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          
          <div className="flex justify-between text-sm">
            <p className="text-muted-foreground border border-primary/20 rounded-full px-2 py-0.5 text-xs bg-primary/5">
              {course.topics.length} topics
            </p>
            
            {/* Atom-like icon */}
            <div className="relative h-5 w-5">
              <div className="absolute inset-0 border border-primary/40 rounded-full animate-spin animate-duration-8000" />
              <div className="absolute inset-0 border border-primary/40 rounded-full rotate-45 animate-spin animate-duration-10000" />
              <div className="absolute inset-[35%] bg-primary/60 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
