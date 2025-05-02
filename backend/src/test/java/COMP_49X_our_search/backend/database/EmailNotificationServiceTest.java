package COMP_49X_our_search.backend.database;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import COMP_49X_our_search.backend.database.entities.EmailNotification;
import COMP_49X_our_search.backend.database.enums.EmailNotificationType;
import COMP_49X_our_search.backend.database.repositories.EmailNotificationRepository;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;

import COMP_49X_our_search.backend.database.services.EmailNotificationService;
import java.util.Set;
import java.util.stream.Collectors;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.core.io.Resource;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = {EmailNotificationService.class})
@ActiveProfiles("test")
public class EmailNotificationServiceTest {

    @Autowired
    private EmailNotificationService emailNotificationService;

    @MockBean
    private EmailNotificationRepository emailNotificationRepository;

    @MockBean
    private Resource emailNotificationsResource;

  @Test
  void testPopulateEmailNotifications_whenSomeNotificationsAreMissing() throws Exception {
    String json = """
            [
              {"id":0,"body":"Body1","subject":"Subject1","emailNotificationType":"STUDENTS"},
              {"id":0,"body":"Body2","subject":"Subject2","emailNotificationType":"FACULTY"},
              {"id":0,"body":"Body3","subject":"Subject3","emailNotificationType":"WEEKLY_POSTINGS_STUDENTS"}
            ]
        """;

    InputStream inputStream = new ByteArrayInputStream(json.getBytes());

    when(emailNotificationRepository.findAll()).thenReturn(List.of(
        new EmailNotification(1, "Body1", "Subject1", EmailNotificationType.STUDENTS)
    ));

    when(emailNotificationsResource.getInputStream()).thenReturn(inputStream);

    var field = EmailNotificationService.class.getDeclaredField("emailNotificationsResource");
    field.setAccessible(true);
    field.set(emailNotificationService, emailNotificationsResource);

    emailNotificationService.populateEmailNotifications();

    verify(emailNotificationRepository, times(1)).saveAll(argThat(list -> {
      List<EmailNotification> emailList = (List<EmailNotification>) list;
      Set<EmailNotificationType> types = emailList.stream()
          .map(EmailNotification::getEmailNotificationType)
          .collect(Collectors.toSet());
      return types.contains(EmailNotificationType.FACULTY)
          && types.contains(EmailNotificationType.WEEKLY_POSTINGS_STUDENTS)
          && types.size() == 2;
    }));
  }

  @Test
  void testPopulateEmailNotifications_whenAllNotificationsExist() {
    when(emailNotificationRepository.findAll()).thenReturn(List.of(
        new EmailNotification(1, "Body1", "Subject1", EmailNotificationType.STUDENTS),
        new EmailNotification(2, "Body2", "Subject2", EmailNotificationType.FACULTY),
        new EmailNotification(3, "Body3", "Subject3", EmailNotificationType.WEEKLY_POSTINGS_STUDENTS),
        new EmailNotification(4, "Body4", "Subject4", EmailNotificationType.WEEKLY_POSTINGS_FACULTY)
    ));

    emailNotificationService.populateEmailNotifications();

    verify(emailNotificationRepository, times(0)).saveAll(anyList());
  }

    @Test
    void testSaveEmailNotification() {
        EmailNotification notification = new EmailNotification();
        notification.setBody("Test body");
        notification.setSubject("Test subject");
        notification.setEmailNotificationType(EmailNotificationType.STUDENTS);

        EmailNotification savedNotification = new EmailNotification(1, "Test body", "Test subject", EmailNotificationType.STUDENTS);

        when(emailNotificationRepository.save(notification)).thenReturn(savedNotification);

        EmailNotification result = emailNotificationService.saveEmailNotification(notification);

        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("Test body", result.getBody());
        assertEquals("Test subject", result.getSubject());
        assertEquals(EmailNotificationType.STUDENTS, result.getEmailNotificationType());

        verify(emailNotificationRepository, times(1)).save(notification);
    }

    @Test
    void testGetAllEmailNotifications() {
        EmailNotification notification1 = new EmailNotification(1, "Body1", "Subject1", EmailNotificationType.STUDENTS);
        EmailNotification notification2 = new EmailNotification(2, "Body2", "Subject2", EmailNotificationType.FACULTY);
        List<EmailNotification> notifications = Arrays.asList(notification1, notification2);

        when(emailNotificationRepository.findAll()).thenReturn(notifications);

        List<EmailNotification> result = emailNotificationService.getAllEmailNotifications();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.contains(notification1));
        assertTrue(result.contains(notification2));

        // Account for the findAll() in the @PostConstruct method
        verify(emailNotificationRepository, times(2)).findAll();
    }
}
