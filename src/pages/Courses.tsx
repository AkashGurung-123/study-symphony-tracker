
import React from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { courses, Course, Topic, saveCoursesToStorage } from '@/lib/data';
import { ArrowLeft, Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function Courses() {
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Filter courses based on search term
  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleTopicProgress = (topic: Topic, hours: number) => {
    if (hours < 0 || hours > topic.creditHours) return;
    
    topic.completed = hours;
    saveCoursesToStorage();
    
    // Force component update
    setSelectedCourse({...selectedCourse!});
    
    toast.success('Progress updated', {
      description: `Updated ${topic.name} to ${hours} hours completed`,
    });
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              {selectedCourse ? selectedCourse.name : 'Courses'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {selectedCourse ? 'View and update topic progress' : 'Manage your course materials'}
            </p>
          </div>
          
          {!selectedCourse && (
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search courses..."
                className="pl-8 w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
          
          {selectedCourse && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedCourse(null)}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} /> Back to Courses
            </Button>
          )}
        </div>
        
        {selectedCourse ? (
          // Course details view
          <div className="space-y-6">
            <div className="glass rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">{selectedCourse.code}</p>
                  <h2 className="text-2xl font-semibold">{selectedCourse.name}</h2>
                </div>
                <div className="text-center">
                  <span className="text-lg font-semibold text-primary">{selectedCourse.totalMarks}</span>
                  <p className="text-xs text-muted-foreground">Total Marks</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Topics</h3>
                
                <div className="space-y-6">
                  {selectedCourse.topics.map((topic) => {
                    const progressPercent = (topic.completed / topic.creditHours) * 100;
                    
                    return (
                      <div key={topic.id} className="glass p-4 rounded-lg">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                          <h4 className="font-medium">{topic.name}</h4>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">
                              {topic.completed} of {topic.creditHours} hours
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleTopicProgress(topic, Math.max(0, topic.completed - 1))}
                                className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                              >
                                -
                              </button>
                              <button
                                onClick={() => handleTopicProgress(topic, Math.min(topic.creditHours, topic.completed + 1))}
                                className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/80 transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <Progress 
                          value={progressPercent} 
                          className="h-2" 
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Course list view
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              // Calculate completion percentage
              const totalHours = course.topics.reduce((total, topic) => total + topic.creditHours, 0);
              const completedHours = course.topics.reduce((total, topic) => total + topic.completed, 0);
              const progressPercentage = totalHours > 0 ? (completedHours / totalHours) * 100 : 0;
              
              return (
                <div 
                  key={course.id}
                  className="glass rounded-xl p-6 hover-scale cursor-pointer"
                  onClick={() => setSelectedCourse(course)}
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
                      <Progress 
                        value={progressPercentage} 
                        className="h-2" 
                      />
                    </div>
                    
                    <div className="text-sm">
                      <p className="text-muted-foreground">{course.topics.length} topics</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
