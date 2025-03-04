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

export const dummyStudentProfile = {
  name: 'Jane Doe',
  graduationYear: '2025',
  major: ['Computer Science'],
  classStatus: ['Senior'],
  researchFieldInterests: ['Artificial Intelligence', 'Data Science'],
  researchPeriodsInterest: ['Fall 2024'],
  interestReason: 'I want to gain research experience.',
  hasPriorExperience: 'yes',
  active: true
}
