/**
 * Integration test for the DepartmentService methods using real data.
 * This test loads the application context to ensure Spring Data repositories
 * and the service are correctly initialized in the test environment.
 *
 * Verifies the actual sorting logic by interacting with a real database,
 * providing a more realistic scenario than unit tests, which rely on mocked values.
 * We know this because we directly use @Autowired to use dependency injection for real
 * services that handle database transactions, rather than mocks through @MockBean used in unit tests.
 */

package COMP_49X_our_search.backend.database;

import static org.junit.jupiter.api.Assertions.assertEquals;

import COMP_49X_our_search.backend.database.entities.Department;
import COMP_49X_our_search.backend.database.repositories.DepartmentRepository;
import COMP_49X_our_search.backend.database.services.DepartmentService;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@ActiveProfiles("test") // Activates the "test" profile
@Transactional
public class DepartmentServiceIntegrationTest {
    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private DepartmentService departmentService;

    @BeforeEach
    void setUp() {
        // Clear existing data and insert test data
        departmentRepository.deleteAll();

        departmentRepository.save(new Department("Life Sciences"));
        departmentRepository.save(new Department("Engineering A"));
        departmentRepository.save(new Department("Engineering B"));
    }

    @Test
    void testGetAllDepartments_returnsSortedAscending() {
        List<Department> departments = departmentService.getAllDepartments();

        assertEquals(3, departments.size());

        // E comes before L, A comes before B
        assertEquals("Engineering A", departments.get(0).getName());
        assertEquals("Engineering B", departments.get(1).getName());
        assertEquals("Life Sciences", departments.get(2).getName());
    }
}
