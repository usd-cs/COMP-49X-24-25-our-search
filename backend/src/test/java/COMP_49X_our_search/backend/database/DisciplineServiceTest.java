package COMP_49X_our_search.backend.database;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import COMP_49X_our_search.backend.database.entities.Discipline;
import COMP_49X_our_search.backend.database.repositories.DisciplineRepository;
import COMP_49X_our_search.backend.database.services.DisciplineService;
import java.util.List;
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

  @Test
  void testGetAllDisciplines() {
    Discipline engineeringDiscipline = new Discipline("Engineering");
    Discipline lifeSciencesDiscipline = new Discipline("Life Sciences");

    Mockito.when(disciplineRepository.findAll(Sort.by(Sort.Direction.ASC, "name")))
        .thenReturn(List.of(engineeringDiscipline, lifeSciencesDiscipline));

    List<Discipline> disciplines = disciplineService.getAllDisciplines();

    assertEquals(2, disciplines.size());
    assertTrue(disciplines
        .containsAll(List.of(engineeringDiscipline, lifeSciencesDiscipline)));
  }
}
