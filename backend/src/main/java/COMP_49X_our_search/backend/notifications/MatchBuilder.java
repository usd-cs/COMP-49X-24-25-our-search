package COMP_49X_our_search.backend.notifications;

import COMP_49X_our_search.backend.database.entities.Faculty;
import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.entities.Project;
import COMP_49X_our_search.backend.database.entities.Student;
import COMP_49X_our_search.backend.database.services.FacultyService;
import COMP_49X_our_search.backend.database.services.ProjectService;
import COMP_49X_our_search.backend.database.services.StudentService;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class MatchBuilder {

  private ProjectService projectService;
  private StudentService studentService;
  private FacultyService facultyService;

  @Autowired
  public MatchBuilder(
      ProjectService projectService, StudentService studentService, FacultyService facultyService) {
    this.projectService = projectService;
    this.studentService = studentService;
    this.facultyService = facultyService;
  }

  @Transactional
  public Map<String, List<Project>> buildStudentMatches() {
    List<Project> newProjects = projectService.getNewProjects();
    return studentService.getAllStudents().stream()
        .map(
            student ->
                Map.entry(
                    student.getEmail(),
                    newProjects.stream().filter(project -> matches(student, project)).toList()))
        .filter(entry -> !entry.getValue().isEmpty())
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
  }

  @Transactional
  public Map<String, List<Student>> buildFacultyMatches() {
    List<Student> newStudents = studentService.getNewStudents();
    return facultyService.getAllFaculty().stream()
        .map(
            faculty ->
                Map.entry(
                    faculty.getEmail(),
                    newStudents.stream().filter(student -> matches(faculty, student)).toList()))
        .filter(entry -> !entry.getValue().isEmpty())
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
  }

  private boolean matches(Student student, Project project) {
    // The logic for Student-Project matching is as follows:
    // - A match exists if at least one of the project's listed majors
    //   is also listed among the student's research field interests.
    // - Matching is case-insensitive and based on the name of each major.
    List<String> studentInterests =
        student.getResearchFieldInterests().stream().map(Major::getName).toList();
    List<String> projectMajors = project.getMajors().stream().map(Major::getName).toList();

    if (studentInterests.isEmpty() || projectMajors.isEmpty()) return false;

    return projectMajors.stream()
        .anyMatch(
            major ->
                studentInterests.stream().anyMatch(interest -> interest.equalsIgnoreCase(major)));
  }

  private boolean matches(Faculty faculty, Student student) {
    List<Project> projects = projectService.getProjectsByFacultyId(faculty.getId());
    if (projects == null || projects.isEmpty()) return false;

    // The logic for Faculty-Student matches is as follows:
    // - A faculty member matches a student if the faculty has at least one
    //   project that matches the student, using the same Student-Project
    //   matching logic defined in the matches(Student, Project) method.
    return projects.stream().anyMatch(project -> matches(student, project));
  }
}
