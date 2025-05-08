package COMP_49X_our_search.backend.notifications;

import COMP_49X_our_search.backend.database.entities.EmailNotification;
import COMP_49X_our_search.backend.database.entities.Faculty;
import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.entities.Project;
import COMP_49X_our_search.backend.database.entities.Student;
import COMP_49X_our_search.backend.database.enums.EmailNotificationType;
import COMP_49X_our_search.backend.database.services.FacultyService;
import COMP_49X_our_search.backend.database.services.StudentService;
import COMP_49X_our_search.backend.database.entities.WeeklyNotificationSchedule;
import COMP_49X_our_search.backend.database.entities.YearlyNotificationSchedule;
import COMP_49X_our_search.backend.database.services.EmailNotificationService;
import COMP_49X_our_search.backend.database.services.WeeklyNotificationScheduleService;
import COMP_49X_our_search.backend.database.services.YearlyNotificationScheduleService;
import java.io.IOException;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class EmailNotificationScheduler {

  private final YearlyNotificationScheduleService yearlyService;
  private final WeeklyNotificationScheduleService weeklyService;
  private final EmailNotificationService emailNotificationService;
  private final SendGridService sendGridService;
  private final StudentService studentService;
  private final FacultyService facultyService;
  private final MatchBuilder matchBuilder;

  @Autowired
  public EmailNotificationScheduler(
      YearlyNotificationScheduleService yearlyService,
      WeeklyNotificationScheduleService weeklyService,
      EmailNotificationService emailNotificationService,
      SendGridService sendGridService,
      StudentService studentService,
      FacultyService facultyService,
      MatchBuilder matchBuilder) {
    this.yearlyService = yearlyService;
    this.weeklyService = weeklyService;
    this.emailNotificationService = emailNotificationService;
    this.sendGridService = sendGridService;
    this.studentService = studentService;
    this.facultyService = facultyService;
    this.matchBuilder = matchBuilder;
  }

  @Scheduled(cron = "0 0 8 * * ?") // Every day at 8:00AM
  public void sendNotifications() {
    LocalDateTime now = LocalDateTime.now();

    YearlyNotificationSchedule yearlySchedule = yearlyService.getSchedule();
    if (yearlySchedule != null
        && shouldSendYearlyNotification(yearlySchedule.getNotificationDateTime(), now)) {

      EmailNotification yearlyStudentTemplate =
          emailNotificationService.getEmailNotificationByType(EmailNotificationType.STUDENTS);
      EmailNotification yearlyFacultyTemplate =
          emailNotificationService.getEmailNotificationByType(EmailNotificationType.FACULTY);

      List<String> studentEmails =
          studentService.getAllStudents().stream().map(Student::getEmail).toList();
      List<String> facultyEmails =
          facultyService.getAllFaculty().stream().map(Faculty::getEmail).toList();

      for (String email : studentEmails) {
        try {
          sendGridService.sendEmail(
              email, yearlyStudentTemplate.getSubject(), yearlyStudentTemplate.getBody());
        } catch (IOException e) {
          System.err.println("Failed to send yearly email to " + email + ": " + e.getMessage());
        }
      }

      for (String email : facultyEmails) {
        try {
          sendGridService.sendEmail(
              email, yearlyFacultyTemplate.getSubject(), yearlyFacultyTemplate.getBody());
        } catch (IOException e) {
          System.err.println("Failed to send yearly email to " + email + ": " + e.getMessage());
        }
      }
    }

    WeeklyNotificationSchedule weeklySchedule = weeklyService.getSchedule();
    if (weeklySchedule != null
        && shouldSendWeeklyNotification(weeklySchedule.getNotificationDay(), now)) {

      EmailNotification studentWeeklyTemplate =
          emailNotificationService.getEmailNotificationByType(
              EmailNotificationType.WEEKLY_POSTINGS_STUDENTS);
      EmailNotification facultyWeeklyTemplate =
          emailNotificationService.getEmailNotificationByType(
              EmailNotificationType.WEEKLY_POSTINGS_FACULTY);

      Map<String, List<Project>> studentMatches = matchBuilder.buildStudentMatches();
      Map<String, List<Student>> facultyMatches = matchBuilder.buildFacultyMatches();

      for (Map.Entry<String, List<Project>> entry : studentMatches.entrySet()) {
        String studentEmail = entry.getKey();
        List<Project> projects = entry.getValue();
        StringBuilder emailBody = new StringBuilder(studentWeeklyTemplate.getBody());
        emailBody.append("\n\nHere are the new projects that match your interest:\n");
        for (Project project : projects) {
          emailBody
              .append("- ")
              .append(project.getName())
              .append(" (Faculty: ")
              .append(project.getFaculty().getFirstName())
              .append(" ")
              .append(project.getFaculty().getLastName())
              .append(")\n");
        }
        emailBody.append("\nBest regards.\nThe OUR SEARCH Team");
        try {
          sendGridService.sendEmail(
              studentEmail, studentWeeklyTemplate.getSubject(), emailBody.toString());
        } catch (IOException e) {
          System.err.println(
              "Failed to send weekly email to " + studentEmail + ": " + e.getMessage());
        }
      }

      for (Map.Entry<String, List<Student>> entry : facultyMatches.entrySet()) {
        String facultyEmail = entry.getKey();
        List<Student> students = entry.getValue();
        StringBuilder emailBody = new StringBuilder(facultyWeeklyTemplate.getBody());
        emailBody.append("\n\nHere are the new students who match your research interests:\n");
        for (Student student : students) {
          String interests =
              student.getResearchFieldInterests().stream()
                  .map(Major::getName)
                  .collect(Collectors.joining(", "));
          emailBody
              .append("- ")
              .append(student.getFirstName())
              .append(" ")
              .append(student.getLastName())
              .append(" (Interests: ")
              .append(interests)
              .append(")\n");
        }
        emailBody.append("\nBest regards,\nThe OUR SEARCH Team");
        try {
          sendGridService.sendEmail(
              facultyEmail, facultyWeeklyTemplate.getSubject(), emailBody.toString());
        } catch (IOException e) {
          System.err.println(
              "Failed to send weekly email to " + facultyEmail + ": " + e.getMessage());
        }
      }
    }
  }

  private boolean shouldSendYearlyNotification(LocalDateTime yearlyDateTime, LocalDateTime now) {
    return now.getMonth() == yearlyDateTime.getMonth()
         && now.getDayOfMonth() == yearlyDateTime.getDayOfMonth();
  }

  private boolean shouldSendWeeklyNotification(DayOfWeek weeklyDay, LocalDateTime now) {
    return now.getDayOfWeek() == weeklyDay;
  }
}
