export const mockThreeMajorsList = [
  'Computer Science',
  'Mathematics',
  'Cognitive Science'
]

export const mockOneMajorList = ['Chemistry']

export const mockOneActiveProject = {
  name: 'AI Research',
  description: 'Exploring AI in education.',
  desiredQualifications: 'Experience in Python and AI frameworks.',
  umbrellaTopics: ['AI'],
  researchPeriods: ['Spring 2024', 'Fall 2024'],
  isActive: true,
  majors: ['Computer Science', 'Education'],
  faculty: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@sandiego.edu'
  }
}

export const mockTwoInactiveProjects = [
  {
    id: 1001,
    name: 'Post A inactive',
    description: 'this is a description for post A',
    desiredQualifications: 'student in CS',
    umbrellaTopics: [],
    researchPeriods: ['Spring 2025'],
    isActive: false,
    majors: mockThreeMajorsList,
    faculty: {
      firstName: 'Dr.',
      lastName: 'Coding',
      email: 'drcoding@sandiego.edu'
    }
  },
  {
    id: 1002,
    name: 'Post B inactive',
    description: 'this is a description for post B',
    desiredQualifications: 'student passionate about math',
    umbrellaTopics: [],
    researchPeriods: ['Fall 2025'],
    isActive: false,
    majors: mockThreeMajorsList,
    faculty: {
      firstName: 'Dr.',
      lastName: 'Debugger',
      email: 'debugger@sandiego.edu'
    }
  }
]

export const mockThreeActiveProjects = [
  {
    id: 1001,
    name: 'Post A',
    description: 'this is a description for post A',
    desiredQualifications: 'student in CS',
    umbrellaTopics: ['Umbrella Topic test'],
    researchPeriods: ['Spring 2025', 'Fall 2026'],
    isActive: true,
    majors: mockThreeMajorsList,
    faculty: {
      firstName: 'Dr.',
      lastName: 'Coding',
      email: 'drcoding@sandiego.edu'
    }
  },
  {
    id: 1002,
    name: 'Post B',
    description: 'this is a description for post B',
    desiredQualifications: 'student passionate about math',
    umbrellaTopics: [],
    researchPeriods: ['Fall 2025'],
    isActive: true,
    majors: mockThreeMajorsList,
    faculty: {
      firstName: 'Dr.',
      lastName: 'Debugger',
      email: 'debugger@sandiego.edu'
    }
  },
  {
    id: 1003,
    name: 'Post Z',
    description: 'this is a description for post Z',
    desiredQualifications: 'gpa above 3.0',
    umbrellaTopics: [],
    researchPeriods: ['Spring 2025'],
    isActive: true,
    majors: mockOneMajorList,
    faculty: {
      firstName: 'Dr.',
      lastName: 'React',
      email: 'react@sandiego.edu'
    }
  }
]

export const mockMajorNoPosts = {
  id: 301,
  name: 'Cognitive science',
  posts: []
}

export const mockMajorOnePost = {
  id: 302,
  name: 'Sociology',
  posts: [
    {
      id: 7,
      name: 'Sociology opportunity',
      description: 'this is a description for the post',
      desiredQualifications: 'student majoring in sociology',
      umbrellaTopics: [],
      researchPeriods: ['Spring 2025'],
      isActive: true,
      majors: ['Sociology'],
      faculty: {
        firstName: 'Dr.',
        lastName: 'Social',
        email: 'social@sandiego.edu'
      }
    }
  ]
}

export const mockOneStudent = {
  isActive: true,
  id: 0,
  firstName: 'Augusto',
  lastName: 'Escudero',
  email: 'aescudero@sandiego.edu',
  classStatus: 'Senior',
  graduationYear: 2025,
  majors: [
    'Computer Science'
  ],
  researchFieldInterests: [
    'Chemistry',
    'Computer Science'
  ],
  researchPeriodsInterest: [
    'Fall 2025'
  ],
  interestReason: 'Test reason',
  hasPriorExperience: true
}

export const mockMajorOneStudent = {
  id: 302,
  name: 'Computer Science',
  posts: [
    mockOneStudent
  ]
}

// ------------ EXPECTED RESPONSES/REQUESTS ------------ //

// expected response from GET /all-students
export const mockStudents = [
  {
    id: 1,
    name: 'Engineering, Math, and Computer Science',
    majors: [
      {
        id: 1,
        name: 'Computer Science',
        // posts: null,
        posts: [
          {
            isActive: true,
            id: 0,
            firstName: 'Augusto',
            lastName: 'Escudero',
            email: 'aescudero@sandiego.edu',
            classStatus: 'Senior',
            graduationYear: 2025,
            majors: [
              'Computer Science'
            ],
            researchFieldInterests: [
              'Chemistry',
              'Computer Science'
            ],
            researchPeriodsInterest: [
              'Fall 2025'
            ],
            interestReason: 'Test reason',
            hasPriorExperience: true
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Life and Physical Sciences',
    majors: [
      {
        id: 2,
        name: 'Chemistry',
        // posts: null,
        posts: [
          mockOneStudent
        ]
      }
    ]
  }
]

// expected response from GET /all-projects
export const mockResearchOps = [
  {
    id: -1,
    name: 'Other',
    majors: [{
      id: 9,
      name: 'Undeclared',
      posts: []
    }]
  },
  {
    id: 7,
    name: 'Discipline with no majors',
    majors: []
  },
  {
    id: 1,
    name: 'Engineering',
    majors: [
      {
        id: 101,
        name: 'Computer Science',
        posts: mockThreeActiveProjects
      },
      {
        id: 102,
        name: 'Electrical Engineering',
        posts: [
          {
            id: 2001,
            name: 'Post C',
            description: 'this is a description for post C',
            desiredQualifications: 'made of tin',
            umbrellaTopics: ['Umbrella Topic test'],
            researchPeriods: ['Fall 2025', 'Spring 2025'],
            isActive: false,
            majors: ['Electrical Engineering'],
            faculty: {
              firstName: 'Dr.',
              lastName: 'Semiconductor',
              email: 'semi@sandiego.edu'
            }
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Arts',
    majors: [
      {
        id: 201,
        name: 'Visual Arts',
        posts: [
          {
            id: 3001,
            name: 'Post D',
            description: 'this is a description for post D',
            desiredQualifications: 'artsy fartsy kinda person',
            umbrellaTopics: ['Diversity'],
            researchPeriods: ['Spring 2025'],
            isActive: true,
            majors: ['Visual Arts'],
            faculty: {
              firstName: 'Dr.',
              lastName: 'Rainbow',
              email: 'rainbow@sandiego.edu'
            }
          }
        ]
      },
      {
        id: 202,
        name: 'Music',
        posts: [
          {
            id: 4001,
            name: 'Post E',
            description: 'this is a description for post E',
            desiredQualifications: "mozart's relatives only",
            umbrellaTopics: ['Fur Elise'],
            researchPeriods: ['Fall 2025'],
            isActive: true,
            majors: ['Music', 'Art History'],
            faculty: {
              firstName: 'Dr.',
              lastName: 'Mozart',
              email: 'wannabeMozart@sandiego.edu'
            }
          }
        ]
      }
    ]
  },
  {
    id: 3,
    name: 'Social Sciences',
    majors: [
      mockMajorNoPosts,
      mockMajorOnePost
    ]
  }
]

// expected request to POST /studentProfiles
export const createStudentExpectedRequest = {
  name: 'Jane Doe',
  graduationYear: '2025',
  major: ['Computer Science'],
  classStatus: 'Senior',
  researchFieldInterests: ['Computer Science', 'Chemistry'],
  researchPeriodsInterest: ['Fall 2025', 'Spring 2025'],
  interestReason: 'I want to gain research experience and contribute to innovative projects.',
  hasPriorExperience: true
}

// expected response from GET /studentProfiles/current
export const getStudentCurrentExpected = {
  firstName: 'Jane',
  lastName: 'Doe',
  graduationYear: '2025',
  majors: ['Computer Science'],
  classStatus: 'Senior',
  researchFieldInterests: ['Computer Science', 'Data Science'],
  researchPeriodsInterest: ['Fall 2024'],
  interestReason: 'I want to gain research experience.',
  hasPriorExperience: true,
  isActive: true
}

// expected request to PUT /studentProfiles/current
export const putStudentCurrentExpected = {
  name: 'Jane Smith',
  graduationYear: '2025',
  majors: ['Computer Science'],
  classStatus: 'Senior',
  researchFieldInterests: ['Computer Science', 'Data Science'],
  researchPeriodsInterest: ['Fall 2024'],
  interestReason: 'I want to gain research experience.',
  hasPriorExperience: true,
  isActive: false
}

// expected request to DELETE /studentProfiles/current
// no request body needed

// expected request to POST /facultyProfiles
export const createFacultyExpectedRequest = {
  name: 'Dr. John Doe',
  department: ['Computer Science']
}

// expected response from GET /facultyProfiles/current
export const getFacultyCurrentExpected = {
  firstName: 'Dr. John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  department: [
    {
      id: 1,
      name: 'Computer Science'
    },
    {
      id: 2,
      name: 'Mathematics'
    }
  ],
  projects: mockThreeActiveProjects
}

// The edit faculty profile turns the formData.department into an array of just the ids
// The dropdown then knows which departments to display/choose based on id
// This means the associated ids need to come from the database on the backend to match up
// export const getFacultyCurrentExpectedIds = {
//   firstName: 'Dr. John',
//   lastName: 'Doe',
//   email: 'john.doe@example.com',
//   department: [1, 2],
//   projects: mockThreeActiveProjects
// }

// expected request to PUT /facultyProfiles/current
export const putFacultyCurrentExpected = {
  name: 'Dr. John Doe',
  email: 'john.doe@example.com',
  department: ['Computer Science', 'Mathematics']
}

// expected request to DELETE /facultyProfiles/current
// no request body needed

// expected request to POST /create-project
export const createProjectExpectedRequest = {
  title: 'My Special Secret Research',
  description: 'This is a test description',
  disciplines: [
    {
      id: 1,
      name: 'Engineering',
      majors: [
        {
          id: 1,
          name: 'Biomedical Engineering'
        }
      ]
    },
    {
      id: 2,
      name: 'Visual Arts',
      majors: [] // if there are no majors chosen from this discipline, it will be an empty list
    }
  ],
  researchPeriods: [
    {
      id: 1,
      name: 'Fall 2025'
    }
  ],
  desiredQualifications: 'Must be in the know... ',
  umbrellaTopics: [
    {
      id: 1,
      name: 'The Human Experience'
    }
  ],
  isActive: false
}

// expected responses from GET /disciplines, /majors, /research-periods, /umbrella-topics
export const mockDisciplinesMajors = [
  {
    id: 1,
    name: 'Engineering, Math, and Computer Science',
    majors: [{ id: 1, name: 'Computer Science' }, { id: 2, name: 'Math' }, { id: 3, name: 'Biomedical Engineering' }]
  },
  {
    id: 2,
    name: 'Life Sciences',
    majors: [{ id: 4, name: 'Environmental Science' }, { id: 5, name: 'Chemistry' }, { id: 6, name: 'Biology' }]
  },
  {
    id: -1,
    name: 'Other',
    majors: [{ id: 7, name: 'Undeclared' }, { id: 8, name: 'Another test major no discipline' }]
  }
]
export const getMajorsExpectedResponse = [{ id: 1, name: 'Computer Science' }, { id: 2, name: 'Chemistry' }, { id: 3, name: 'Data Science' }]
export const getResearchPeriodsExpectedResponse = [{ id: 1, name: 'Fall 2024' }, { id: 2, name: 'Spring 2025' }, { id: 3, name: 'Fall 2025' }]
export const getUmbrellaTopicsExpectedResponse = [{ id: 1, name: 'topic 1' }, { id: 2, name: 'topic 2' }]
export const getDepartmentsExpectedResponse = [{ id: 1, name: 'Computer Science' }, { id: 2, name: 'Mathematics' }, { id: 3, name: 'Chemistry' }]

// GET response /email-templates
export const getEmailTemplatesExpectedResponse = [
  {
    type: 'STUDENTS',
    subject: 'OUR SEARCH App Reminder',
    body: 'Dear student, as the new academic year begins, this is a reminder that you are still active on the OUR SEARCH app. Click here to login and view projects.'
  },
  {
    type: 'FACULTY',
    subject: 'OUR SEARCH App Reminder',
    body: 'Dear faculty, this is a reminder that you have an account on the OUR SEARCH app. As the new academic year begins, make sure to check the status of your project listings. Click here to login.'
  }
]

// PUT request /email-templates
export const putEmailTemplatesExpectedRequest = [
  {
    type: 'STUDENTS',
    subject: 'OUR SEARCH App Reminder',
    body: 'Dear student, new message.'
  },
  {
    type: 'FACULTY',
    subject: 'OUR SEARCH App Reminder',
    body: 'Dear faculty, new message.'
  }
]

// GET request /faculty
// /faculty?id=3

// GET request /project
// /project?id=3

// GET request /student
// /student?id=3

// GET response /faculty
export const getFacultyExpectedResponse = {
  id: 3,
  firstName: 'Dr. John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  department: ['Communications'],
  projects: [
    {
      id: 8,
      name: 'Project',
      description: 'this is a description',
      desiredQualifications: 'student here',
      umbrellaTopics: ['Umbrella Topic Mock'],
      researchPeriods: ['Spring 2025'],
      isActive: true,
      majors: ['Communications']
    }
  ]
}

// GET response /project
export const getProjectExpectedResponse = {
  id: 3,
  name: 'Project Name Here',
  description: 'This is a description',
  desiredQualifications: 'Must be... ',
  umbrellaTopics: ['topic 1'],
  researchPeriods: ['Fall 2025'],
  isActive: false,
  majors: ['Chemistry', 'Math']
}

// GET response /student
export const getStudentExpectedResponse = {
  id: 3,
  firstName: 'Jane',
  lastName: 'Doe',
  graduationYear: 2025,
  majors: ['Computer Science'],
  classStatus: 'Senior',
  researchFieldInterests: ['Computer Science', 'Data Science'],
  researchPeriodsInterest: ['Fall 2024'],
  interestReason: 'I want to gain research experience.',
  hasPriorExperience: true,
  isActive: true
}

// PUT request /student
export const putStudentExpectedRequest = {
  id: 3,
  name: 'Jane Smith',
  graduationYear: '2025',
  majors: ['Computer Science'],
  classStatus: 'Senior',
  researchFieldInterests: ['Computer Science', 'Data Science'],
  researchPeriodsInterest: ['Fall 2024'],
  interestReason: 'I want to gain research experience.',
  hasPriorExperience: true,
  isActive: false
}

// PUT request /faculty
export const putFacultyExpectedRequest = {
  id: 3,
  name: 'Dr. John Deer',
  email: 'john.deer@example.com',
  department: ['Engineering, Math, and Computer Science']
}

// PUT request /project
export const putProjectExpectedRequest = {
  id: 1,
  title: 'My Special Secret Research New Name',
  description: 'This is a new description',
  disciplines: [
    {
      id: 1,
      name: 'Engineering',
      majors: [
        {
          id: 1,
          name: 'Biomedical Engineering'
        }
      ]
    },
    {
      id: 2,
      name: 'Visual Arts',
      majors: [] // if there are no majors chosen from this discipline, it will be an empty list
    }
  ],
  researchPeriods: [
    {
      id: 3,
      name: 'Fall 2025'
    }
  ],
  desiredQualifications: 'Must be in the know... ',
  umbrellaTopics: [
    {
      id: 1,
      name: 'The Human Experience'
    }
  ],
  isActive: false
}

// PUT request /major
export const putMajorExpectedRequest = {
  id: 1,
  name: 'Computer Science',
  disciplines: ['Engineering, Math, and Computer Science']
}

// PUT request /discipline
export const putDisciplineExpectedRequest = {
  id: 1,
  name: 'Editted Name'
}

// PUT request /umbrella-topic
export const putUmbrellaTopicExpectedRequest = {
  id: 4,
  name: 'Editted Name'
}

// PUT request /department
export const putDepartmentExpectedRequest = {
  id: 4,
  name: 'Editted Name'
}

// PUT request /research-period
export const putResearchPeriodExpectedRequest = {
  id: 4,
  name: 'Editted Research Period Name'
}

// DELETE request /project
export const deleteProjectExpectedRequest = {
  id: 3
}

// DELETE request /student
export const deleteStudentExpectedRequest = {
  id: 3
}

// DELETE request /faculty
export const deleteFacultyExpectedRequest = {
  id: 3
}

// DELETE request /major
export const deleteMajorExpectedRequest = {
  id: 3
}

// DELETE request /discipline
export const deleteDisciplineExpectedRequest = {
  id: 3
}

// DELETE request /department
export const deleteDepartmentExpectedRequest = {
  id: 3
}

// DELETE request /umbrella-topic
export const deleteUmbrellaTopicExpectedRequest = {
  id: 3
}

// DELETE request /research-period
export const deleteResearchPeriodExpectedRequest = {
  id: 3
}

// POST (create new) request /major
export const createMajorExpectedRequest = {
  name: 'New Major',
  disciplines: ['Engineering, Math, and Computer Science', 'Life Sciences']
}

// POST (create new) request /discipline
export const createDisciplineExpectedRequest = {
  name: 'New Discipline'
}

// POST (create new) request /department
export const createDepartmentExpectedRequest = {
  name: 'New Department'
}

// POST (create new) request /umbrella-topic
export const createUmbrellaTopicExpectedRequest = {
  name: 'New Umbrella Topic'
}

// POST (create new) request /research-period
export const createResearchPeriodExpectedRequest = {
  name: 'New Research Period Name'
}

// GET response /all-faculty
export const getAllFacultyExpectedResponse = [
  {
    id: 6,
    name: 'Department with no faculty',
    faculty: []
  },
  {
    id: 4,
    name: 'Chemistry',
    faculty: [
      {
        id: 1,
        firstName: 'Dr.',
        lastName: 'Clark',
        email: 'clarkt@sandiego.edu',
        department: ['Chemistry'],
        projects: [
          {
            id: 10,
            name: 'Dr. Clark Project',
            description: 'this is a description',
            desiredQualifications: 'student in chem',
            umbrellaTopics: ['Umbrella Topic Mock'],
            researchPeriods: ['Spring 2025'],
            isActive: true,
            majors: ['Chemistry']
          },
          {
            id: 10,
            name: 'Test Inactive Project',
            description: 'this is a description',
            desiredQualifications: 'student in chem',
            umbrellaTopics: ['Umbrella Topic Mock'],
            researchPeriods: ['Spring 2025'],
            isActive: false,
            majors: ['Chemistry']
          }
        ]
      },
      {
        id: 1,
        firstName: 'Dr.',
        lastName: 'Swag',
        email: 'swag@sandiego.edu',
        department: ['Chemistry'],
        projects: [
          {
            id: 11,
            name: 'Swag Project',
            description: 'this is a description for swag project',
            desiredQualifications: 'Pursuing a BS in chemistry',
            umbrellaTopics: ['Umbrella Topic Mock'],
            researchPeriods: ['Summer 2025'],
            isActive: true,
            majors: ['Chemistry']
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Communications',
    faculty: [
      getFacultyExpectedResponse
    ]
  }
]

export const mockOneFaculty = {
  id: 1,
  firstName: 'Dr.',
  lastName: 'Clark',
  email: 'clartk@sandiego.edu',
  department: ['Chemistry'],
  projects: [
    {
      id: 10,
      name: 'Dr. Clark Project',
      description: 'this is a description',
      desiredQualifications: 'student in chem',
      umbrellaTopics: ['Umbrella Topic Mock'],
      researchPeriods: ['Spring 2025'],
      isActive: true,
      majors: ['Chemistry']
    }
  ]
}

// GET /all-student-faqs
export const getAllStudentFAQsResponse = [
  {
    id: 1,
    question: 'How do I edit my profile?',
    answer: 'Click top right button'
  },
  {
    id: 2,
    question: 'How do I find projects related to my major?',
    answer: 'Open side bar and filter and do stuff. It is pretty cool what you can do wow. ' +
    'This is a sample longer answer to see how it looks on the page. It just keeps going omg yep ' +
    'there is just so much to say on this topic mhm. Do you understand? Hope it makes sense. ' +
    'Contact OUR email address for further inquiries'
  }
]

// GET /all-faculty-faqs
export const getAllFacultyFAQsResponse = [
  {
    id: 1,
    question: 'How do I edit my faculty stuff like projects yknow?',
    answer: 'sample answer'
  },
  {
    id: 2,
    question: 'How do I find?',
    answer: 'blah faculty'
  }
]

// GET /all-admin-faqs
export const getAllAdminFAQsResponse = [
  {
    id: 1,
    question: 'How do I edit a student profile?',
    answer: 'Click'
  },
  {
    id: 2,
    question: 'How do I delete a major?',
    answer: 'Open things'
  }
]

// PUT /faq
export const putFaqExpectedRequest = {
  id: 3,
  type: 'STUDENT', // or 'FACULTY' or 'ADMIN'
  question: 'What do I do?',
  answer: 'You find out.'
}

// DELETE /faq
export const deleteFaqExpectedRequest = {
  id: 3,
  type: 'STUDENT' // or 'FACULTY' or 'ADMIN'
}

// POST /faq
export const postFaqExpectedRequest = {
  type: 'STUDENT', // or 'FACULTY' or 'ADMIN'
  question: 'How do I do it?',
  answer: 'With xyz steps.'
}

// GET /email-templates-time
export const getEmailTemplateTimeResponse = {
  notificationDateTime: '2025-04-25T12:00:00Z'
}

// PUT /email-templates-time
export const putEmailTemplateTimeExpected = {
  notificationDateTime: '2025-04-25T10:30:00Z'
}

// GET /admin-emails
export const getAdminEmailsExpectedResponse = [
  {
    id: 1,
    email: 'email-1@sandiego.edu'
  },
  {
    id: 2,
    email: 'email-2@sandiego.edu'
  }
]

// POST /admin-emails
export const createAdminEmailExpected = {
  email: 'new-email@sandiego.edu'
}

// DELETE /admin-emails
export const deleteAdminEmailExpected = {
  id: 5
}

// /weekly-notification-day
export const getWeeklyDay = {
  day: 'Monday'
}
