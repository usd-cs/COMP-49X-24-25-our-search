package COMP_49X_our_search.backend.database.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name= "yearly_notification_schedule")
public class YearlyNotificationSchedule {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(nullable = false)
  private LocalDateTime notificationDateTime;

  public YearlyNotificationSchedule() {}

  public YearlyNotificationSchedule(LocalDateTime notificationDateTime) {
    this.notificationDateTime = notificationDateTime;
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public LocalDateTime getNotificationDateTime() {
    return notificationDateTime;
  }

  public void setNotificationDateTime(LocalDateTime notificationDateTime) {
    this.notificationDateTime = notificationDateTime;
  }
}
