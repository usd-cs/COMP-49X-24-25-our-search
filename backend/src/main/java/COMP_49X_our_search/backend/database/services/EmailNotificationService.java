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
import COMP_49X_our_search.backend.database.enums.EmailNotificationType;
import COMP_49X_our_search.backend.database.repositories.EmailNotificationRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmailNotificationService {

  private final EmailNotificationRepository emailNotificationRepository;

  @Value("classpath:email-notifications.json")
  private Resource emailNotificationsResource;

  @Autowired
  public EmailNotificationService(EmailNotificationRepository emailNotificationRepository) {
    this.emailNotificationRepository = emailNotificationRepository;
  }

  @PostConstruct
  public void populateEmailNotifications() {
    try (InputStream inputStream = emailNotificationsResource.getInputStream()) {
      ObjectMapper objectMapper = new ObjectMapper();
      List<EmailNotification> notificationsFromConfig =
          objectMapper.readValue(inputStream, new TypeReference<List<EmailNotification>>() {});

      Set<EmailNotificationType> existingTypes =
          emailNotificationRepository.findAll().stream()
              .map(EmailNotification::getEmailNotificationType)
              .collect(Collectors.toSet());

      List<EmailNotification> missingNotifications =
          notificationsFromConfig.stream()
              .filter(
                  notification -> !existingTypes.contains(notification.getEmailNotificationType()))
              .toList();

      if (!missingNotifications.isEmpty()) {
        emailNotificationRepository.saveAll(missingNotifications);
        System.out.println("Added missing email notifications: " + missingNotifications);
      } else {
        System.out.println("All email notifications already exist.");
      }
    } catch (IOException e) {
      System.err.println("Failed to load email notifications configuration: " + e.getMessage());
    }
  }

  public EmailNotification saveEmailNotification(EmailNotification emailNotification) {
    return emailNotificationRepository.save(emailNotification);
  }

  public List<EmailNotification> getAllEmailNotifications() {
    return emailNotificationRepository.findAll();
  }
}
