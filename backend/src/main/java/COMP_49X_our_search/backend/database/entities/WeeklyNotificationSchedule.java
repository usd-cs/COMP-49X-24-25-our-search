package COMP_49X_our_search.backend.database.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.DayOfWeek;

@Entity
@Table(name = "weekly_notification_schedule")
public class WeeklyNotificationSchedule {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private DayOfWeek notificationDay;

  public WeeklyNotificationSchedule() {}

  public WeeklyNotificationSchedule(DayOfWeek notificationDay) {
    this.notificationDay = notificationDay;
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public DayOfWeek getNotificationDay() {
    return notificationDay;
  }

  public void setNotificationDay(DayOfWeek notificationDay) {
    this.notificationDay = notificationDay;
  }
}
