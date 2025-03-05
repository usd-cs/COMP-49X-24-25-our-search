/**
 * Repository interface for managing Faculty entities. This interface
 * provides methods for performing CRUD operations on the "faculty" table.
 *
 * It extends JpaRepository to use built-in database operations.
 *
 * @author Augusto Escudero
 */
package COMP_49X_our_search.backend.database.repositories;

import COMP_49X_our_search.backend.database.entities.Faculty;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FacultyRepository extends JpaRepository<Faculty, Integer> {
  boolean existsByEmail(String email);
  Optional<Faculty> findFacultyByEmail(String email);
}
