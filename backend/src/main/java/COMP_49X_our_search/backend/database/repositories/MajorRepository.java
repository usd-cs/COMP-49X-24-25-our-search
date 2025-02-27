/**
 * Repository interface for managing Major entities. This interface
 * provides methods for performing CRUD operations on the "majors" table.
 *
 * It extends JpaRepository to use built-in database operations.
 *
 * @author Augusto Escudero
 */
package COMP_49X_our_search.backend.database.repositories;

import COMP_49X_our_search.backend.database.entities.Major;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MajorRepository extends JpaRepository<Major, Integer> {
  List<Major> findAllByDisciplines_Id(Integer disciplineId);
  Optional<Major> findMajorByName(String name);
}
