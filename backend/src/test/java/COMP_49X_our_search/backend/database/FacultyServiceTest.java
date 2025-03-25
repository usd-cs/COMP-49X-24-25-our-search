package COMP_49X_our_search.backend.database;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import COMP_49X_our_search.backend.database.entities.Faculty;
import COMP_49X_our_search.backend.database.repositories.FacultyRepository;
import COMP_49X_our_search.backend.database.services.FacultyService;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = {FacultyService.class})
@ActiveProfiles("test")
public class FacultyServiceTest {

  @Autowired private FacultyService facultyService;
  @MockBean private FacultyRepository facultyRepository;
  private Faculty faculty;

  @BeforeEach
  void setUp() {
    faculty = new Faculty();
    faculty.setFirstName("First");
    faculty.setLastName("Last");
    faculty.setEmail("flast@test.com");
  }

  @Test
  void testExistsByEmail_existingFaculty_returnsTrue() {
    when(facultyRepository.existsByEmail(faculty.getEmail())).thenReturn(true);

    boolean exists = facultyService.existsByEmail(faculty.getEmail());

    assertTrue(exists);
    verify(facultyRepository, times(1)).existsByEmail(faculty.getEmail());
  }

  @Test
  void testExistsByEmail_nonExistingFaculty_returnsFalse() {
    when(facultyRepository.existsByEmail("nonexistent@test.com")).thenReturn(false);

    boolean exists = facultyService.existsByEmail("nonexistent@test.com");

    assertFalse(exists);
    verify(facultyRepository, times(1)).existsByEmail("nonexistent@test.com");
  }

  @Test
  void testSaveFaculty_returnsSavedFaculty() {
    when(facultyRepository.save(any(Faculty.class))).thenReturn(faculty);

    Faculty savedFaculty = facultyService.saveFaculty(faculty);

    assertNotNull(savedFaculty);
    assertEquals(faculty.getEmail(), savedFaculty.getEmail());
    assertEquals(faculty.getFirstName(), savedFaculty.getFirstName());
    assertEquals(faculty.getLastName(), savedFaculty.getLastName());

    verify(facultyRepository, times(1)).save(faculty);
  }

  @Test
  void testGetFacultyByEmail_existingFaculty_returnsFaculty() {
    when(facultyRepository.findFacultyByEmail(faculty.getEmail())).thenReturn(Optional.of(faculty));

    Faculty retrievedFaculty = facultyService.getFacultyByEmail(faculty.getEmail());

    assertNotNull(retrievedFaculty);
    assertEquals(faculty.getEmail(), retrievedFaculty.getEmail());

    verify(facultyRepository, times(1)).findFacultyByEmail(faculty.getEmail());
  }

  @Test
  void testGetFacultyByEmail_nonExistingFaculty_throwsException() {
    String nonExistingEmail = "nonexistent@test.com";
    when(facultyRepository.findFacultyByEmail(nonExistingEmail)).thenReturn(Optional.empty());

    Exception exception =
        assertThrows(
            RuntimeException.class, () -> facultyService.getFacultyByEmail(nonExistingEmail));

    assertEquals("Faculty not found with email: " + nonExistingEmail, exception.getMessage());
    verify(facultyRepository, times(1)).findFacultyByEmail(nonExistingEmail);
  }

  @Test
  void testDeleteFacultyByEmail_existingFaculty_deletesSuccessfully() {
    String email = "faculty@test.com";

    when(facultyRepository.existsByEmail(email)).thenReturn(true);

    facultyService.deleteFacultyByEmail(email);

    verify(facultyRepository, times(1)).existsByEmail(email);
    verify(facultyRepository, times(1)).deleteByEmail(email);
  }

  @Test
  void testDeleteFacultyByEmail_nonExistingFaculty_throwsException() {
    String email = "nonexistent@test.com";

    when(facultyRepository.existsByEmail(email)).thenReturn(false);

    Exception exception =
        assertThrows(RuntimeException.class, () -> facultyService.deleteFacultyByEmail(email));

    assertEquals(
        "Cannot delete faculty with email 'nonexistent@test.com'. Faculty not found.",
        exception.getMessage());

    verify(facultyRepository, times(1)).existsByEmail(email);
    verify(facultyRepository, never()).deleteByEmail(email);
  }

  @Test
  void testGetFacultyByDepartmentId_returnsFacultyList() {
    Integer departmentId = 1;
    Faculty faculty1 = new Faculty();
    faculty1.setFirstName("John");
    faculty1.setLastName("Doe");
    faculty1.setEmail("jdoe@test.com");

    Faculty faculty2 = new Faculty();
    faculty2.setFirstName("Jane");
    faculty2.setLastName("Smith");
    faculty2.setEmail("jsmith@test.com");

    List<Faculty> expectedFacultyList = List.of(faculty1, faculty2);

    when(facultyRepository.findAllByDepartments_Id(departmentId)).thenReturn(expectedFacultyList);

    List<Faculty> result = facultyService.getFacultyByDepartmentId(departmentId);

    assertNotNull(result);
    assertEquals(2, result.size());
    assertEquals(expectedFacultyList, result);

    verify(facultyRepository, times(1)).findAllByDepartments_Id(departmentId);
  }
}
