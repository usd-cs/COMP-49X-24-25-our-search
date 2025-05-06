package COMP_49X_our_search.backend.notifications;

import COMP_49X_our_search.backend.database.entities.WeeklyNotificationSchedule;
import COMP_49X_our_search.backend.database.entities.YearlyNotificationSchedule;
import COMP_49X_our_search.backend.database.services.EmailNotificationService;
import COMP_49X_our_search.backend.database.services.WeeklyNotificationScheduleService;
import COMP_49X_our_search.backend.database.services.YearlyNotificationScheduleService;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class EmailNotificationScheduler {

  private final YearlyNotificationScheduleService yearlyService;
  private final WeeklyNotificationScheduleService weeklyService;
  private final EmailNotificationService emailNotificationService;

  @Autowired
  public EmailNotificationScheduler(
      YearlyNotificationScheduleService yearlyService,
      WeeklyNotificationScheduleService weeklyService,
      EmailNotificationService emailNotificationService) {
    this.yearlyService = yearlyService;
    this.weeklyService = weeklyService;
    this.emailNotificationService = emailNotificationService;
  }

  @Scheduled(cron = "0 0 0 * * ?") // Every day at midnight
  public void sendNotifications() {
    LocalDateTime now = LocalDateTime.now();

    YearlyNotificationSchedule yearlySchedule = yearlyService.getSchedule();
    if (yearlySchedule != null
        && shouldSendYearlyNotification(yearlySchedule.getNotificationDateTime(), now)) {
      // code to handle yearly email notifications
    }

    WeeklyNotificationSchedule weeklySchedule = weeklyService.getSchedule();
    if (weeklySchedule != null
        && shouldSendWeeklyNotification(weeklySchedule.getNotificationDay(), now)) {
      // code to handle weekly email notifications.
    }
  }

  private boolean shouldSendYearlyNotification(LocalDateTime yearlyDateTime, LocalDateTime now) {
    return now.getMonth() == yearlyDateTime.getMonth()
        && now.getDayOfMonth() == yearlyDateTime.getDayOfMonth()
        && now.getHour() == yearlyDateTime.getHour()
        && now.getMinute() == yearlyDateTime.getMinute();
  }

  private boolean shouldSendWeeklyNotification(DayOfWeek weeklyDay, LocalDateTime now) {
    return now.getDayOfWeek() == weeklyDay;
  }
}
