package COMP_49X_our_search.backend.database;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
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
import COMP_49X_our_search.backend.util.Constants;
import COMP_49X_our_search.backend.util.exceptions.ForbiddenDisciplineActionException;
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

  @Autowired private DisciplineService disciplineService;

  @MockBean private DisciplineRepository disciplineRepository;

  @MockBean private MajorRepository majorRepository;

  @MockBean private StudentRepository studentRepository;

  @Test
  void testInitializeSpecialDisciplines_createsOtherIfMissing() {
    when(disciplineRepository.findByName(Constants.DISCIPLINE_OTHER)).thenReturn(Optional.empty());

    disciplineService.initializeSpecialDisciplines();

    verify(disciplineRepository, times(1)).save(any(Discipline.class));
  }

  @Test
  void testInitializeSpecialDisciplines_doesNotCreateOtherIfExists() {
    when(disciplineRepository.findByName(Constants.DISCIPLINE_OTHER))
        .thenReturn(Optional.of(new Discipline(Constants.DISCIPLINE_OTHER)));

    disciplineService.initializeSpecialDisciplines();

    verify(disciplineRepository, never()).save(any(Discipline.class));
  }

  @Test
  void testGetAllDisciplines() {
    Discipline engineeringDiscipline = new Discipline("Engineering");
    Discipline lifeSciencesDiscipline = new Discipline("Life Sciences");

    when(disciplineRepository.findAll(Sort.by(Sort.Direction.ASC, "name")))
        .thenReturn(List.of(engineeringDiscipline, lifeSciencesDiscipline));

    List<Discipline> disciplines = disciplineService.getAllDisciplines();

    assertEquals(2, disciplines.size());
    assertTrue(disciplines.containsAll(List.of(engineeringDiscipline, lifeSciencesDiscipline)));
  }

  @Test
  void testGetDisciplineByName() {
    Discipline engineeringDiscipline = new Discipline();
    engineeringDiscipline.setId(1);
    engineeringDiscipline.setName("Engineering");

    when(disciplineRepository.findByName("Engineering"))
        .thenReturn(Optional.of(engineeringDiscipline));

    Discipline dbDiscipline = disciplineService.getDisciplineByName("Engineering");

    assertEquals(engineeringDiscipline.getName(), dbDiscipline.getName());
    assertEquals(engineeringDiscipline.getId(), dbDiscipline.getId());
  }

  @Test
  void deleteDisciplineById_whenDisciplineExists_deleteSuccessfully() {
    int disciplineId = 1;
    Discipline discipline = new Discipline(disciplineId, "Engineering");
    Discipline otherDiscipline = new Discipline(2, Constants.DISCIPLINE_OTHER);

    Major major1 = new Major(1, "Computer Science");
    Set<Discipline> major1Disciplines = new HashSet<>();
    major1Disciplines.add(discipline);
    major1.setDisciplines(major1Disciplines);

    Major major2 = new Major(2, "Electrical Engineering");
    Discipline anotherDiscipline = new Discipline(3, "Another Discipline");
    Set<Discipline> major2Disciplines = new HashSet<>();
    major2Disciplines.add(discipline);
    major2Disciplines.add(anotherDiscipline);
    major2.setDisciplines(major2Disciplines);

    Student student1 = new Student();
    student1.setId(1);
    Student student2 = new Student();
    student2.setId(2);
    Set<Student> students = new HashSet<>();
    students.add(student1);
    students.add(student2);

    Set<Major> majors = new HashSet<>();
    majors.add(major1);
    majors.add(major2);
    discipline.setMajors(majors);
    discipline.setStudents(students);

    Set<Discipline> student1Disciplines = new HashSet<>();
    student1Disciplines.add(discipline);
    student1.setDisciplines(student1Disciplines);

    Set<Discipline> student2Disciplines = new HashSet<>();
    student2Disciplines.add(discipline);
    student2.setDisciplines(student2Disciplines);

    when(disciplineRepository.findById(disciplineId)).thenReturn(Optional.of(discipline));
    when(disciplineRepository.findByName(Constants.DISCIPLINE_OTHER))
        .thenReturn(Optional.of(otherDiscipline));

    disciplineService.deleteDisciplineById(disciplineId);

    verify(disciplineRepository, times(1)).findById(disciplineId);

    assertTrue(discipline.getMajors().isEmpty());

    assertTrue(major1.getDisciplines().contains(otherDiscipline));

    assertFalse(major2.getDisciplines().contains(discipline));
    assertTrue(major2.getDisciplines().contains(anotherDiscipline));
    assertFalse(major2.getDisciplines().contains(otherDiscipline));

    assertTrue(discipline.getStudents().isEmpty());

    verify(disciplineRepository, times(1)).delete(discipline);
  }

  @Test
  void deleteDisciplineById_singleDisciplineMajors_reassignedToOther() {
    int disciplineId = 1;
    Discipline discipline = new Discipline(disciplineId, "Engineering");
    Discipline otherDiscipline = new Discipline(2, Constants.DISCIPLINE_OTHER);

    Major orphanMajor = new Major(1, "Orphan Major");
    Set<Discipline> orphanDisciplines = new HashSet<>();
    orphanDisciplines.add(discipline);
    orphanMajor.setDisciplines(orphanDisciplines);

    Set<Major> majors = new HashSet<>();
    majors.add(orphanMajor);
    discipline.setMajors(majors);

    when(disciplineRepository.findById(disciplineId)).thenReturn(Optional.of(discipline));
    when(disciplineRepository.findByName(Constants.DISCIPLINE_OTHER))
        .thenReturn(Optional.of(otherDiscipline));

    disciplineService.deleteDisciplineById(disciplineId);

    assertEquals(1, orphanMajor.getDisciplines().size());
    assertTrue(orphanMajor.getDisciplines().contains(otherDiscipline));
    assertFalse(orphanMajor.getDisciplines().contains(discipline));

    assertTrue(otherDiscipline.getMajors().contains(orphanMajor));

    verify(disciplineRepository, times(1)).delete(discipline);
  }

  @Test
  void deleteDisciplineById_disciplineDoesNotExist_throwsException() {
    int disciplineId = 999;
    when(disciplineRepository.findById(disciplineId)).thenReturn(Optional.empty());

    RuntimeException exception =
        assertThrows(
            RuntimeException.class, () -> disciplineService.deleteDisciplineById(disciplineId));

    String expectedMessage =
        String.format("Cannot delete discipline with id '%s'. Discipline not found.", disciplineId);
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
  }

  @Test
  void testGetDisciplineById_whenDisciplineDoesNotExist_throwsRuntimeException() {
    // GIVEN
    int disciplineId = 999;
    when(disciplineRepository.findById(disciplineId)).thenReturn(Optional.empty());

    // WHEN & THEN
    RuntimeException ex =
        assertThrows(
            RuntimeException.class, () -> disciplineService.getDisciplineById(disciplineId));

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

  @Test
  void testGetOtherDiscipline_returnsExistingOther() {
    Discipline other = new Discipline("Other");
    when(disciplineRepository.findByName(Constants.DISCIPLINE_OTHER))
        .thenReturn(Optional.of(other));

    Discipline result = disciplineService.getOtherDiscipline();

    assertEquals("Other", result.getName());
    verify(disciplineRepository, never()).save(any());
  }

  @Test
  void testGetOtherDiscipline_createsIfMissing() {
    when(disciplineRepository.findByName(Constants.DISCIPLINE_OTHER)).thenReturn(Optional.empty());

    disciplineService.getOtherDiscipline();

    verify(disciplineRepository, times(1)).save(any(Discipline.class));
  }

  @Test
  void saveDiscipline_withId_throwsException() {
    Discipline existing = new Discipline(1, "Engineering");
    IllegalArgumentException ex =
        assertThrows(
            IllegalArgumentException.class, () -> disciplineService.saveDiscipline(existing));

    assertTrue(ex.getMessage().contains("use editDiscipline instead"));
    // initializeSpecialDisciplines() will always call save() so in order to
    // check if calling saveDiscipline() does not call save(), we need to make
    // sure that save() is only called once.
    verify(disciplineRepository, times(1)).save(any());
  }

  @Test
  void saveDiscipline_namedOther_throwsException() {
    Discipline other = new Discipline();
    other.setName(Constants.DISCIPLINE_OTHER);

    ForbiddenDisciplineActionException ex =
        assertThrows(
            ForbiddenDisciplineActionException.class,
            () -> disciplineService.saveDiscipline(other));

    assertTrue(ex.getMessage().contains("Creating a discipline with name 'Other' is not allowed."));
    verify(disciplineRepository, never()).save(any());
  }

  @Test
  void deleteDisciplineById_ifDisciplineIsOther_throwsException() {
    Discipline other = new Discipline(1, Constants.DISCIPLINE_OTHER);

    when(disciplineRepository.findById(1)).thenReturn(Optional.of(other));

    ForbiddenDisciplineActionException ex =
        assertThrows(
            ForbiddenDisciplineActionException.class,
            () -> disciplineService.deleteDisciplineById(1));

    assertTrue(ex.getMessage().contains("Discipline discipline 'Other' is not allowed."));
    verify(disciplineRepository, never()).delete(any());
  }

  @Test
  void editDiscipline_ifDisciplineIsOther_throwsException() {
    Discipline other = new Discipline(1, Constants.DISCIPLINE_OTHER);

    when(disciplineRepository.findById(1)).thenReturn(Optional.of(other));

    ForbiddenDisciplineActionException ex =
        assertThrows(
            ForbiddenDisciplineActionException.class,
            () -> disciplineService.editDiscipline(1, "Updated Name"));

    assertTrue(ex.getMessage().contains("Editing discipline 'Other' is not allowed."));
    verify(disciplineRepository, never()).save(any());
  }

  @Test
  void editDiscipline_successfullyUpdatesDiscipline() {
    Discipline original = new Discipline(1, "Old Name");

    when(disciplineRepository.findById(1)).thenReturn(Optional.of(original));
    when(disciplineRepository.save(any(Discipline.class))).thenAnswer(inv -> inv.getArgument(0));

    Discipline updated = disciplineService.editDiscipline(1, "New Name");

    assertEquals("New Name", updated.getName());
    verify(disciplineRepository, times(1)).save(original);
  }
}
