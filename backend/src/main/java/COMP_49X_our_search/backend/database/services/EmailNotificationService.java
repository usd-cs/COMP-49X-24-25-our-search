/**
 * Service class for managing User entities. This class provides business logic for retrieving user
 * data from the database through the UserRepository.
 *
 * <p>This service is annotated with @Service to indicate that it's managed by Spring.
 *
 * @author Augusto Escudero
 * @author Eduardo Perez Rocha
 */
package COMP_49X_our_search.backend.database.services;


import COMP_49X_our_search.backend.database.entities.EmailNotification;
import COMP_49X_our_search.backend.database.repositories.EmailNotificationRepository;
import jakarta.validation.constraints.Email;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmailNotificationService {

    private final EmailNotificationRepository emailNotificationRepository;

    @Autowired
    public EmailNotificationService(EmailNotificationRepository emailNotificationRepository) {
        this.emailNotificationRepository = emailNotificationRepository;
    }

    public EmailNotification saveEmailNotification(EmailNotification emailNotification) {
        return emailNotificationRepository.save(emailNotification);
    }

    public List<EmailNotification> getAllEmailNotifications() {
        return emailNotificationRepository.findAll();
    }
}
