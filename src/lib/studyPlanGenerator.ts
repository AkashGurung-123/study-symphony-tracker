
import { Course, Topic, DailySchedule, StudySession, BreakActivity, courses } from './data';

// Constants for planning
const STUDY_HOURS_PER_DAY = 8; // Target hours to study each day
const BREAK_TIME_PER_STUDY_HOUR = 15; // Minutes of break per hour of study
const COOKING_TIME_PER_DAY = 60; // Minutes spent cooking per day
const EXAM_DATE = new Date(2024, 5, 1); // June 1, 2024 (months are 0-based in JavaScript)

// Generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Calculate priority score for a topic
const calculateTopicPriority = (course: Course, topic: Topic): number => {
  // Priority factors:
  // 1. Course marks (higher marks = higher priority)
  // 2. Credit hours (more hours = higher priority)
  // 3. Completion percentage (less complete = higher priority)

  const courseMarksFactor = course.totalMarks / 50; // Normalize to a base of 50
  const hoursRemaining = topic.creditHours - topic.completed;
  const completionPercent = topic.completed / topic.creditHours;
  
  // Weighted priority formula
  return courseMarksFactor * hoursRemaining * (1 - completionPercent);
};

// Get topics sorted by priority
export const getTopicsByPriority = (): {course: Course, topic: Topic, priority: number}[] => {
  const topicsWithPriority: {course: Course, topic: Topic, priority: number}[] = [];
  
  courses.forEach(course => {
    course.topics.forEach(topic => {
      if (topic.completed < topic.creditHours) {
        const priority = calculateTopicPriority(course, topic);
        topicsWithPriority.push({ course, topic, priority });
      }
    });
  });
  
  // Sort by priority (descending)
  return topicsWithPriority.sort((a, b) => b.priority - a.priority);
};

// Generate study sessions for a specific day
export const generateDailyStudySessions = (date: Date): DailySchedule => {
  const prioritizedTopics = getTopicsByPriority();
  const studySessions: StudySession[] = [];
  const breakActivities: BreakActivity[] = [];
  
  // Total minutes available for studying
  const studyMinutesAvailable = STUDY_HOURS_PER_DAY * 60;
  
  // Add cooking break
  breakActivities.push({
    id: generateId(),
    type: 'cooking',
    date: new Date(date),
    duration: COOKING_TIME_PER_DAY,
    notes: 'Meal preparation'
  });
  
  let remainingMinutes = studyMinutesAvailable;
  let breakMinutesUsed = 0;
  let sessionStartHour = 9; // Start at 9 AM
  
  // Distribute study time based on priority
  for (const { course, topic, priority } of prioritizedTopics) {
    if (remainingMinutes <= 0) break;
    
    // Calculate how many minutes to allocate to this topic
    const hoursRemaining = topic.creditHours - topic.completed;
    const minutesToAllocate = Math.min(remainingMinutes, hoursRemaining * 60);
    
    if (minutesToAllocate <= 0) continue;
    
    // Create a study session
    const sessionDate = new Date(date);
    sessionDate.setHours(sessionStartHour);
    
    studySessions.push({
      id: generateId(),
      courseId: course.id,
      topicId: topic.id,
      date: sessionDate,
      duration: minutesToAllocate,
      completed: false,
      notes: `Study ${topic.name} from ${course.name}`
    });
    
    // Update remaining minutes
    remainingMinutes -= minutesToAllocate;
    
    // Add breaks after study sessions
    const breakMinutes = Math.floor((minutesToAllocate / 60) * BREAK_TIME_PER_STUDY_HOUR);
    if (breakMinutes > 0) {
      const breakDate = new Date(date);
      breakDate.setHours(sessionStartHour + (minutesToAllocate / 60));
      
      breakActivities.push({
        id: generateId(),
        type: 'rest',
        date: breakDate,
        duration: breakMinutes,
        notes: 'Short break to refresh'
      });
      
      breakMinutesUsed += breakMinutes;
    }
    
    // Update the start hour for the next session
    sessionStartHour += Math.ceil((minutesToAllocate + breakMinutes) / 60);
  }
  
  return {
    date,
    studySessions,
    breakActivities
  };
};

// Generate study plan for the next n days
export const generateStudyPlan = (days: number): DailySchedule[] => {
  const plan: DailySchedule[] = [];
  const startDate = new Date();
  
  for (let i = 0; i < days; i++) {
    const planDate = new Date(startDate);
    planDate.setDate(startDate.getDate() + i);
    
    plan.push(generateDailyStudySessions(planDate));
  }
  
  return plan;
};

// Calculate estimated completion date
export const getEstimatedCompletionDate = (): Date => {
  const totalRemainingHours = courses.reduce((total, course) => {
    return total + course.topics.reduce((topicTotal, topic) => {
      return topicTotal + (topic.creditHours - topic.completed);
    }, 0);
  }, 0);
  
  const daysNeeded = Math.ceil(totalRemainingHours / STUDY_HOURS_PER_DAY);
  const completionDate = new Date();
  completionDate.setDate(completionDate.getDate() + daysNeeded);
  
  return completionDate;
};

// Calculate days until exam
export const getDaysUntilExam = (): number => {
  const today = new Date();
  const timeDiff = EXAM_DATE.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

// Get projected score based on current progress
export const getProjectedScore = (): number => {
  const totalCreditHours = courses.reduce((total, course) => {
    return total + course.topics.reduce((topicTotal, topic) => {
      return topicTotal + topic.creditHours;
    }, 0);
  }, 0);
  
  const completedCreditHours = courses.reduce((total, course) => {
    return total + course.topics.reduce((topicTotal, topic) => {
      return topicTotal + topic.completed;
    }, 0);
  }, 0);
  
  const progressPercent = completedCreditHours / totalCreditHours;
  const daysUntilExam = getDaysUntilExam();
  const expectedDailyProgress = totalCreditHours / daysUntilExam / STUDY_HOURS_PER_DAY;
  
  // Calculate how many days have passed since starting
  const today = new Date();
  const daysPassed = Math.ceil((today.getTime() - new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()).getTime()) / (1000 * 3600 * 24));
  
  // Avoid division by zero
  const currentDailyProgress = daysPassed > 0 ? completedCreditHours / daysPassed / STUDY_HOURS_PER_DAY : 0;
  
  // Score projection based on current progress rate compared to expected rate
  let projectedScore = 90;
  
  if (currentDailyProgress < expectedDailyProgress * 0.7) {
    projectedScore = 70 + (progressPercent * 20);
  } else if (currentDailyProgress < expectedDailyProgress * 0.9) {
    projectedScore = 80 + (progressPercent * 10);
  } else {
    projectedScore = 90 + (progressPercent * 10);
  }
  
  return Math.min(Math.max(projectedScore, 60), 100);
};
