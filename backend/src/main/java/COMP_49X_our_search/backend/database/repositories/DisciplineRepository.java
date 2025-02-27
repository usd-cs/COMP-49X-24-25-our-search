/**
 * Repository interface for managing Discipline entities. This interface
 * provides methods for performing CRUD operations on the "disciplines" table.
 *
 * It extends JpaRepository to use built-in database operations.
 *
 * @author Augusto Escudero
 */
package COMP_49X_our_search.backend.database.repositories;

import COMP_49X_our_search.backend.database.entities.Discipline;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DisciplineRepository
    extends JpaRepository<Discipline, Integer> {
}
