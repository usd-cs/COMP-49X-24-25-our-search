package COMP_49X_our_search.backend.gateway.dto;

public class EmailNotificationDTO {

    private String type;
    private String subject;
    private String body;

    public EmailNotificationDTO() {}

    public EmailNotificationDTO(String type, String subject, String body) {
        this.type = type;
        this.subject = subject;
        this.body = body;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }
}
