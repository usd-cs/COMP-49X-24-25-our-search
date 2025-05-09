/**
 * Integration test for the MajorService methods using real data.
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

import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.repositories.MajorRepository;
import java.util.List;

import COMP_49X_our_search.backend.database.services.MajorService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@ActiveProfiles("test") // Activates the "test" profile
@Transactional
@TestPropertySource(properties = {
        "DOMAIN=http://localhost"
})
public class MajorServiceIntegrationTest {
    @Autowired
    private MajorService majorService;

    @Autowired
    private MajorRepository majorRepository;

    @BeforeEach
    void setUp() {
        // Clear existing data and insert test data
        majorRepository.deleteAll();

        majorRepository.save(new Major("Computer Science"));
        majorRepository.save(new Major("Biology"));
        majorRepository.save(new Major("History"));
    }

    @Test
    void testGetAllDepartments_returnsSortedAscending() {
        List<Major> majors = majorService.getAllMajors();

        assertEquals(3, majors.size());

        // B comes before C, which comes before H
        assertEquals("Biology", majors.get(0).getName());
        assertEquals("Computer Science", majors.get(1).getName());
        assertEquals("History", majors.get(2).getName());
    }
}
