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
  umbrellaTopics: ['AI', 'Education'],
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
    name: 'Post A',
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
    name: 'Post B',
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
    umbrellaTopics: [],
    researchPeriods: ['Spring 2025'],
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

// expected response from GET /students
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

// expected response from GET /projects
export const mockResearchOps = [
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
            umbrellaTopics: [],
            researchPeriods: ['Fall 2025'],
            isActive: true,
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
  hasPriorExperience: 'yes'
}

// expected response from GET /studentProfiles/current
export const getStudentCurrentExpected = {
  firstName: 'Jane',
  lastName: 'Doe',
  graduationYear: '2025',
  majors: ['Computer Science'],
  classStatus: ['Senior'],
  researchFieldInterests: ['Computer Science', 'Data Science'],
  researchPeriodsInterest: ['Fall 2024'],
  interestReason: 'I want to gain research experience.',
  hasPriorExperience: 'yes',
  active: true
}

// expected request to PUT /studentProfiles/current
export const putStudentCurrentExpected = {
  name: 'Jane Smith',
  graduationYear: '2025',
  majors: ['Computer Science'],
  classStatus: ['Senior'],
  researchFieldInterests: ['Computer Science', 'Data Science'],
  researchPeriodsInterest: ['Fall 2024'],
  interestReason: 'I want to gain research experience.',
  hasPriorExperience: 'yes',
  active: false
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
export const getFacultyCurrentExpectedIds = {
  firstName: 'Dr. John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  department: [1, 2],
  projects: mockThreeActiveProjects
}

// expected request to PUT /facultyProfiles/current
export const putFacultyCurrentExpected = {
  name: 'Dr. John Doe',
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
  ]
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
    name: 'Engineering, Math, and Life Sciences',
    majors: [{ id: 1, name: 'Computer Science' }, { id: 2, name: 'Math' }, { id: 3, name: 'Biomedical Engineering' }]
  },
  {
    id: 2,
    name: 'Life Sciences',
    majors: [{ id: 1, name: 'Environmental Science' }, { id: 2, name: 'Chemistry' }, { id: 3, name: 'Biology' }]
  }
]
export const getMajorsExpectedResponse = [{ id: 1, name: 'Computer Science' }, { id: 2, name: 'Chemistry' }, { id: 3, name: 'Data Science' }]
export const getResearchPeriodsExpectedResponse = [{ id: 1, name: 'Fall 2024' }, { id: 2, name: 'Spring 2025' }]
export const getUmbrellaTopicsExpectedResponse = [{ id: 1, name: 'topic 1' }, { id: 2, name: 'topic 2' }]
export const getDepartmentsExpectedResponse = [{ id: 1, name: 'Computer Science' }, { id: 2, name: 'Mathematics' }, { id: 3, name: 'Chemistry' }]
