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
import org.springframework.boot.CommandLineRunner;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class EmailNotificationScheduler implements CommandLineRunner {

  private final YearlyNotificationScheduleService yearlyService;
  private final WeeklyNotificationScheduleService weeklyService;
  private final EmailNotificationService emailNotificationService;
  private final SendGridService sendGridService;
  private final StudentService studentService;
  private final FacultyService facultyService;
  private final MatchBuilder matchBuilder;
  private final String CLICK_HERE_ANCHOR = "<a href=\"https://oursearch.dedyn.io/\">click here</a>";

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

  @Override
  public void run(String... args) {
    sendNotifications();
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

        try {
          sendGridService.sendEmailWithBcc(
              studentEmails,
              yearlyStudentTemplate.getSubject(),
              yearlyStudentTemplate.getBody(),
              "text/plain"
              );
        } catch (IOException e) {
          System.err.println("Failed to send yearly email to students:" + e.getMessage());
        }

        try {
          sendGridService.sendEmailWithBcc(
              facultyEmails,
              yearlyFacultyTemplate.getSubject(),
              yearlyFacultyTemplate.getBody(),
              "text/plain");
        } catch (IOException e) {
          System.err.println("Failed to send yearly email to faculty:" + e.getMessage());
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

        List<String> interests =
            projects.stream()
                .flatMap(project -> project.getMajors().stream())
                .map(Major::getName)
                .distinct()
                .toList();

        String personalizedBody =
            studentWeeklyTemplate
                .getBody()
                .replace("{interests}", formatInterests(interests))
                .replace("{number_of_postings}", String.valueOf(projects.size()))
                .replace("{new_postings}", formatNewPostings(projects))
                .replace("{click_here}", CLICK_HERE_ANCHOR)
                .replace("\n", "<br>");
        try {
          sendGridService.sendEmailHtml(
              studentEmail, studentWeeklyTemplate.getSubject(), personalizedBody);
        } catch (IOException e) {
          System.err.println(
              "Failed to send weekly email to " + studentEmail + ": " + e.getMessage());
        }
      }

      for (Map.Entry<String, List<Student>> entry : facultyMatches.entrySet()) {
        String facultyEmail = entry.getKey();
        List<Student> students = entry.getValue();

        String htmlBody =
            facultyWeeklyTemplate
                .getBody()
                .replace("{number_of_students}", String.valueOf(students.size()))
                .replace("{new_students}", formatNewStudents(students))
                .replace("{click_here}", CLICK_HERE_ANCHOR)
                .replace("\n", "<br>");
        try {
          sendGridService.sendEmailHtml(facultyEmail, facultyWeeklyTemplate.getSubject(), htmlBody);
        } catch (IOException e) {
          System.err.println(
              "Failed to send weekly email to " + facultyEmail + ": " + e.getMessage());
        }
      }
    }
  }

  private boolean shouldSendYearlyNotification(LocalDateTime yearlyDateTime, LocalDateTime now) {
    return true;
    // return now.getMonth() == yearlyDateTime.getMonth()
    //    && now.getDayOfMonth() == yearlyDateTime.getDayOfMonth();
  }

  private boolean shouldSendWeeklyNotification(DayOfWeek weeklyDay, LocalDateTime now) {
    return true;
    // return now.getDayOfWeek() == weeklyDay;
  }

  /** Format interests as "Interest 1, Interest 2, ..., and Interest N" */
  private String formatInterests(List<String> interests) {
    if (interests.isEmpty()) return "";
    if (interests.size() == 1) return interests.get(0);
    return String.join(", ", interests.subList(0, interests.size() - 1))
        + ", and "
        + interests.get(interests.size() - 1);
  }

  private String formatNewPostings(List<Project> projects) {
    final String INDENT = "\t";
    return projects.stream()
        .map(
            project ->
                INDENT
                    + "• <strong>"
                    + project.getName()
                    + " – "
                    + project.getMajors().stream()
                        .map(Major::getName)
                        .collect(Collectors.joining(", "))
                    + "</strong>")
        .collect(Collectors.joining("\n"));
  }

  private String formatNewStudents(List<Student> students) {
    final String INDENT = "\t";
    return students.stream()
        .map(
            student ->
                INDENT
                    + "• <strong>"
                    + student.getFirstName()
                    + " "
                    + student.getLastName()
                    + " - "
                    + student.getResearchFieldInterests().stream()
                        .map(Major::getName)
                        .collect(Collectors.joining(", "))
                    + "</strong>")
        .collect(Collectors.joining("\n"));
  }
}
