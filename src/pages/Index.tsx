
import React from 'react';
import { Layout } from '@/components/Layout';
import { CourseCard } from '@/components/CourseCard';
import { ProgressChart } from '@/components/ProgressChart';
import { StudyPlan } from '@/components/StudyPlan';
import { courses, getProgressPercentage } from '@/lib/data';
import { getProjectedScore } from '@/lib/studyPlanGenerator';
import { ArrowRight, Trophy, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Index() {
  const progressPercentage = getProgressPercentage();
  const projectedScore = getProjectedScore();
  
  const topCourses = [...courses]
    .sort((a, b) => b.totalMarks - a.totalMarks)
    .slice(0, 3);
    
  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome to Study Symphony</h1>
            <p className="text-muted-foreground mt-1">
              Your personalized study planner to help you reach your academic goals
            </p>
          </div>
          <div className="glass flex items-center gap-3 py-2 px-4 rounded-full">
            <Clock size={18} className="text-primary" />
            <span className="text-sm">
              <strong>90 days</strong> until final exams
            </span>
          </div>
        </div>
        
        {/* Stats overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass rounded-xl p-6 flex items-center gap-4 hover-scale">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{Math.round(projectedScore)}%</h3>
              <p className="text-sm text-muted-foreground">Projected Score</p>
            </div>
          </div>
          
          <div className="glass rounded-xl p-6 flex items-center gap-4 hover-scale">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{courses.length}</h3>
              <p className="text-sm text-muted-foreground">Courses to Master</p>
            </div>
          </div>
          
          <div className="glass rounded-xl p-6 flex items-center gap-4 hover-scale">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{Math.round(progressPercentage)}%</h3>
              <p className="text-sm text-muted-foreground">Progress Complete</p>
            </div>
          </div>
        </div>
        
        {/* Study plan and progress */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Today's Study Plan</h2>
              <Link to="/schedule" className="flex items-center text-sm text-primary">
                View full schedule <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            <StudyPlan />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Overall Progress</h2>
            <div className="glass rounded-xl p-6">
              <ProgressChart />
            </div>
          </div>
        </div>
        
        {/* Priority courses */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Priority Courses</h2>
            <Link to="/courses" className="flex items-center text-sm text-primary">
              View all courses <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topCourses.map(course => (
              <CourseCard 
                key={course.id} 
                course={course}
                onClick={() => window.location.href = '/courses'}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
