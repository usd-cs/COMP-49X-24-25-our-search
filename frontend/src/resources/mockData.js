export const mockThreeMajorsList = [
  'Computer Science',
  'Mathematics',
  'Cognitive Science'
]

export const mockOneMajorList = ['Chemistry']

export const mockOneActiveProject = {
  name: 'AI Research',
  description: 'Exploring AI in education.',
  desired_qualifications: 'Experience in Python and AI frameworks.',
  umbrella_topics: ['AI', 'Education'],
  research_periods: ['Spring 2024', 'Fall 2024'],
  is_active: true,
  majors: ['Computer Science', 'Education'],
  faculty:
    {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@sandiego.edu'
    }

}

export const mockTwoInactiveProjects = [
  {
    id: 1001,
    name: 'Post A',
    description: 'this is a description for post A',
    desired_qualifications: 'student in CS',
    umbrella_topics: [],
    research_periods: ['Spring 2025'],
    is_active: false,
    majors: mockThreeMajorsList,
    faculty:
        {
          first_name: 'Dr.',
          last_name: 'Coding',
          email: 'drcoding@sandiego.edu'
        }

  },
  {
    id: 1002,
    name: 'Post B',
    description: 'this is a description for post B',
    desired_qualifications: 'student passionate about math',
    umbrella_topics: [],
    research_periods: ['Fall 2025'],
    is_active: false,
    majors: mockThreeMajorsList,
    faculty:
        {
          first_name: 'Dr.',
          last_name: 'Debugger',
          email: 'debugger@sandiego.edu'
        }

  }
]

export const mockThreeActiveProjects = [
  {
    id: 1001,
    name: 'Post A',
    description: 'this is a description for post A',
    desired_qualifications: 'student in CS',
    umbrella_topics: [],
    research_periods: ['Spring 2025'],
    is_active: true,
    majors: mockThreeMajorsList,
    faculty:
        {
          first_name: 'Dr.',
          last_name: 'Coding',
          email: 'drcoding@sandiego.edu'
        }

  },
  {
    id: 1002,
    name: 'Post B',
    description: 'this is a description for post B',
    desired_qualifications: 'student passionate about math',
    umbrella_topics: [],
    research_periods: ['Fall 2025'],
    is_active: true,
    majors: mockThreeMajorsList,
    faculty:
        {
          first_name: 'Dr.',
          last_name: 'Debugger',
          email: 'debugger@sandiego.edu'
        }
  },
  {
    id: 1003,
    name: 'Post Z',
    description: 'this is a description for post Z',
    desired_qualifications: 'gpa above 3.0',
    umbrella_topics: [],
    research_periods: ['Spring 2025'],
    is_active: true,
    majors: mockOneMajorList,
    faculty:
        {
          first_name: 'Dr.',
          last_name: 'React',
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
      desired_qualifications: 'student majoring in sociology',
      umbrella_topics: [],
      research_periods: ['Spring 2025'],
      is_active: true,
      majors: ['Sociology'],
      faculty:
            {
              first_name: 'Dr.',
              last_name: 'Social',
              email: 'social@sandiego.edu'
            }
    }
  ]
}

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
            desired_qualifications: 'made of tin',
            umbrella_topics: [],
            research_periods: ['Fall 2025'],
            is_active: true,
            majors: ['Electrical Engineering'],
            faculty:
                        {
                          first_name: 'Dr.',
                          last_name: 'Semiconductor',
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
            desired_qualifications: 'artsy fartsy kinda person',
            umbrella_topics: ['Diversity'],
            research_periods: ['Spring 2025'],
            is_active: true,
            majors: ['Visual Arts'],
            faculty:
                        {
                          first_name: 'Dr.',
                          last_name: 'Rainbow',
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
            desired_qualifications: "mozart's relatives only",
            umbrella_topics: ['Fur Elise'],
            research_periods: ['Fall 2025'],
            is_active: true,
            majors: ['Music', 'Art History'],
            faculty:
                        {
                          first_name: 'Dr.',
                          last_name: 'Mozart',
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
