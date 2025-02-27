/**
 * Repository interface for managing Department entities. This interface
 * provides methods for performing CRUD operations on the "departments" table.
 *
 * It extends JpaRepository to use built-in database operations.
 *
 * @author Augusto Escudero
 */
package COMP_49X_our_search.backend.database.repositories;

import COMP_49X_our_search.backend.database.entities.Department;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository
    extends JpaRepository<Department, Integer> {
  Optional<Department> findDepartmentByName(String name);
}
