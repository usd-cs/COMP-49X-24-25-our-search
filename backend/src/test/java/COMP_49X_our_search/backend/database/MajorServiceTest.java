package COMP_49X_our_search.backend.database;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import COMP_49X_our_search.backend.database.entities.Department;
import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.repositories.MajorRepository;
import COMP_49X_our_search.backend.database.services.MajorService;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
public class MajorServiceTest {

  @Autowired private MajorService majorService;

  @MockBean private MajorRepository majorRepository;

  @Test
  void testGetAllMajors() {
    Department engineeringDepartment = new Department("Engineering");
    Major csMajor = new Major("Computer Science",
                              Set.of(engineeringDepartment), null, null);
    Major mathMajor = new Major("Mathematics", Set.of(engineeringDepartment), null, null);

    Mockito.when(majorRepository.findAll()).thenReturn((List.of(csMajor, mathMajor)));

    List<Major> majors = majorService.getAllMajors();

    assertEquals(2, majors.size());
    assertTrue(majors.containsAll(List.of(csMajor, mathMajor)));
  }
}
