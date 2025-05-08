/**
 * Repository interface for managing User entities. This interface
 * provides methods for performing CRUD operations on the "users" table.
 *
 * It extends JpaRepository to use built-in database operations.
 *
 * @author Augusto Escudero
 */
package COMP_49X_our_search.backend.database.repositories;

import COMP_49X_our_search.backend.database.entities.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository
    extends JpaRepository<User, Integer> {
  Optional<User> findByEmail(String email);
  Optional<User> findById(int id);
  void deleteByEmail(String email);
  void deleteById(int id);
  @Query("SELECT u FROM User u WHERE u.createdAt >= :createdAfter")
  List<User> findUsersCreatedAfter(@Param("createdAfter") LocalDateTime createdAfter);
}
