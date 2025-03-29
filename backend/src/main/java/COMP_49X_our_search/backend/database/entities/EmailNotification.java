package COMP_49X_our_search.backend.database.entities;

import COMP_49X_our_search.backend.database.enums.EmailNotificationType;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "email_notifications")
public class EmailNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String body;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String subject;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private EmailNotificationType emailNotificationType;

    public EmailNotification() {}

    public EmailNotification(
            Integer id,
            String body,
            String subject,
            EmailNotificationType emailNotificationType) {
        this.id = id;
        this.body = body;
        this.subject = subject;
        this.emailNotificationType = emailNotificationType;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public EmailNotificationType getEmailNotificationType() {
        return emailNotificationType;
    }

    public void setEmailNotificationType(EmailNotificationType emailNotificationType) {
        this.emailNotificationType = emailNotificationType;
    }
}
