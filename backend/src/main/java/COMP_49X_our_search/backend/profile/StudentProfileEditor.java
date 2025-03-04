/**
 * Profile editor for students. This class handles editing student profiles and
 * saving the changes to the database.
 *
 * Implements ProfileEditor interface.
 *
 * @author Augusto Escudero.
 */
package COMP_49X_our_search.backend.profile;

import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.entities.ResearchPeriod;
import COMP_49X_our_search.backend.database.entities.Student;
import COMP_49X_our_search.backend.database.enums.UserRole;
import COMP_49X_our_search.backend.database.services.MajorService;
import COMP_49X_our_search.backend.database.services.ResearchPeriodService;
import COMP_49X_our_search.backend.database.services.StudentService;
import COMP_49X_our_search.backend.database.services.UserService;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proto.data.Entities.StudentProto;
import proto.profile.ProfileModule.EditProfileRequest;
import proto.profile.ProfileModule.EditProfileResponse;

@Service
public class StudentProfileEditor implements ProfileEditor {

  private final StudentService studentService;
  private final MajorService majorService;
  private final ResearchPeriodService researchPeriodService;
  private final UserService userService;

  @Autowired
  public StudentProfileEditor(
      StudentService studentService,
      MajorService majorService,
      ResearchPeriodService researchPeriodService,
      UserService userService) {
    this.studentService = studentService;
    this.majorService = majorService;
    this.researchPeriodService = researchPeriodService;
    this.userService = userService;
  }

  @Override
  public EditProfileResponse editProfile(EditProfileRequest request) {
    validateRequest(request);
    validateUserRole(request.getUserEmail());
    try {
      StudentProto updatedProfile = request.getStudentProfile();

      if (!studentService.existsByEmail(request.getUserEmail())) {
        throw new IllegalStateException(
            String.format("Could not find student with email: %s", request.getUserEmail()));
      }

      Student existingStudent = studentService.getStudentByEmail(request.getUserEmail());
      existingStudent.setFirstName(updatedProfile.getFirstName());
      existingStudent.setLastName(updatedProfile.getLastName());
      existingStudent.setGraduationYear(updatedProfile.getGraduationYear());
      existingStudent.setInterestReason(updatedProfile.getInterestReason());
      existingStudent.setHasPriorExperience(updatedProfile.getHasPriorExperience());
      existingStudent.setUndergradYear(
          convertClassStatusToUndergradYear(updatedProfile.getClassStatus()));
      existingStudent.setIsActive(updatedProfile.getIsActive());

      Set<Major> updatedMajors =
          updatedProfile.getMajorsList().stream()
              .map(
                  majorName ->
                      majorService
                          .getMajorByName(majorName)
                          .orElseThrow(
                              () -> new IllegalArgumentException("Major not found: " + majorName)))
              .collect(Collectors.toSet());
      existingStudent.setMajors(updatedMajors);

      Set<Major> updatedResearchFields =
          updatedProfile.getResearchFieldInterestsList().stream()
              .map(
                  fieldName ->
                      majorService
                          .getMajorByName(fieldName)
                          .orElseThrow(
                              () ->
                                  new IllegalArgumentException(
                                      "Research field (Major) not found: " + fieldName)))
              .collect(Collectors.toSet());
      existingStudent.setResearchFieldInterests(updatedResearchFields);

      Set<ResearchPeriod> updatedResearchPeriods =
          updatedProfile.getResearchPeriodsInterestsList().stream()
              .map(
                  periodName ->
                      researchPeriodService
                          .getResearchPeriodByName(periodName)
                          .orElseThrow(
                              () ->
                                  new IllegalArgumentException(
                                      "Research period not found: " + periodName)))
              .collect(Collectors.toSet());
      existingStudent.setResearchPeriods(updatedResearchPeriods);

      Student updatedStudent = studentService.saveStudent(existingStudent);

      return EditProfileResponse.newBuilder()
          .setSuccess(true)
          .setProfileId(updatedStudent.getId())
          .setEditedStudent(updatedProfile)
          .build();
    } catch (Exception e) {
      return EditProfileResponse.newBuilder()
          .setSuccess(false)
          .setErrorMessage(e.getMessage())
          .build();
    }
  }

  private int convertClassStatusToUndergradYear(String classStatus) {
    switch (classStatus) {
      case "Freshman":
        return 1;
      case "Sophomore":
        return 2;
      case "Junior":
        return 3;
      case "Senior":
        return 4;
      case "Graduate":
        return 5;
      default:
        throw new IllegalArgumentException("Class status not supported: " + classStatus);
    }
  }

  private void validateUserRole(String userEmail) {
    if (userService.getUserRoleByEmail(userEmail) != UserRole.STUDENT) {
      throw new IllegalArgumentException("User must be a Student");
    }
  }

  private void validateRequest(EditProfileRequest request) {
    if (!request.hasStudentProfile()) {
      throw new IllegalArgumentException("EditProfileRequest must contain 'student_profile'");
    }
  }
}
