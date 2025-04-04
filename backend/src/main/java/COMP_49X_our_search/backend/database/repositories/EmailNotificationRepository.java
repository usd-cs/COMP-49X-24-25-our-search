package COMP_49X_our_search.backend.database.repositories;

import COMP_49X_our_search.backend.database.entities.EmailNotification;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailNotificationRepository extends JpaRepository<EmailNotification, Integer> {

}