/**
 * Profile editor for faculty. This class handles editing student profiles and
 * saving the changes to the database.
 *
 * Implements ProfileEditor interface.
 *
 * @author Augusto Escudero
 */
package COMP_49X_our_search.backend.profile;

import COMP_49X_our_search.backend.database.entities.Department;
import COMP_49X_our_search.backend.database.entities.Faculty;
import COMP_49X_our_search.backend.database.enums.UserRole;
import COMP_49X_our_search.backend.database.services.DepartmentService;
import COMP_49X_our_search.backend.database.services.FacultyService;
import COMP_49X_our_search.backend.database.services.UserService;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proto.data.Entities.FacultyProto;
import proto.profile.ProfileModule.EditProfileRequest;
import proto.profile.ProfileModule.EditProfileResponse;

@Service
public class FacultyProfileEditor implements ProfileEditor {

  private final FacultyService facultyService;
  private final DepartmentService departmentService;
  private final UserService userService;

  @Autowired
  public FacultyProfileEditor(
      FacultyService facultyService, DepartmentService departmentService, UserService userService) {
    this.facultyService = facultyService;
    this.departmentService = departmentService;
    this.userService = userService;
  }

  @Override
  public EditProfileResponse editProfile(EditProfileRequest request) {
    validateRequest(request);
    validateUserRole(request.getUserEmail());
    try {
      FacultyProto updatedProfile = request.getFacultyProfile();

      if (!facultyService.existsByEmail(request.getUserEmail())) {
        throw new IllegalArgumentException(
            String.format("Could not find faculty with email: %s", request.getUserEmail()));
      }

      Faculty existingFaculty = facultyService.getFacultyByEmail(request.getUserEmail());
      existingFaculty.setFirstName(updatedProfile.getFirstName());
      existingFaculty.setLastName(updatedProfile.getLastName());

      Set<Department> updatedDepartments =
          updatedProfile.getDepartmentsList().stream()
              .map(
                  departmentName ->
                      departmentService
                          .getDepartmentByName(departmentName)
                          .orElseThrow(
                              () ->
                                  new IllegalArgumentException(
                                      "Department not found: " + departmentName)))
              .collect(Collectors.toSet());
      existingFaculty.setDepartments(updatedDepartments);

      Faculty updatedFaculty = facultyService.saveFaculty(existingFaculty);

      return EditProfileResponse.newBuilder()
          .setSuccess(true)
          .setProfileId(updatedFaculty.getId())
          .setEditedFaculty(updatedProfile)
          .build();
    } catch (Exception e) {
      return EditProfileResponse.newBuilder()
          .setSuccess(false)
          .setErrorMessage(e.getMessage())
          .build();
    }
  }

  private void validateUserRole(String userEmail) {
    if (userService.getUserRoleByEmail(userEmail) != UserRole.FACULTY) {
      throw new IllegalArgumentException("User must be Faculty");
    }
  }

  private void validateRequest(EditProfileRequest request) {
    if (!request.hasFacultyProfile()) {
      throw new IllegalArgumentException("EditProfile must contain 'faculty_profile'");
    }
  }
}
