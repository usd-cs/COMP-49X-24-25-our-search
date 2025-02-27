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
import COMP_49X_our_search.backend.database.repositories.StudentRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentService {

  private final StudentRepository studentRepository;

  @Autowired
  public StudentService(StudentRepository studentRepository) {
    this.studentRepository = studentRepository;
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

}
