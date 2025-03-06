/**
 * Profile deleter for faculty. This class handles deleting a faculty profile
 * and its respective user from the database.
 *
 * Implements ProfileDeleter interface.
 *
 * @author Augusto Escudero
 */
package COMP_49X_our_search.backend.profile;

import COMP_49X_our_search.backend.database.entities.Faculty;
import COMP_49X_our_search.backend.database.services.FacultyService;
import COMP_49X_our_search.backend.database.services.UserService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proto.profile.ProfileModule.DeleteProfileRequest;
import proto.profile.ProfileModule.DeleteProfileResponse;

@Service
public class FacultyProfileDeleter implements ProfileDeleter {

  private final FacultyService facultyService;
  private final UserService userService;

  @Autowired
  public FacultyProfileDeleter(FacultyService facultyService, UserService userService) {
    this.facultyService = facultyService;
    this.userService = userService;
  }

  @Override
  @Transactional
  public DeleteProfileResponse deleteProfile(DeleteProfileRequest request) {
    validateRequest(request);

    try {
      String email = request.getUserEmail();

      if (!facultyService.existsByEmail(email)) {
        return DeleteProfileResponse.newBuilder()
            .setSuccess(false)
            .setErrorMessage(String.format("Faculty with email '%s' not found.", email))
            .build();
      }

      Faculty dbFaculty = facultyService.getFacultyByEmail(email);
      int profileId = dbFaculty.getId();

      facultyService.deleteFacultyByEmail(email);
      userService.deleteUserByEmail(email);

      return DeleteProfileResponse.newBuilder().setSuccess(true).setProfileId(profileId).build();
    } catch (Exception e) {
      return DeleteProfileResponse.newBuilder()
          .setSuccess(false)
          .setErrorMessage("Error deleting faculty profile: " + e.getMessage())
          .build();
    }
  }

  private void validateRequest(DeleteProfileRequest request) {
    if (request.getUserEmail().isEmpty()) {
      throw new IllegalArgumentException("DeleteProfileRequest must contain 'user_email'");
    }
  }
}
