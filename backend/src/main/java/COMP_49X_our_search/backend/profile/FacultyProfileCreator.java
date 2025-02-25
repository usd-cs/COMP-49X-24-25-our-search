/**
 * Profile creator for faculty members. This class handles the creation of
 * faculty profiles and users and storing them in the database.
 *
 * Implements the ProfileCreator interface.
 *
 * @author Augusto Escudero
 */
package COMP_49X_our_search.backend.profile;

import COMP_49X_our_search.backend.database.entities.Department;
import COMP_49X_our_search.backend.database.entities.Faculty;
import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.entities.User;
import COMP_49X_our_search.backend.database.enums.UserRole;
import COMP_49X_our_search.backend.database.services.DepartmentService;
import COMP_49X_our_search.backend.database.services.FacultyService;
import COMP_49X_our_search.backend.database.services.UserService;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proto.data.Entities.FacultyProto;
import proto.profile.ProfileModule.CreateProfileRequest;
import proto.profile.ProfileModule.CreateProfileResponse;

@Service
public class FacultyProfileCreator implements ProfileCreator {

  private final FacultyService facultyService;
  private final DepartmentService departmentService;

  private final UserService userService;

  @Autowired
  public FacultyProfileCreator(
      FacultyService facultyService, DepartmentService departmentService, UserService userService) {
    this.facultyService = facultyService;
    this.departmentService = departmentService;
    this.userService = userService;
  }

  @Override
  public CreateProfileResponse createProfile(CreateProfileRequest request) {
    validateRequest(request);
    validateFacultyData(request.getFacultyProfile());

    try {
      FacultyProto facultyProfile = request.getFacultyProfile();

      if (facultyService.existsByEmail(facultyProfile.getEmail())) {
        throw new IllegalArgumentException("A faculty member with this email already exists.");
      }

      Faculty dbFaculty = new Faculty();
      dbFaculty.setFirstName(facultyProfile.getFirstName());
      dbFaculty.setLastName(facultyProfile.getLastName());
      dbFaculty.setEmail(facultyProfile.getEmail());
      Set<Department> departmentEntities =
          facultyProfile.getDepartmentsList().stream()
              .map(
                  departmentName ->
                      departmentService
                          .getDepartmentByName(departmentName)
                          .orElseThrow(
                              () ->
                                  new IllegalArgumentException(
                                      "Department not found: " + departmentName)))
              .collect(Collectors.toSet());
      dbFaculty.setDepartments(departmentEntities);

      Faculty createdFaculty = facultyService.saveFaculty(dbFaculty);

      User createdUser = userService.createUser(facultyProfile.getEmail(), UserRole.FACULTY);

      return CreateProfileResponse.newBuilder()
          .setSuccess(true)
          .setProfileId(createdFaculty.getId())
          .setCreatedFaculty(facultyProfile)
          .build();
    } catch (Exception e) {
      return CreateProfileResponse.newBuilder()
          .setSuccess(false)
          .setErrorMessage(e.getMessage())
          .build();
    }
  }

  private void validateFacultyData(FacultyProto facultyProto) {
    if (facultyProto.getFirstName().isEmpty()
        | facultyProto.getLastName().isEmpty()
        | facultyProto.getEmail().isEmpty()
        | facultyProto.getDepartmentsList().stream().anyMatch(String::isEmpty)) {
      throw new IllegalArgumentException(
          "FacultyProto must have valid following fields: first_name, last_name, email, departments");
    }
  }

  private void validateRequest(CreateProfileRequest request) {
    if (!request.hasFacultyProfile()) {
      throw new IllegalArgumentException("CreateProfileRequest must contain 'faculty_profile'");
    }
  }
}
