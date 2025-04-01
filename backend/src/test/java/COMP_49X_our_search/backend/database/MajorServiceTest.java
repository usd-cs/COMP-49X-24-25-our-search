package COMP_49X_our_search.backend.database;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import COMP_49X_our_search.backend.database.entities.Discipline;
import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.entities.Project;
import COMP_49X_our_search.backend.database.entities.Student;
import COMP_49X_our_search.backend.database.repositories.MajorRepository;
import COMP_49X_our_search.backend.database.services.MajorService;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Sort;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = {MajorService.class})
@ActiveProfiles("test")
public class MajorServiceTest {

  @Autowired private MajorService majorService;

  @MockBean private MajorRepository majorRepository;

  private Discipline engineeringDiscipline;

  @BeforeEach
  public void setUp() {
    engineeringDiscipline = new Discipline("Engineering");
  }

  @Test
  void testGetAllMajors() {
    Major csMajor = new Major("Computer Science", Set.of(engineeringDiscipline), null, null);
    Major mathMajor = new Major("Mathematics", Set.of(engineeringDiscipline), null, null);

    when(majorRepository.findAll(Sort.by(Sort.Direction.ASC, "name")))
        .thenReturn((List.of(csMajor, mathMajor)));

    List<Major> majors = majorService.getAllMajors();

    assertEquals(2, majors.size());
    assertTrue(majors.containsAll(List.of(csMajor, mathMajor)));
  }

  @Test
  void testGetMajorsByDisciplineId() {
    int disciplineId = 1;
    Major csMajor = new Major("Computer Science", Set.of(engineeringDiscipline), null, null);
    Major mechanicalMajor =
        new Major("Mechanical Engineering", Set.of(engineeringDiscipline), null, null);

    when(majorRepository.findAllByDisciplines_Id(disciplineId))
        .thenReturn(List.of(csMajor, mechanicalMajor));

    List<Major> majors = majorService.getMajorsByDisciplineId(disciplineId);

    assertEquals(2, majors.size());
    assertTrue(majors.containsAll(List.of(csMajor, mechanicalMajor)));
  }

  @Test
  void testGetMajorByName_Found() {
    String majorName = "Computer Science";
    Major csMajor = new Major(majorName, Set.of(engineeringDiscipline), null, null);

    when(majorRepository.findMajorByName(majorName)).thenReturn(Optional.of(csMajor));

    Optional<Major> major = majorService.getMajorByName(majorName);

    assertTrue(major.isPresent());
    assertEquals(majorName, major.get().getName());
  }

  @Test
  void testGetMajorByName_NotFound() {
    String majorName = "Astronomy";

    when(majorRepository.findMajorByName(majorName)).thenReturn(Optional.empty());

    Optional<Major> major = majorService.getMajorByName(majorName);

    assertTrue(major.isEmpty());
  }

  @Test
  void testGetMajorById() {
    Major computerScience = new Major();
    computerScience.setId(1);
    computerScience.setName("Computer Science");

    when(majorRepository.findById(1))
        .thenReturn(Optional.of(computerScience));

    Major dbMajor = majorService.getMajorById(1);

    assertEquals(computerScience.getName(), dbMajor.getName());
    assertEquals(computerScience.getId(), dbMajor.getId());
  }

  @Test
  void testSaveMajor() {
    Major computerScience = new Major();
    computerScience.setId(1);
    computerScience.setName("Computer Science");
    computerScience.setDisciplines(Set.of(new Discipline("Engineering")));

    when(majorRepository.save(any(Major.class))).thenReturn(computerScience);

    Major savedMajor = majorService.saveMajor(computerScience);

    assertEquals(computerScience.getId(), savedMajor.getId());
    assertEquals(computerScience.getName(), savedMajor.getName());
    assertEquals(computerScience.getDisciplines(), savedMajor.getDisciplines());

    verify(majorRepository, times(1)).save(computerScience);
  }

  @Test
  public void deleteMajorById_successfulDeletion() {
    Major major = new Major();
    major.setStudents(Set.of());
    major.setProjects(Set.of());

    when(majorRepository.findById(1)).thenReturn(Optional.of(major));

    assertDoesNotThrow(() -> majorService.deleteMajorById(1));
    verify(majorRepository, times(1)).delete(major);
  }

  @Test
  public void deleteMajorById_majorNotFound_throwsRuntimeException() {
    when(majorRepository.findById(1)).thenReturn(Optional.empty());

    RuntimeException exception = assertThrows(RuntimeException.class,
        () -> majorService.deleteMajorById(1));

    assertTrue(exception.getMessage().contains("Major not found"));
  }

  @Test
  public void deleteMajorById_majorHasStudents_throwsIllegalStateException() {
    Major major = new Major();
    Student student = new Student();
    major.setStudents(Set.of(student));
    major.setProjects(Set.of());

    when(majorRepository.findById(1)).thenReturn(Optional.of(major));

    IllegalStateException exception = assertThrows(IllegalStateException.class,
        () -> majorService.deleteMajorById(1));

    assertEquals("Major has students associated with it, cannot delete", exception.getMessage());
    verify(majorRepository, never()).delete(any());
  }

  @Test
  public void deleteMajorById_majorHasProjects_throwsIllegalStateException() {
    Major major = new Major();
    Project project = new Project();
    major.setStudents(Set.of());
    major.setProjects(Set.of(project));

    when(majorRepository.findById(1)).thenReturn(Optional.of(major));

    IllegalStateException exception = assertThrows(IllegalStateException.class,
        () -> majorService.deleteMajorById(1));

    assertEquals("Major has projects associated with it, cannot delete", exception.getMessage());
    verify(majorRepository, never()).delete(any());
  }

  @Test
  void testGetMajorsWithoutDisciplines() {
    Major major1 = new Major(1, "Computer Science");
    Major major2 = new Major(2, "Mathematics");
    List<Major> mockMajors = List.of(major1, major2);
    when(majorRepository.findAllMajorsWithoutDisciplines()).thenReturn(mockMajors);

    List<Major> result = majorService.getMajorsWithoutDisciplines();

    assertNotNull(result);
    assertEquals(2, result.size());
    assertEquals("Computer Science", result.get(0).getName());
    assertEquals("Mathematics", result.get(1).getName());
    verify(majorRepository, times(1)).findAllMajorsWithoutDisciplines();
  }
}
