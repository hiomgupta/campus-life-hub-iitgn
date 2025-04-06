// Mock data for demonstrations

// Events data
export const eventsData = [
  {
    id: '1',
    title: 'Tech Fest 2023',
    organizer: 'Technical Council',
    date: '2025-04-15',
    time: '10:00 AM - 6:00 PM',
    location: 'Main Auditorium',
    description: 'Annual technical festival featuring competitions, workshops, and guest lectures.',
    category: 'Technical',
    imageUrl: '/placeholder.svg'
  },
  {
    id: '2',
    title: 'Cultural Night',
    organizer: 'Cultural Council',
    date: '2025-04-20',
    time: '7:00 PM - 10:00 PM',
    location: 'Open Air Theatre',
    description: 'An evening of music, dance, and theatrical performances by students.',
    category: 'Cultural',
    imageUrl: '/placeholder.svg'
  },
  {
    id: '3',
    title: 'Research Symposium',
    organizer: 'Research Cell',
    date: '2025-04-25',
    time: '9:00 AM - 5:00 PM',
    location: 'Conference Hall',
    description: 'Present and discuss ongoing research projects with faculty and peers.',
    category: 'Academic',
    imageUrl: '/placeholder.svg'
  },
  {
    id: '4',
    title: 'Annual Sports Day',
    organizer: 'Sports Council',
    date: '2025-05-01',
    time: '8:00 AM - 6:00 PM',
    location: 'Sports Complex',
    description: 'Compete in various sports events and athletic competitions.',
    category: 'Sports',
    imageUrl: '/placeholder.svg'
  },
  {
    id: '5',
    title: 'Alumni Meet',
    organizer: 'Alumni Association',
    date: '2025-05-10',
    time: '11:00 AM - 4:00 PM',
    location: 'Campus Ground',
    description: 'Network with alumni and learn about their professional journeys.',
    category: 'Networking',
    imageUrl: '/placeholder.svg'
  }
];

// Announcements data
export const announcementsData = [
  {
    id: '1',
    title: 'End Semester Exam Schedule Released',
    date: '2025-04-03',
    description: 'The schedule for end semester examinations has been released. Check your email for details.',
    category: 'Academic',
    priority: 'High'
  },
  {
    id: '2',
    title: 'Library Hours Extended',
    date: '2025-04-02',
    description: 'Library will remain open until midnight during exam week.',
    category: 'Facility',
    priority: 'Medium'
  },
  {
    id: '3',
    title: 'Fee Payment Deadline',
    date: '2025-04-01',
    description: 'Last date to pay next semester fees is April 30th. Late fee will be applicable after the deadline.',
    category: 'Administrative',
    priority: 'High'
  },
  {
    id: '4',
    title: 'Campus Maintenance',
    date: '2025-03-30',
    description: 'Water supply will be disrupted in Hostel Blocks A and B on April 5th from 10 AM to 2 PM.',
    category: 'Facility',
    priority: 'Medium'
  },
  {
    id: '5',
    title: 'New Course Offerings',
    date: '2025-03-28',
    description: 'New elective courses have been added for the next semester. Registration opens on April 10th.',
    category: 'Academic',
    priority: 'Medium'
  }
];

// Bus Schedule data
export const busScheduleData = [
  {
    id: '1',
    route: 'Campus to City Center',
    schedule: [
      { departure: '07:30 AM', arrival: '08:15 AM' },
      { departure: '09:30 AM', arrival: '10:15 AM' },
      { departure: '12:30 PM', arrival: '01:15 PM' },
      { departure: '03:30 PM', arrival: '04:15 PM' },
      { departure: '06:30 PM', arrival: '07:15 PM' }
    ],
    status: 'On Time',
    type: 'Regular'
  },
  {
    id: '2',
    route: 'City Center to Campus',
    schedule: [
      { departure: '08:30 AM', arrival: '09:15 AM' },
      { departure: '11:30 AM', arrival: '12:15 PM' },
      { departure: '02:30 PM', arrival: '03:15 PM' },
      { departure: '05:30 PM', arrival: '06:15 PM' },
      { departure: '08:30 PM', arrival: '09:15 PM' }
    ],
    status: 'Delayed (15 min)',
    type: 'Regular'
  },
  {
    id: '3',
    route: 'Campus to Airport',
    schedule: [
      { departure: '06:00 AM', arrival: '07:30 AM' },
      { departure: '02:00 PM', arrival: '03:30 PM' },
      { departure: '10:00 PM', arrival: '11:30 PM' }
    ],
    status: 'On Time',
    type: 'Special'
  },
  {
    id: '4',
    route: 'Campus Loop',
    schedule: [
      { departure: 'Every 30 mins from 08:00 AM to 08:00 PM' }
    ],
    status: 'On Time',
    type: 'Shuttle'
  }
];

// Mess Menu data
export const messMenuData = {
  monday: {
    breakfast: ['Idli with Sambar', 'Coconut Chutney', 'Bread with Butter/Jam', 'Tea/Coffee'],
    lunch: ['Rice', 'Dal', 'Paneer Curry', 'Mixed Vegetables', 'Curd', 'Salad'],
    dinner: ['Chapati', 'Rice', 'Dal Fry', 'Egg Curry (Non-Veg)', 'Aloo Gobi (Veg)', 'Sweet']
  },
  tuesday: {
    breakfast: ['Poha', 'Boiled Eggs', 'Bread with Butter/Jam', 'Tea/Coffee'],
    lunch: ['Rice', 'Dal', 'Rajma', 'Aloo Matar', 'Curd', 'Salad'],
    dinner: ['Chapati', 'Rice', 'Dal Tadka', 'Chicken Curry (Non-Veg)', 'Soya Curry (Veg)', 'Ice Cream']
  },
  wednesday: {
    breakfast: ['Dosa', 'Sambar', 'Chutney', 'Bread with Butter/Jam', 'Tea/Coffee'],
    lunch: ['Rice', 'Dal', 'Mixed Veg Curry', 'Chole', 'Curd', 'Salad'],
    dinner: ['Chapati', 'Rice', 'Dal Makhani', 'Fish Curry (Non-Veg)', 'Veg Kofta (Veg)', 'Fruit Custard']
  },
  thursday: {
    breakfast: ['Puri', 'Aloo Bhaji', 'Bread with Butter/Jam', 'Tea/Coffee'],
    lunch: ['Rice', 'Dal', 'Kadai Paneer', 'Bhindi Fry', 'Curd', 'Salad'],
    dinner: ['Chapati', 'Rice', 'Yellow Dal', 'Mutton Curry (Non-Veg)', 'Veg Kurma (Veg)', 'Kheer']
  },
  friday: {
    breakfast: ['Aloo Paratha', 'Curd', 'Pickle', 'Bread with Butter/Jam', 'Tea/Coffee'],
    lunch: ['Rice', 'Dal', 'Matar Paneer', 'Aloo Jeera', 'Curd', 'Salad'],
    dinner: ['Chapati', 'Rice', 'Dal Tadka', 'Butter Chicken (Non-Veg)', 'Malai Kofta (Veg)', 'Gulab Jamun']
  },
  saturday: {
    breakfast: ['Upma', 'Coconut Chutney', 'Bread with Butter/Jam', 'Tea/Coffee'],
    lunch: ['Rice', 'Dal', 'Aloo Gobi', 'Mix Veg', 'Curd', 'Salad'],
    dinner: ['Chapati', 'Rice', 'Dal Fry', 'Egg Bhurji (Non-Veg)', 'Paneer Bhurji (Veg)', 'Sweet']
  },
  sunday: {
    breakfast: ['Chole Bhature', 'Bread with Butter/Jam', 'Tea/Coffee'],
    lunch: ['Veg Pulao', 'Dal', 'Shahi Paneer', 'Raita', 'Salad', 'Papad'],
    dinner: ['Chapati', 'Rice', 'Dal', 'Chicken Biryani (Non-Veg)', 'Veg Biryani (Veg)', 'Raita', 'Ice Cream']
  }
};

// Food Outlets data
export const foodOutletsData = [
  {
    id: '1',
    name: 'Campus Café',
    location: 'Academic Block',
    hours: '8:00 AM - 8:00 PM',
    type: 'Café',
    cuisine: ['Beverages', 'Snacks', 'Fast Food'],
    description: 'Coffee, tea, sandwiches, and light snacks',
    rating: 4.2,
    menu: [
      { id: '1-1', name: 'Espresso', category: 'Beverages', price: '₹30' },
      { id: '1-2', name: 'Cappuccino', category: 'Beverages', price: '₹50' },
      { id: '1-3', name: 'Sandwich', category: 'Snacks', price: '₹80' }
    ]
  },
  {
    id: '2',
    name: 'Food Court',
    location: 'Student Activity Center',
    hours: '10:00 AM - 10:00 PM',
    type: 'Food Court',
    cuisine: ['Indian', 'Chinese', 'Continental'],
    description: 'Multiple food stalls serving various cuisines',
    rating: 4.5,
    menu: [
      { id: '2-1', name: 'Butter Chicken', category: 'Indian', price: '₹150' },
      { id: '2-2', name: 'Hakka Noodles', category: 'Chinese', price: '₹120' },
      { id: '2-3', name: 'Pasta', category: 'Continental', price: '₹130' }
    ]
  },
  {
    id: '3',
    name: 'Night Canteen',
    location: 'Hostel Area',
    hours: '6:00 PM - 2:00 AM',
    type: 'Canteen',
    cuisine: ['Indian', 'Fast Food', 'Beverages'],
    description: 'Late-night food options for students',
    rating: 4.0,
    menu: [
      { id: '3-1', name: 'Maggi', category: 'Snacks', price: '₹40' },
      { id: '3-2', name: 'Paratha', category: 'Indian', price: '₹60' },
      { id: '3-3', name: 'Cold Coffee', category: 'Beverages', price: '₹50' }
    ]
  },
  {
    id: '4',
    name: 'Faculty Lounge',
    location: 'Faculty Building',
    hours: '9:00 AM - 5:00 PM',
    type: 'Lounge',
    cuisine: ['Beverages', 'Light Meals'],
    description: 'Quiet place for faculty members to have meals',
    rating: 4.3,
    menu: [
      { id: '4-1', name: 'Green Tea', category: 'Beverages', price: '₹25' },
      { id: '4-2', name: 'Salad', category: 'Healthy', price: '₹90' },
      { id: '4-3', name: 'Soup', category: 'Light Meals', price: '₹70' }
    ]
  },
  {
    id: '5',
    name: 'Juice Junction',
    location: 'Sports Complex',
    hours: '7:00 AM - 9:00 PM',
    type: 'Juice Bar',
    cuisine: ['Juices', 'Smoothies', 'Healthy Snacks'],
    description: 'Fresh juices and healthy options for fitness enthusiasts',
    rating: 4.7,
    menu: [
      { id: '5-1', name: 'Mixed Fruit Juice', category: 'Juices', price: '₹60' },
      { id: '5-2', name: 'Protein Smoothie', category: 'Smoothies', price: '₹90' },
      { id: '5-3', name: 'Granola Bar', category: 'Healthy Snacks', price: '₹40' }
    ]
  }
];

// Clubs data
export const clubsData = [
  {
    id: '1',
    name: 'Technical Club',
    description: 'Fostering technical skills and innovation among students.',
    category: 'Technical',
    coordinator: 'Prof. Amit Kumar',
    studentLead: 'Rajesh Sharma',
    email: 'technical.club@iitgn.ac.in',
    members: 120,
    events: ['Hackathon', 'Technical Workshop', 'Coding Competition']
  },
  {
    id: '2',
    name: 'Cultural Club',
    description: 'Promoting cultural activities and performances on campus.',
    category: 'Cultural',
    coordinator: 'Prof. Priya Singh',
    studentLead: 'Ananya Patel',
    email: 'cultural.club@iitgn.ac.in',
    members: 150,
    events: ['Cultural Night', 'Dance Competition', 'Music Festival']
  },
  {
    id: '3',
    name: 'Sports Club',
    description: 'Organizing sports events and promoting fitness among students.',
    category: 'Sports',
    coordinator: 'Prof. Rahul Verma',
    studentLead: 'Arjun Nair',
    email: 'sports.club@iitgn.ac.in',
    members: 200,
    events: ['Sports Day', 'Cricket Tournament', 'Basketball League']
  },
  {
    id: '4',
    name: 'Literary Club',
    description: 'Encouraging reading, writing, and literary discussions.',
    category: 'Literary',
    coordinator: 'Prof. Meera Joshi',
    studentLead: 'Karthik Menon',
    email: 'literary.club@iitgn.ac.in',
    members: 80,
    events: ['Book Discussion', 'Poetry Slam', 'Writing Workshop']
  },
  {
    id: '5',
    name: 'Photography Club',
    description: 'Exploring the art of photography and visual storytelling.',
    category: 'Art',
    coordinator: 'Prof. Deepak Mishra',
    studentLead: 'Neha Gupta',
    email: 'photography.club@iitgn.ac.in',
    members: 90,
    events: ['Photo Exhibition', 'Photography Workshop', 'Photo Walk']
  }
];

// Academic data
export const academicData = {
  courses: [
    {
      id: 'CS101',
      title: 'Introduction to Computer Science',
      instructor: 'Prof. Ramesh Kumar',
      schedule: 'Monday, Wednesday, Friday - 10:00 AM to 11:00 AM',
      location: 'Lecture Hall 1',
      credits: 4
    },
    {
      id: 'MTH201',
      title: 'Linear Algebra',
      instructor: 'Prof. Sunita Patel',
      schedule: 'Tuesday, Thursday - 2:00 PM to 3:30 PM',
      location: 'Lecture Hall 2',
      credits: 3
    },
    {
      id: 'PHY101',
      title: 'Mechanics',
      instructor: 'Prof. Anil Gupta',
      schedule: 'Monday, Wednesday, Friday - 1:00 PM to 2:00 PM',
      location: 'Physics Lab',
      credits: 4
    },
    {
      id: 'EE201',
      title: 'Digital Electronics',
      instructor: 'Prof. Kiran Shah',
      schedule: 'Tuesday, Thursday - 11:00 AM to 12:30 PM',
      location: 'Electronics Lab',
      credits: 3
    },
    {
      id: 'HS101',
      title: 'Technical Communication',
      instructor: 'Prof. Lakshmi Nair',
      schedule: 'Wednesday - 3:00 PM to 5:00 PM',
      location: 'Seminar Hall',
      credits: 2
    }
  ],
  assignments: [
    {
      id: '1',
      courseId: 'CS101',
      title: 'Programming Assignment 1',
      dueDate: '2025-04-15',
      description: 'Implement a simple algorithm in Python'
    },
    {
      id: '2',
      courseId: 'MTH201',
      title: 'Problem Set 2',
      dueDate: '2025-04-10',
      description: 'Solve problems on vector spaces and linear transformations'
    },
    {
      id: '3',
      courseId: 'PHY101',
      title: 'Lab Report',
      dueDate: '2025-04-20',
      description: 'Submit report on the pendulum experiment'
    },
    {
      id: '4',
      courseId: 'EE201',
      title: 'Circuit Design',
      dueDate: '2025-04-25',
      description: 'Design a digital circuit for the given specification'
    },
    {
      id: '5',
      courseId: 'HS101',
      title: 'Technical Report',
      dueDate: '2025-04-30',
      description: 'Write a technical report on a topic of your choice'
    }
  ],
  exams: [
    {
      id: '1',
      courseId: 'CS101',
      title: 'Mid-Semester Exam',
      date: '2025-04-18',
      time: '10:00 AM - 12:00 PM',
      venue: 'Examination Hall 1'
    },
    {
      id: '2',
      courseId: 'MTH201',
      title: 'Quiz 2',
      date: '2025-04-12',
      time: '2:00 PM - 3:00 PM',
      venue: 'Lecture Hall 2'
    },
    {
      id: '3',
      courseId: 'PHY101',
      title: 'Mid-Semester Exam',
      date: '2025-04-20',
      time: '9:00 AM - 11:00 AM',
      venue: 'Examination Hall 2'
    },
    {
      id: '4',
      courseId: 'EE201',
      title: 'Lab Test',
      date: '2025-04-22',
      time: '11:00 AM - 1:00 PM',
      venue: 'Electronics Lab'
    },
    {
      id: '5',
      courseId: 'HS101',
      title: 'Presentation',
      date: '2025-04-27',
      time: '3:00 PM - 5:00 PM',
      venue: 'Seminar Hall'
    }
  ]
};

// Campus Map data
export const campusMapData = [
  {
    id: '1',
    name: 'Academic Block A',
    category: 'Academic',
    description: 'Main academic building with classrooms and faculty offices',
    coordinates: { lat: 23.2156, lng: 72.6369 }
  },
  {
    id: '2',
    name: 'Academic Block B',
    category: 'Academic',
    description: 'Science and engineering laboratories',
    coordinates: { lat: 23.2160, lng: 72.6372 }
  },
  {
    id: '3',
    name: 'Library',
    category: 'Academic',
    description: 'Central library with reading rooms and digital resources',
    coordinates: { lat: 23.2158, lng: 72.6375 }
  },
  {
    id: '4',
    name: 'Hostel Block A',
    category: 'Residential',
    description: 'Undergraduate men\'s hostel',
    coordinates: { lat: 23.2150, lng: 72.6380 }
  },
  {
    id: '5',
    name: 'Hostel Block B',
    category: 'Residential',
    description: 'Undergraduate women\'s hostel',
    coordinates: { lat: 23.2152, lng: 72.6382 }
  },
  {
    id: '6',
    name: 'Hostel Block C',
    category: 'Residential',
    description: 'Postgraduate hostel',
    coordinates: { lat: 23.2154, lng: 72.6384 }
  },
  {
    id: '7',
    name: 'Sports Complex',
    category: 'Recreation',
    description: 'Indoor and outdoor sports facilities',
    coordinates: { lat: 23.2145, lng: 72.6370 }
  },
  {
    id: '8',
    name: 'Swimming Pool',
    category: 'Recreation',
    description: 'Olympic-sized swimming pool',
    coordinates: { lat: 23.2147, lng: 72.6368 }
  },
  {
    id: '9',
    name: 'Student Activity Center',
    category: 'Recreation',
    description: 'Center for student clubs and activities',
    coordinates: { lat: 23.2155, lng: 72.6365 }
  },
  {
    id: '10',
    name: 'Cafeteria',
    category: 'Dining',
    description: 'Main dining hall for students and faculty',
    coordinates: { lat: 23.2153, lng: 72.6375 }
  },
  {
    id: '11',
    name: 'Food Court',
    category: 'Dining',
    description: 'Various food outlets and cafes',
    coordinates: { lat: 23.2151, lng: 72.6373 }
  },
  {
    id: '12',
    name: 'Administrative Block',
    category: 'Administrative',
    description: 'Offices of administration and management',
    coordinates: { lat: 23.2165, lng: 72.6375 }
  },
  {
    id: '13',
    name: 'Guest House',
    category: 'Administrative',
    description: 'Accommodation for visitors and guests',
    coordinates: { lat: 23.2167, lng: 72.6380 }
  },
  {
    id: '14',
    name: 'Medical Center',
    category: 'Healthcare',
    description: 'Health services and emergency care',
    coordinates: { lat: 23.2160, lng: 72.6385 }
  },
  {
    id: '15',
    name: 'Bus Stop',
    category: 'Transportation',
    description: 'Main campus bus stop',
    coordinates: { lat: 23.2170, lng: 72.6370 }
  }
];
