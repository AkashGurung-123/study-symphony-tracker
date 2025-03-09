
export interface Topic {
  id: string;
  name: string;
  creditHours: number;
  completed: number; // hours completed
  notes?: string;
}

export interface Course {
  id: string;
  name: string;
  code?: string;
  totalMarks: number;
  topics: Topic[];
}

export interface StudySession {
  id: string;
  courseId: string;
  topicId: string;
  date: Date;
  duration: number; // in minutes
  completed: boolean;
  notes?: string;
}

export interface BreakActivity {
  id: string;
  type: 'rest' | 'cooking' | 'exercise' | 'other';
  date: Date;
  duration: number; // in minutes
  notes?: string;
}

export interface DailySchedule {
  date: Date;
  studySessions: StudySession[];
  breakActivities: BreakActivity[];
}

// Initial courses data
export const courses: Course[] = [
  {
    id: "econophysics",
    name: "Econophysics",
    code: "PHYS401",
    totalMarks: 50,
    topics: [
      { id: "eco-1", name: "Introduction", creditHours: 6, completed: 0 },
      { id: "eco-2", name: "Efficient Market Hypothesis", creditHours: 10, completed: 0 },
      { id: "eco-3", name: "Random Walk", creditHours: 16, completed: 0 },
      { id: "eco-4", name: "Levy Stochastic Processes and Limit Theorems", creditHours: 22, completed: 0 },
      { id: "eco-5", name: "Scales in Financial Data", creditHours: 6, completed: 0 },
      { id: "eco-6", name: "Stationary and Time Correlation", creditHours: 20, completed: 0 },
    ],
  },
  {
    id: "quantum-mechanics",
    name: "Quantum Mechanics",
    code: "PHYS402",
    totalMarks: 100,
    topics: [
      { id: "qm-1", name: "Introduction to Wave Mechanics", creditHours: 15, completed: 0 },
      { id: "qm-2", name: "Quantum Mechanical Wave Propagation", creditHours: 20, completed: 0 },
      { id: "qm-3", name: "Operator Formalism in Quantum Mechanics", creditHours: 20, completed: 0 },
      { id: "qm-4", name: "Postulates of Quantum Mechanics", creditHours: 20, completed: 0 },
      { id: "qm-5", name: "One Dimensional Quantum Mechanical Problems", creditHours: 30, completed: 0 },
      { id: "qm-6", name: "Harmonic Oscillator and Applications", creditHours: 20, completed: 0 },
      { id: "qm-7", name: "Quantum Mechanical Problems and Solutions", creditHours: 20, completed: 0 },
      { id: "qm-8", name: "Central Potential Problems", creditHours: 15, completed: 0 },
    ],
  },
  {
    id: "nuclear-physics",
    name: "Nuclear Physics",
    code: "PHYS403A",
    totalMarks: 50,
    topics: [
      { id: "np-1", name: "Nuclear Forces", creditHours: 12, completed: 0 },
      { id: "np-2", name: "Nuclear Reactions", creditHours: 10, completed: 0 },
      { id: "np-3", name: "Nuclear Reactors", creditHours: 12, completed: 0 },
      { id: "np-4", name: "Weak Nuclear Force", creditHours: 12, completed: 0 },
      { id: "np-5", name: "Cosmic Rays", creditHours: 4, completed: 0 },
      { id: "np-6", name: "Elementary Particles", creditHours: 10, completed: 0 },
      { id: "np-7", name: "Particle Interaction", creditHours: 8, completed: 0 },
    ],
  },
  {
    id: "solid-state-physics",
    name: "Solid State Physics",
    code: "PHYS403B",
    totalMarks: 50,
    topics: [
      { id: "ssp-1", name: "Types and Structures of Crystals", creditHours: 12, completed: 0 },
      { id: "ssp-2", name: "Crystal Structure from Diffraction", creditHours: 12, completed: 0 },
      { id: "ssp-3", name: "Bonding in Crystals", creditHours: 5, completed: 0 },
      { id: "ssp-4", name: "Defects in Crystals", creditHours: 6, completed: 0 },
      { id: "ssp-5", name: "Lattice Dynamics", creditHours: 8, completed: 0 },
      { id: "ssp-6", name: "Free Electron Theory", creditHours: 7, completed: 0 },
      { id: "ssp-7", name: "Band Structure of Crystals", creditHours: 12, completed: 0 },
      { id: "ssp-8", name: "Semiconductors", creditHours: 4, completed: 0 },
      { id: "ssp-9", name: "Superconductivity", creditHours: 7, completed: 0 },
      { id: "ssp-10", name: "Dielectric Properties", creditHours: 4, completed: 0 },
      { id: "ssp-11", name: "Magnetism", creditHours: 7, completed: 0 },
    ],
  },
  {
    id: "project-work",
    name: "Project Work",
    code: "PHYS404",
    totalMarks: 100,
    topics: [
      { id: "proj-1", name: "Prediction of TEC using Deep Neural Network", creditHours: 160, completed: 0 },
    ],
  },
  {
    id: "computational-course",
    name: "Computational Course",
    code: "PHYS405",
    totalMarks: 50,
    topics: [
      { id: "comp-1", name: "Introduction to Computer", creditHours: 10, completed: 0 },
      { id: "comp-2", name: "Operating System", creditHours: 5, completed: 0 },
      { id: "comp-3", name: "Data Communication and Computer Networks", creditHours: 5, completed: 0 },
      { id: "comp-4", name: "The Internet", creditHours: 5, completed: 0 },
      { id: "comp-5", name: "Data Representation", creditHours: 9, completed: 0 },
      { id: "comp-6", name: "Database Management System", creditHours: 6, completed: 0 },
      { id: "comp-7", name: "Multimedia", creditHours: 4, completed: 0 },
      { id: "comp-8", name: "Computer Security", creditHours: 4, completed: 0 },
      { id: "comp-9", name: "Geographical Information System and Remote Sensing", creditHours: 8, completed: 0 },
      { id: "comp-10", name: "Laboratory Work", creditHours: 20, completed: 0 },
    ],
  },
];

// Calculate total credit hours
export const getTotalCreditHours = (): number => {
  return courses.reduce((total, course) => {
    return total + course.topics.reduce((topicTotal, topic) => {
      return topicTotal + topic.creditHours;
    }, 0);
  }, 0);
};

// Calculate completed credit hours
export const getCompletedCreditHours = (): number => {
  return courses.reduce((total, course) => {
    return total + course.topics.reduce((topicTotal, topic) => {
      return topicTotal + topic.completed;
    }, 0);
  }, 0);
};

// Get progress percentage
export const getProgressPercentage = (): number => {
  const total = getTotalCreditHours();
  const completed = getCompletedCreditHours();
  return total > 0 ? (completed / total) * 100 : 0;
};

// Local storage functions
export const saveCoursesToStorage = (): void => {
  localStorage.setItem('studySymphony_courses', JSON.stringify(courses));
};

export const loadCoursesFromStorage = (): void => {
  const savedCourses = localStorage.getItem('studySymphony_courses');
  if (savedCourses) {
    const parsedCourses = JSON.parse(savedCourses) as Course[];
    
    // Replace courses array with saved data
    courses.length = 0;
    courses.push(...parsedCourses);
  }
};

// Initial load of courses from storage
if (typeof window !== 'undefined') {
  loadCoursesFromStorage();
}
