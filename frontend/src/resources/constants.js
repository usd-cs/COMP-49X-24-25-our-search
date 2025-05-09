export const APP_TITLE = 'OUR SEARCH'

export const DARK_BLUE_COLOR = '#0C4178'
export const CUSTOM_BLUE_COLOR = '#A7C7E7'
export const CUSTOM_BG_COLOR = '#FAFAFA'
export const CUSTOM_BUTTON_COLOR = '#0189ce'
export const CUSTOM_RED_COLOR = '#B00020'

export const ERROR_LOADING_POSTS_MSG = 'Sorry, there was an error loading site data. Try again later.'
export const NO_MAJORS_MSG = 'Nothing available'
export const NO_FACULTY_MSG = 'No faculty available'

export const viewStudentsFlag = 'students'
export const viewProjectsFlag = 'projects'
export const viewFacultyFlag = 'faculty'
export const viewMyProjectsFlag = 'myProjects'

// DEV
export const FRONTEND_URL = 'http://localhost'
export const BACKEND_URL = 'http://localhost:8080'
// export const BACKEND_URL = 'http://localhost/api'

// PROD
// export const FRONTEND_URL = 'http://oursearch.dedyn.io'
// export const FRONTEND_URL = 'http://oursearch.dedyn.io:8080'

export const GET_PROJECTS_URL = BACKEND_URL + '/all-projects'
export const GET_STUDENTS_URL = BACKEND_URL + '/all-students'
export const GET_FACULTY_URL = BACKEND_URL + '/all-faculty'

export const TYPE_STUDENT = 'STUDENT'
export const TYPE_FACULTY = 'FACULTY'
export const TYPE_ADMIN = 'ADMIN'

export const FETCH_STUDENT_FAQS_URL = BACKEND_URL + '/all-student-faqs'
export const FETCH_FACULTY_FAQS_URL = BACKEND_URL + '/all-faculty-faqs'
export const FETCH_ADMIN_FAQS_URL = BACKEND_URL + '/all-admin-faqs'
export const EMAIL_TEMPLATES_URL = BACKEND_URL + '/email-templates'
export const EMAIL_TIME_URL = BACKEND_URL + '/email-templates-time'
export const FAQ_URL = BACKEND_URL + '/faq'
export const ADMIN_EMAIL_URL = `${BACKEND_URL}/admin-emails`

export const CURRENT_FACULTY_ENDPOINT = `${BACKEND_URL}/api/facultyProfiles/current`
export const GET_DISCIPLINES_ENDPOINT = BACKEND_URL + '/disciplines'
export const GET_UMBRELLA_TOPICS_ENDPOINT = BACKEND_URL + '/umbrella-topics'
export const GET_RESEARCH_PERIODS_ENDPOINT = BACKEND_URL + '/research-periods'
export const GET_MAJORS_ENDPOINT = BACKEND_URL + '/majors'
export const GET_DEPARTMENTS_ENDPOINT = BACKEND_URL + '/departments'
