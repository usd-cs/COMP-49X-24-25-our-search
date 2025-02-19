package COMP_49X_our_search.backend.database.repositories;

import COMP_49X_our_search.backend.database.entities.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository
    extends JpaRepository<User, Integer> {
  Optional<User> findByEmail(String email);
}
