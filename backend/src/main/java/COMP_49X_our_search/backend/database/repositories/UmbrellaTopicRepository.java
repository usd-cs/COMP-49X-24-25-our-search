/**
 * Repository interface for managing UmbrellaTopic entities. This interface
 * provides methods for performing CRUD operations on the "umbrella_topics"
 * table.
 *
 * It extends JpaRepository to use built-in database operations.
 *
 * @author Augusto Escudero
 */
package COMP_49X_our_search.backend.database.repositories;

import COMP_49X_our_search.backend.database.entities.UmbrellaTopic;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UmbrellaTopicRepository
    extends JpaRepository<UmbrellaTopic, Integer> {
  Optional<UmbrellaTopic> findUmbrellaTopicByName(String name);
}
