package COMP_49X_our_search.backend.database;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.entities.ResearchPeriod;
import COMP_49X_our_search.backend.database.entities.Student;
import COMP_49X_our_search.backend.database.repositories.StudentRepository;
import COMP_49X_our_search.backend.database.services.StudentService;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = {StudentService.class})
@ActiveProfiles("test")
public class StudentServiceTest {

  @Autowired private StudentService studentService;

  @MockBean private StudentRepository studentRepository;

  private Student student;

  @BeforeEach
  void setUp() {
    student = new Student();
    student.setFirstName("First");
    student.setLastName("Last");
    student.setEmail("flast@test.com");
    student.setGraduationYear(2025);
    student.setMajors(Set.of(new Major("Computer Science", null, null, null)));
    student.setResearchPeriods(Set.of(new ResearchPeriod("Computer Science", null, null)));
  }

  @Test
  void testGetAllStudents() {
    when(studentRepository.findAll()).thenReturn(List.of(student));

    List<Student> students = studentService.getAllStudents();

    assertEquals(1, students.size());
    assertTrue(students.contains(student));

    verify(studentRepository, times(1)).findAll();
  }

  @Test
  void testGetStudentsByMajorId() {
    int majorId = 1;
    when(studentRepository.findAllByMajors_Id(majorId)).thenReturn(List.of(student));

    List<Student> students = studentService.getStudentsByMajorId(majorId);

    assertEquals(1, students.size());
    assertTrue(students.contains(student));

    verify(studentRepository, times(1)).findAllByMajors_Id(majorId);
  }

  @Test
  void testGetStudentsByResearchFieldInterestId() {
    int researchFieldId = 2;
    when(studentRepository.findAllByResearchFieldInterests_Id(researchFieldId))
        .thenReturn(List.of(student));

    List<Student> students = studentService.getStudentsByResearchFieldInterestId(researchFieldId);

    assertEquals(1, students.size());
    assertTrue(students.contains(student));

    verify(studentRepository, times(1)).findAllByResearchFieldInterests_Id(researchFieldId);
  }

  @Test
  void testSaveStudent() {
    when(studentRepository.save(any(Student.class))).thenReturn(student);

    Student savedStudent = studentService.saveStudent(student);

    assertEquals(student.getEmail(), savedStudent.getEmail());
    assertEquals(student.getFirstName(), savedStudent.getFirstName());
    assertEquals(student.getLastName(), savedStudent.getLastName());

    verify(studentRepository, times(1)).save(student);
  }

  @Test
  void testExistsByEmail_existingStudent_returnsTrue() {
    when(studentRepository.existsByEmail(student.getEmail())).thenReturn(true);

    boolean exists = studentService.existsByEmail(student.getEmail());

    assertTrue(exists);
    verify(studentRepository, times(1)).existsByEmail(student.getEmail());
  }

  @Test
  void testExistsByEmail_nonExistingStudent_returnsFalse() {
    when(studentRepository.existsByEmail("nonexistent@test.com")).thenReturn(false);

    boolean exists = studentService.existsByEmail("nonexistent@test.com");

    assertFalse(exists);
    verify(studentRepository, times(1)).existsByEmail("nonexistent@test.com");
  }

  @Test
  void testGetStudentByEmail_existingStudent_returnsStudent() {
    when(studentRepository.findStudentByEmail(student.getEmail())).thenReturn(Optional.of(student));

    Student retrievedStudent = studentService.getStudentByEmail(student.getEmail());

    assertNotNull(retrievedStudent);
    assertEquals(student.getEmail(), retrievedStudent.getEmail());

    verify(studentRepository, times(1)).findStudentByEmail(student.getEmail());
  }

  @Test
  void testGetStudentByEmail_nonExistingStudent_throwsException() {
    String nonExistingEmail = "nonexistent@test.com";
    when(studentRepository.findStudentByEmail(nonExistingEmail)).thenReturn(Optional.empty());

    Exception exception =
        assertThrows(
            RuntimeException.class, () -> studentService.getStudentByEmail(nonExistingEmail));

    assertEquals("Student not found with email: " + nonExistingEmail, exception.getMessage());
    verify(studentRepository, times(1)).findStudentByEmail(nonExistingEmail);
  }
}
