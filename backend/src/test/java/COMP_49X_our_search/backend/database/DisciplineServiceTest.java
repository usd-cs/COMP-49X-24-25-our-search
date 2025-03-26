package COMP_49X_our_search.backend.database;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import COMP_49X_our_search.backend.database.entities.Discipline;
import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.repositories.DisciplineRepository;
import COMP_49X_our_search.backend.database.repositories.MajorRepository;
import COMP_49X_our_search.backend.database.services.DisciplineService;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
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
    discipline.setMajors(majors);

    when(disciplineRepository.findById(disciplineId)).thenReturn(Optional.of(discipline));
    doNothing().when(disciplineRepository).deleteById(disciplineId);

    disciplineService.deleteDisciplineById(disciplineId);

    verify(disciplineRepository, times(1)).findById(disciplineId);
    verify(majorRepository, times(1)).save(major1);
    verify(majorRepository, times(1)).save(major2);
    verify(disciplineRepository, times(1)).save(discipline);
    verify(disciplineRepository, times(1)).deleteById(disciplineId);
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
    verify(disciplineRepository, never()).deleteById(anyInt());
    verify(majorRepository, never()).save(any(Major.class));
  }

  @Test
  void deleteDisciplineById_disciplineHasNoMajors_deleteSuccessfully() {
    int disciplineId = 1;
    Discipline discipline = new Discipline(disciplineId, "Engineering");
    discipline.setMajors(new HashSet<>());

    when(disciplineRepository.findById(disciplineId)).thenReturn(Optional.of(discipline));
    doNothing().when(disciplineRepository).deleteById(disciplineId);

    disciplineService.deleteDisciplineById(disciplineId);

    verify(disciplineRepository, times(1)).findById(disciplineId);
    verify(disciplineRepository, times(1)).save(discipline);
    verify(disciplineRepository, times(1)).deleteById(disciplineId);
    verify(majorRepository, never()).save(any(Major.class)); // No majors should be saved
  }
}
