package COMP_49X_our_search.backend.database;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import COMP_49X_our_search.backend.database.entities.EmailNotification;
import COMP_49X_our_search.backend.database.enums.EmailNotificationType;
import COMP_49X_our_search.backend.database.repositories.EmailNotificationRepository;
import java.util.Arrays;
import java.util.List;

import COMP_49X_our_search.backend.database.services.EmailNotificationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = {EmailNotificationService.class})
@ActiveProfiles("test")
public class EmailNotificationServiceTest {

    @Autowired
    private EmailNotificationService emailNotificationService;

    @MockBean
    private EmailNotificationRepository emailNotificationRepository;

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

        verify(emailNotificationRepository, times(1)).findAll();
    }
}
