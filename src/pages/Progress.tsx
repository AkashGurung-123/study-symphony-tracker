
import React from 'react';
import { Layout } from '@/components/Layout';
import { ProgressChart } from '@/components/ProgressChart';
import { courses, getProgressPercentage } from '@/lib/data';
import { 
  getProjectedScore, 
  getEstimatedCompletionDate 
} from '@/lib/studyPlanGenerator';
import { format } from 'date-fns';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { Trophy, Calendar, Clock, TrendingUp } from 'lucide-react';

export default function Progress() {
  const progressPercentage = getProgressPercentage();
  const projectedScore = getProjectedScore();
  const completionDate = getEstimatedCompletionDate();
  
  // Generate course progress data for chart
  const courseProgressData = courses.map(course => {
    const totalHours = course.topics.reduce((total, topic) => total + topic.creditHours, 0);
    const completedHours = course.topics.reduce((total, topic) => total + topic.completed, 0);
    const progressPercent = totalHours > 0 ? (completedHours / totalHours) * 100 : 0;
    
    return {
      name: course.name.split(' ')[0], // Use first word for chart label
      progress: Math.round(progressPercent),
      fullName: course.name,
      completed: completedHours,
      total: totalHours
    };
  });
  
  // Generate dummy trend data
  const today = new Date();
  const trendData = Array.from({ length: 14 }, (_, i) => {
    const day = new Date(today);
    day.setDate(day.getDate() - (13 - i));
    
    return {
      date: format(day, 'MMM d'),
      progress: i === 13 
        ? Math.round(progressPercentage) 
        : Math.max(0, Math.round(progressPercentage) - Math.round((13 - i) * (progressPercentage / 14))),
      target: Math.round((i + 1) * (90 / 14))
    };
  });
  
  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Your Progress</h1>
          <p className="text-muted-foreground mt-1">
            Track your study journey and performance metrics
          </p>
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
              <h3 className="text-2xl font-bold">{format(completionDate, 'MMM d')}</h3>
              <p className="text-sm text-muted-foreground">Est. Completion Date</p>
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
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <TrendingUp size={20} className="mr-2 text-primary" />
              Progress Trend
            </h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trendData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }} 
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }} 
                    tickLine={false}
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, '']}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '0.5rem',
                      border: '1px solid #f0f0f0',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="progress" 
                    name="Your Progress" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    name="Target (90%)" 
                    stroke="#6b7280" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">Overall Progress</h2>
            <ProgressChart className="h-72" />
          </div>
        </div>
        
        {/* Course progress breakdown */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6">Course Progress Breakdown</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={courseProgressData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                barSize={40}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  formatter={(value, name, props) => {
                    const courseData = props.payload;
                    return [
                      `${value}% (${courseData.completed}/${courseData.total} hrs)`, 
                      courseData.fullName
                    ];
                  }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '0.5rem',
                    border: '1px solid #f0f0f0',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                  }}
                />
                <Bar 
                  dataKey="progress" 
                  name="Progress" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
}
