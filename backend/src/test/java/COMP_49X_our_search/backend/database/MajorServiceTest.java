package COMP_49X_our_search.backend.database;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import COMP_49X_our_search.backend.database.entities.Discipline;
import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.repositories.MajorRepository;
import COMP_49X_our_search.backend.database.services.MajorService;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Sort;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = {MajorService.class})
@ActiveProfiles("test")
public class MajorServiceTest {

  @Autowired
  private MajorService majorService;

  @MockBean
  private MajorRepository majorRepository;

  private Discipline engineeringDiscipline;

  @BeforeEach
  public void setUp() {
    engineeringDiscipline = new Discipline("Engineering");
  }

  @Test
  void testGetAllMajors() {
    Major csMajor = new Major("Computer Science", Set.of(engineeringDiscipline),
        null, null);
    Major mathMajor =
        new Major("Mathematics", Set.of(engineeringDiscipline), null, null);

    Mockito.when(majorRepository.findAll(Sort.by(Sort.Direction.ASC, "name")))
        .thenReturn((List.of(csMajor, mathMajor)));

    List<Major> majors = majorService.getAllMajors();

    assertEquals(2, majors.size());
    assertTrue(majors.containsAll(List.of(csMajor, mathMajor)));
  }

  @Test
  void testGetMajorsByDisciplineId() {
    int disciplineId = 1;
    Major csMajor = new Major("Computer Science", Set.of(engineeringDiscipline), null, null);
    Major mechanicalMajor = new Major("Mechanical Engineering", Set.of(engineeringDiscipline), null, null);

    Mockito.when(majorRepository.findAllByDisciplines_Id(disciplineId))
        .thenReturn(List.of(csMajor, mechanicalMajor));

    List<Major> majors = majorService.getMajorsByDisciplineId(disciplineId);

    assertEquals(2, majors.size());
    assertTrue(majors.containsAll(List.of(csMajor, mechanicalMajor)));
  }

  @Test
  void testGetMajorByName_Found() {
    String majorName = "Computer Science";
    Major csMajor = new Major(majorName, Set.of(engineeringDiscipline), null, null);

    Mockito.when(majorRepository.findMajorByName(majorName))
        .thenReturn(Optional.of(csMajor));

    Optional<Major> major = majorService.getMajorByName(majorName);

    assertTrue(major.isPresent());
    assertEquals(majorName, major.get().getName());
  }

  @Test
  void testGetMajorByName_NotFound() {
    String majorName = "Astronomy";

    Mockito.when(majorRepository.findMajorByName(majorName))
        .thenReturn(Optional.empty());

    Optional<Major> major = majorService.getMajorByName(majorName);

    assertTrue(major.isEmpty());
  }
}
