/**
 * Service class for managing Faculty entities. This class provides business logic for retrieving
 * faculty data from the database through the FacultyRepository.
 *
 * <p>This service is annotated with @Service to indicate that it's managed by Spring.
 *
 * @author Augusto Escudero
 */
package COMP_49X_our_search.backend.database.services;

import COMP_49X_our_search.backend.database.entities.Faculty;
import COMP_49X_our_search.backend.database.repositories.FacultyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FacultyService {

  private final FacultyRepository facultyRepository;

  @Autowired
  public FacultyService(FacultyRepository facultyRepository) {
    this.facultyRepository = facultyRepository;
  }

  public boolean existsByEmail(String email) {
    return facultyRepository.existsByEmail(email);
  }

  public Faculty saveFaculty(Faculty faculty) {
    return facultyRepository.save(faculty);
  }

  public Faculty getFacultyByEmail(String email) {
    return facultyRepository
        .findFacultyByEmail(email)
        .orElseThrow(() -> new RuntimeException("Faculty not found with email: " + email));
  }

  public void deleteFacultyByEmail(String email) {
    if (!facultyRepository.existsByEmail(email)) {
      throw new RuntimeException(
          String.format("Cannot delete faculty with email '%s'. Faculty not found.", email));
    }
    facultyRepository.deleteByEmail(email);
  }
}
