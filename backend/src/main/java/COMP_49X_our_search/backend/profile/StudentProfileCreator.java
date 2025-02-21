package COMP_49X_our_search.backend.profile;

import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.entities.ResearchPeriod;
import COMP_49X_our_search.backend.database.entities.Student;
import COMP_49X_our_search.backend.database.entities.User;
import COMP_49X_our_search.backend.database.enums.UserRole;
import COMP_49X_our_search.backend.database.services.MajorService;
import COMP_49X_our_search.backend.database.services.ResearchPeriodService;
import COMP_49X_our_search.backend.database.services.StudentService;
import COMP_49X_our_search.backend.database.services.UserService;
import java.time.Year;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proto.data.Entities.StudentProto;
import proto.profile.ProfileModule.CreateProfileRequest;
import proto.profile.ProfileModule.CreateProfileResponse;

@Service
public class StudentProfileCreator implements ProfileCreator {

  private final StudentService studentService;
  private final MajorService majorService;
  private final ResearchPeriodService researchPeriodService;
  private final UserService userService;

  @Autowired
  public StudentProfileCreator(
      StudentService studentService,
      MajorService majorService,
      ResearchPeriodService researchPeriodService,
      UserService userService) {
    this.studentService = studentService;
    this.majorService = majorService;
    this.researchPeriodService = researchPeriodService;
    this.userService= userService;
  }

  @Override
  public CreateProfileResponse createProfile(CreateProfileRequest request) {
    validateRequest(request);
    validateStudentData(request.getStudentProfile());
    try {
      StudentProto studentProfile = request.getStudentProfile();

      if (studentService.existsByEmail(studentProfile.getEmail())) {
        throw new IllegalArgumentException("A student with this email already exists.");
      }

      Student dbStudent = new Student();
      dbStudent.setFirstName(studentProfile.getFirstName());
      dbStudent.setLastName(studentProfile.getLastName());
      dbStudent.setEmail(studentProfile.getEmail());
      dbStudent.setGraduationYear(studentProfile.getGraduationYear());
      Set<Major> majorEntities =
          studentProfile.getMajorsList().stream()
              .map(
                  majorName ->
                      majorService
                          .getMajorByName(majorName)
                          .orElseThrow(
                              () -> new IllegalArgumentException("Major not found: " + majorName)))
              .collect(Collectors.toSet());
      dbStudent.setMajors(majorEntities);
      Set<Major> researchFieldInterests =
          studentProfile.getResearchFieldInterestsList().stream()
              .map(
                  researchFieldName ->
                      majorService
                          .getMajorByName(researchFieldName)
                          .orElseThrow(
                              () -> new IllegalArgumentException("Research field (Major) not found: " + researchFieldName)))
              .collect(Collectors.toSet());
      dbStudent.setResearchFieldInterests(researchFieldInterests);
      Set<ResearchPeriod> researchPeriods =
          studentProfile.getResearchPeriodsInterestsList().stream()
              .map(
                  periodName ->
                      researchPeriodService
                          .getResearchPeriodByName(periodName)
                          .orElseThrow(
                              () ->
                                  new IllegalArgumentException(
                                      "Research period not found: " + periodName)))
              .collect(Collectors.toSet());
      dbStudent.setResearchPeriods(researchPeriods);
      dbStudent.setInterestReason(studentProfile.getInterestReason());
      dbStudent.setHasPriorExperience(studentProfile.getHasPriorExperience());
      dbStudent.setIsActive(studentProfile.getIsActive());

      Student createdStudent = studentService.saveStudent(dbStudent);

      User createdUser = userService.createUser(studentProfile.getEmail(),
          UserRole.STUDENT);

      return CreateProfileResponse.newBuilder()
          .setSuccess(true)
          .setProfileId(createdStudent.getId())
          .setCreatedStudent(studentProfile)
          .build();
    } catch (Exception e) {
      return CreateProfileResponse.newBuilder()
          .setSuccess(false)
          .setErrorMessage(e.getMessage())
          .build();
    }
  }

  private void validateStudentData(StudentProto studentProto) {
    if (studentProto.getFirstName().isEmpty()
        | studentProto.getLastName().isEmpty()
        | studentProto.getEmail().isEmpty()
        | studentProto.getClassStatus().isEmpty()
        // int values default to 0 if not set, so we can just check that the
        // graduation year is at least the current year.
        | studentProto.getGraduationYear() < Year.now().getValue()
        | studentProto.getMajorsList().stream().anyMatch(String::isEmpty)
        | studentProto.getResearchFieldInterestsList().stream().anyMatch(String::isEmpty)
        | studentProto.getResearchPeriodsInterestsList().stream().anyMatch(String::isEmpty)
        | studentProto.getInterestReason().isEmpty()
        // We don't check for has_prior_experience or is_active because they
        // default to false if not set.
    ) {
      throw new IllegalArgumentException(
          "StudentProto must have valid following fields: "
              + "first_name, last_name, class_status, interest_reason, majors, "
              + "research_field_interests, research_periods_interests");
    }
  }

  private void validateRequest(CreateProfileRequest request) {
    if (!request.hasStudentProfile()) {
      throw new IllegalArgumentException("CreateProfileRequest must contain 'student_profile'");
    }
  }
}
