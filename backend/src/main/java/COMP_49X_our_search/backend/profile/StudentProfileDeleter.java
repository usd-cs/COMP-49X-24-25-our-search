package COMP_49X_our_search.backend.profile;

import COMP_49X_our_search.backend.database.entities.Student;
import COMP_49X_our_search.backend.database.services.StudentService;
import COMP_49X_our_search.backend.database.services.UserService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proto.profile.ProfileModule.DeleteProfileRequest;
import proto.profile.ProfileModule.DeleteProfileResponse;

@Service
public class StudentProfileDeleter implements ProfileDeleter {

  private final StudentService studentService;
  private final UserService userService;

  @Autowired
  public StudentProfileDeleter(StudentService studentService, UserService userService) {
    this.studentService = studentService;
    this.userService = userService;
  }

  @Override
  @Transactional
  public DeleteProfileResponse deleteProfile(DeleteProfileRequest request) {
    validateRequest(request);

    try {
      String email = request.getUserEmail();

      if (!studentService.existsByEmail(email)) {
        return DeleteProfileResponse.newBuilder()
            .setSuccess(false)
            .setErrorMessage(String.format("Student with email '%s' not found.", email))
            .build();
      }

      Student dbStudent = studentService.getStudentByEmail(email);
      int profileId = dbStudent.getId();

      studentService.deleteStudentByEmail(email);
      userService.deleteUserByEmail(email);

      return DeleteProfileResponse.newBuilder().setSuccess(true).setProfileId(profileId).build();
    } catch (Exception e) {
      return DeleteProfileResponse.newBuilder()
          .setSuccess(false)
          .setErrorMessage("Error deleting student profile: " + e.getMessage())
          .build();
    }
  }

  private void validateRequest(DeleteProfileRequest request) {
    if (request.getUserEmail().isEmpty()) {
      throw new IllegalArgumentException("DeleteProfileRequest must contain 'user_email'");
    }
  }
}
