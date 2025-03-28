package COMP_49X_our_search.backend.database;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import COMP_49X_our_search.backend.database.entities.Department;
import COMP_49X_our_search.backend.database.entities.Faculty;
import COMP_49X_our_search.backend.database.repositories.DepartmentRepository;
import COMP_49X_our_search.backend.database.services.DepartmentService;
import COMP_49X_our_search.backend.database.services.FacultyService;
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

@SpringBootTest(classes = {DepartmentService.class})
@ActiveProfiles("test")
public class DepartmentServiceTest {

  @Autowired private DepartmentService departmentService;

  @MockBean private DepartmentRepository departmentRepository;
  @MockBean private FacultyService facultyService;

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

    Department department = new Department();
    department.setId(deptId);

    Faculty faculty1 = new Faculty();
    faculty1.setId(101);
    Faculty faculty2 = new Faculty();
    faculty2.setId(102);

    Set<Department> departments1 = new HashSet<>();
    departments1.add(department);
    faculty1.setDepartments(departments1);

    Set<Department> departments2 = new HashSet<>();
    departments2.add(department);
    faculty2.setDepartments(departments2);

    Mockito.when(departmentRepository.existsById(deptId)).thenReturn(true);
    Mockito.when(facultyService.getFacultyByDepartmentId(deptId))
        .thenReturn(List.of(faculty1, faculty2));
    Mockito.doNothing().when(departmentRepository).deleteById(deptId);

    departmentService.deleteByDepartmentId(deptId);

    Mockito.verify(facultyService).getFacultyByDepartmentId(deptId);
    Mockito.verify(facultyService).saveFaculty(faculty1);
    Mockito.verify(facultyService).saveFaculty(faculty2);
    Mockito.verify(departmentRepository).deleteById(deptId);

    assertTrue(faculty1.getDepartments().isEmpty());
    assertTrue(faculty2.getDepartments().isEmpty());
  }

  @Test
  void testDeleteByDepartmentId_throwsExceptionIfNotFound() {
    int deptId = 999;

    Mockito.when(departmentRepository.existsById(deptId)).thenReturn(false);

    RuntimeException exception =
        org.junit.jupiter.api.Assertions.assertThrows(
            RuntimeException.class, () -> departmentService.deleteByDepartmentId(deptId));

    assertEquals("Cannot delete department with id 999. Department not found", exception.getMessage());
    Mockito.verify(departmentRepository, Mockito.never()).deleteById(deptId);
  }

  @Test
  void testGetDepartmentById_whenExists() {
    Department dept = new Department();
    dept.setId(1);
    dept.setName("Computer Science");

    when(departmentRepository.findById(1)).thenReturn(Optional.of(dept));

    Department result = departmentService.getDepartmentById(1);

    assertNotNull(result);
    assertEquals(1, result.getId());
    assertEquals("Computer Science", result.getName());
  }

  @Test
  void testGetDepartmentById_whenNotExists() {
    when(departmentRepository.findById(1)).thenReturn(Optional.empty());

    Exception exception = assertThrows(RuntimeException.class, () -> {
      departmentService.getDepartmentById(1);
    });
    String expectedMessage = "Department not found with id: 1";
    assertTrue(exception.getMessage().contains(expectedMessage));
  }

  @Test
  void testSaveDepartment() {
    Department dept = new Department();
    dept.setId(1);
    dept.setName("Mathematics");

    when(departmentRepository.save(dept)).thenReturn(dept);

    Department result = departmentService.saveDepartment(dept);

    assertNotNull(result);
    assertEquals(1, result.getId());
    assertEquals("Mathematics", result.getName());
  }

}
