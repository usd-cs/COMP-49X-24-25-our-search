package COMP_49X_our_search.backend.database;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import COMP_49X_our_search.backend.database.entities.Department;
import COMP_49X_our_search.backend.database.repositories.DepartmentRepository;
import COMP_49X_our_search.backend.database.services.DepartmentService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Sort;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = {DepartmentService.class})
@ActiveProfiles("test")
public class DepartmentServiceTest {

  @Autowired
  private DepartmentService departmentService;

  @MockBean
  private DepartmentRepository departmentRepository;

  @Test
  void testGetAllDepartments_returnsCorrectSize() {
    Department engineeringDepartment = new Department("Engineering");
    Department lifeSciencesDepartment = new Department("Life Sciences");

    Mockito.when(departmentRepository.findAll(Sort.by(Sort.Direction.ASC, "name")))
            .thenReturn(List.of(engineeringDepartment, lifeSciencesDepartment));

    List<Department> departments = departmentService.getAllDepartments();

    assertEquals(2, departments.size());
    assertTrue(departments
        .containsAll(List.of(engineeringDepartment, lifeSciencesDepartment)));
  }
}
