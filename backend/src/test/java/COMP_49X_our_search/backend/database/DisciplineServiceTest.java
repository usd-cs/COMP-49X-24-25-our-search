package COMP_49X_our_search.backend.database;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import COMP_49X_our_search.backend.database.entities.Discipline;
import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.entities.Student;
import COMP_49X_our_search.backend.database.repositories.DisciplineRepository;
import COMP_49X_our_search.backend.database.repositories.MajorRepository;
import COMP_49X_our_search.backend.database.repositories.StudentRepository;
import COMP_49X_our_search.backend.database.services.DisciplineService;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Sort;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = {DisciplineService.class})
@ActiveProfiles("test")
public class DisciplineServiceTest {

  @Autowired
  private DisciplineService disciplineService;

  @MockBean
  private DisciplineRepository disciplineRepository;

  @MockBean
  private MajorRepository majorRepository;

  @MockBean
  private StudentRepository studentRepository;

  @Test
  void testGetAllDisciplines() {
    Discipline engineeringDiscipline = new Discipline("Engineering");
    Discipline lifeSciencesDiscipline = new Discipline("Life Sciences");

    when(disciplineRepository.findAll(Sort.by(Sort.Direction.ASC, "name")))
        .thenReturn(List.of(engineeringDiscipline, lifeSciencesDiscipline));

    List<Discipline> disciplines = disciplineService.getAllDisciplines();

    assertEquals(2, disciplines.size());
    assertTrue(disciplines
        .containsAll(List.of(engineeringDiscipline, lifeSciencesDiscipline)));
  }

  @Test
  void testGetDisciplineByName() {
    Discipline engineeringDiscipline = new Discipline();
    engineeringDiscipline.setId(1);
    engineeringDiscipline.setName("Engineering");

    when(disciplineRepository.findByName("Engineering")).thenReturn(Optional.of(engineeringDiscipline));

    Discipline dbDiscipline = disciplineService.getDisciplineByName("Engineering");

    assertEquals(engineeringDiscipline.getName(), dbDiscipline.getName());
    assertEquals(engineeringDiscipline.getId(), dbDiscipline.getId());
  }

  @Test
  void deleteDisciplineById_whenDisciplineExists_deleteSuccessfully() {
    int disciplineId = 1;
    Discipline discipline = new Discipline(disciplineId, "Engineering");

    Major major1 = new Major(1, "Computer Science");
    Major major2 = new Major(2, "Electrical Engineering");
    Set<Major> majors = new HashSet<>();
    majors.add(major1);
    majors.add(major2);

    Student student1 = new Student();
    student1.setId(1);
    Student student2 = new Student();
    student2.setId(2);
    Set<Student> students = new HashSet<>();
    students.add(student1);
    students.add(student2);

    discipline.setMajors(majors);
    discipline.setStudents(students);

    Set<Discipline> major1Disciplines = new HashSet<>();
    major1Disciplines.add(discipline);
    major1.setDisciplines(major1Disciplines);

    Set<Discipline> major2Disciplines = new HashSet<>();
    major2Disciplines.add(discipline);
    major2.setDisciplines(major2Disciplines);

    Set<Discipline> student1Disciplines = new HashSet<>();
    student1Disciplines.add(discipline);
    student1.setDisciplines(student1Disciplines);

    Set<Discipline> student2Disciplines = new HashSet<>();
    student2Disciplines.add(discipline);
    student2.setDisciplines(student2Disciplines);

    when(disciplineRepository.findById(disciplineId)).thenReturn(Optional.of(discipline));

    disciplineService.deleteDisciplineById(disciplineId);

    verify(disciplineRepository, times(1)).findById(disciplineId);

    assertTrue(discipline.getMajors().isEmpty());
    assertTrue(discipline.getStudents().isEmpty());

    verify(disciplineRepository, times(1)).delete(discipline);

    verify(majorRepository, never()).save(any(Major.class));
    verify(studentRepository, never()).save(any(Student.class));
    verify(disciplineRepository, never()).save(any(Discipline.class));
  }

  @Test
  void deleteDisciplineById_disciplineDoesNotExist_throwsException() {
    int disciplineId = 999;
    when(disciplineRepository.findById(disciplineId)).thenReturn(Optional.empty());

    RuntimeException exception = assertThrows(
        RuntimeException.class,
        () -> disciplineService.deleteDisciplineById(disciplineId)
    );

    String expectedMessage = String.format(
        "Cannot delete discipline with id '%s'. Discipline not found.", disciplineId
    );
    String actualMessage = exception.getMessage();
    assertTrue(actualMessage.contains(expectedMessage));

    verify(disciplineRepository, times(1)).findById(disciplineId);
    verify(disciplineRepository, never()).save(any(Discipline.class));
    verify(disciplineRepository, never()).delete(any(Discipline.class));
    verify(majorRepository, never()).save(any(Major.class));
    verify(studentRepository, never()).save(any(Student.class));
  }

  @Test
  void deleteDisciplineById_disciplineHasNoRelationships_deleteSuccessfully() {
    int disciplineId = 1;
    Discipline discipline = new Discipline(disciplineId, "Engineering");
    discipline.setMajors(new HashSet<>());
    discipline.setStudents(new HashSet<>());

    when(disciplineRepository.findById(disciplineId)).thenReturn(Optional.of(discipline));

    disciplineService.deleteDisciplineById(disciplineId);

    verify(disciplineRepository, times(1)).findById(disciplineId);
    verify(disciplineRepository, times(1)).delete(discipline);

    verify(majorRepository, never()).save(any(Major.class));
    verify(studentRepository, never()).save(any(Student.class));
    verify(disciplineRepository, never()).save(any(Discipline.class));
  }

  @Test
  void testGetDisciplineById_whenDisciplineDoesNotExist_throwsRuntimeException() {
    // GIVEN
    int disciplineId = 999;
    when(disciplineRepository.findById(disciplineId)).thenReturn(Optional.empty());

    // WHEN & THEN
    RuntimeException ex = assertThrows(RuntimeException.class, () ->
            disciplineService.getDisciplineById(disciplineId)
    );

    assertTrue(ex.getMessage().contains("Discipline not found with id: 999"));
    verify(disciplineRepository, times(1)).findById(disciplineId);
  }

  @Test
  void testSaveDiscipline_savesDisciplineAndReturnsIt() {
    Discipline newDiscipline = new Discipline("Robotics");
    Discipline savedDiscipline = new Discipline(1, "Robotics");

    when(disciplineRepository.save(newDiscipline)).thenReturn(savedDiscipline);

    Discipline result = disciplineService.saveDiscipline(newDiscipline);

    assertEquals(savedDiscipline, result);
    assertEquals(1, result.getId());
    assertEquals("Robotics", result.getName());
    verify(disciplineRepository, times(1)).save(newDiscipline);
  }
}