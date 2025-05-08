package COMP_49X_our_search.backend.gateway.dto;

public class EmailNotificationTimeDTO {
  private String notificationDateTime;

  public EmailNotificationTimeDTO() {}

  public EmailNotificationTimeDTO(String notificationDateTime) {
    this.notificationDateTime = notificationDateTime;
  }

  public String getNotificationDateTime() {
    return notificationDateTime;
  }

  public void setNotificationDateTime(String notificationDateTime) {
    this.notificationDateTime = notificationDateTime;
  }
}
