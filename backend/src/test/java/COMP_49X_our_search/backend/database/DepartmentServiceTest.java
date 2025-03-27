package COMP_49X_our_search.backend.database;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import COMP_49X_our_search.backend.database.entities.Department;
import COMP_49X_our_search.backend.database.repositories.DepartmentRepository;
import COMP_49X_our_search.backend.database.services.DepartmentService;
import java.util.List;
import java.util.Optional;
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

  @Autowired private DepartmentService departmentService;

  @MockBean private DepartmentRepository departmentRepository;

  @Test
  void testGetAllDepartments_returnsCorrectSize() {
    Department engineeringDepartment = new Department("Engineering");
    Department lifeSciencesDepartment = new Department("Life Sciences");

    Mockito.when(departmentRepository.findAll(Sort.by(Sort.Direction.ASC, "name")))
        .thenReturn(List.of(engineeringDepartment, lifeSciencesDepartment));

    List<Department> departments = departmentService.getAllDepartments();

    assertEquals(2, departments.size());
    assertTrue(departments.containsAll(List.of(engineeringDepartment, lifeSciencesDepartment)));
  }

  @Test
  void testGetDepartmentByName_returnsCorrectDepartment() {
    Department csDepartment = new Department("Computer Science");

    Mockito.when(departmentRepository.findDepartmentByName("Computer Science"))
        .thenReturn(Optional.of(csDepartment));

    Optional<Department> result = departmentService.getDepartmentByName("Computer Science");

    assertTrue(result.isPresent());
    assertEquals("Computer Science", result.get().getName());
  }

  @Test
  void testGetDepartmentByName_returnsEmptyOptionalIfNotFound() {
    Mockito.when(departmentRepository.findDepartmentByName("Nonexistent"))
        .thenReturn(Optional.empty());

    Optional<Department> result = departmentService.getDepartmentByName("Nonexistent");

    assertTrue(result.isEmpty());
  }

  @Test
  void testDeleteByDepartmentId_deletesSuccessfullyIfExists() {
    int deptId = 1;

    Mockito.when(departmentRepository.existsById(deptId)).thenReturn(true);
    Mockito.doNothing().when(departmentRepository).deleteById(deptId);

    departmentService.deleteByDepartmentId(deptId);

    Mockito.verify(departmentRepository).deleteById(deptId);
  }

  @Test
  void testDeleteByDepartmentId_throwsExceptionIfNotFound() {
    int deptId = 999;

    Mockito.when(departmentRepository.existsById(deptId)).thenReturn(false);

    RuntimeException exception =
        org.junit.jupiter.api.Assertions.assertThrows(
            RuntimeException.class, () -> departmentService.deleteByDepartmentId(deptId));

    assertEquals("Cannot delete faculty with id 999. Faculty not found", exception.getMessage());
    Mockito.verify(departmentRepository, Mockito.never()).deleteById(deptId);
  }
}
