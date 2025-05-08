/**
 * Service class for managing Student entities. This class provides business
 * logic for retrieving student data from the database through the
 * StudentRepository.
 *
 * This service is annotated with @Service to indicate that it's managed by
 * Spring.
 *
 * @author Augusto Escudero
 */
package COMP_49X_our_search.backend.database.services;

import COMP_49X_our_search.backend.database.entities.Student;
import COMP_49X_our_search.backend.database.entities.User;
import COMP_49X_our_search.backend.database.enums.UserRole;
import COMP_49X_our_search.backend.database.repositories.StudentRepository;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentService {

  private final StudentRepository studentRepository;
  private final UserService userService;

  @Autowired
  public StudentService(StudentRepository studentRepository, UserService userService) {
    this.studentRepository = studentRepository;
    this.userService = userService;
  }

  public List<Student> getAllStudents() {
    return studentRepository.findAll();
  }

  public List<Student> getStudentsByMajorId(int majorId) {
    return studentRepository.findAllByMajors_Id(majorId);
  }

  public List<Student> getStudentsByResearchFieldInterestId(int researchFieldId) {
    return studentRepository.findAllByResearchFieldInterests_Id(researchFieldId);
  }

  public Student saveStudent(Student student) {
    return studentRepository.save(student);
  }

  public boolean existsByEmail(String email) {
    return studentRepository.existsByEmail(email);
  }

  public Student getStudentByEmail(String email) {
    return studentRepository
        .findStudentByEmail(email)
        .orElseThrow(() -> new RuntimeException("Student not found with email: " + email));
  }

  public Student getStudentById(int id) {
    return studentRepository
            .findById(id)
            .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
  }

  public void deleteStudentByEmail(String email) {
    if (!studentRepository.existsByEmail(email)) {
      throw new RuntimeException(
          String.format(
              "Cannot delete student with email '%s'. Student not found", email
          )
      );
    }
    studentRepository.deleteByEmail(email);
  }

  public List<Student> getNewStudents() {
    List<User> newUsers = userService.getUsersCreatedInLastWeek();

    return newUsers.stream()
        .filter(user -> user.getUserRole().equals(UserRole.STUDENT))
        .map(user -> studentRepository.findStudentByEmail(user.getEmail()))
        .flatMap(Optional::stream)
        .toList();
  }
}
