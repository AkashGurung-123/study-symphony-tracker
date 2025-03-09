
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
        "glass rounded-xl p-6 hover-scale cursor-pointer border border-border/40 transition-all",
        className
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg">{course.name}</h3>
          <p className="text-sm text-muted-foreground">{course.code}</p>
        </div>
        <div className="text-center">
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
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="text-sm">
          <p className="text-muted-foreground">{course.topics.length} topics</p>
        </div>
      </div>
    </div>
  );
}
