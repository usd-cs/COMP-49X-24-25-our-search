/**
 * Controller class for managing profile-related operations. This class maps
 * profile operation types to their corresponding profile creation, editing, or
 * deletion implementations and processes requests accordingly.
 *
 * Supported operations:
 * - **Profile Creation** (currently supported)
 * - **Profile Editing** (planned)
 * - **Profile Deletion** (planned)
 *
 * This controller determines the profile and operation type and invokes the
 * corresponding interface ('ProfileCreator', 'ProfileEditor', 'ProfileDeleter')
 * through a mapped implementation, for example 'StudentProfileCreator, or
 * 'FacultyProfileEditor'. Each operation type is handled by its respective
 * interface and executed dynamically using the appropriate implementation.
 *
 * Implements the ModuleController interface.
 *
 * @author Augusto Escudero
 */
package COMP_49X_our_search.backend.profile;

import COMP_49X_our_search.backend.core.ModuleController;
import java.util.EnumMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proto.core.Core.ModuleConfig;
import proto.core.Core.ModuleResponse;
import proto.profile.ProfileModule;
import proto.profile.ProfileModule.CreateProfileRequest;
import proto.profile.ProfileModule.CreateProfileRequest.ProfileTypeCase;
import proto.profile.ProfileModule.CreateProfileResponse;
import proto.profile.ProfileModule.ProfileRequest;
import proto.profile.ProfileModule.ProfileResponse;

@Service
public class ProfileModuleController implements ModuleController {

  private final Map<ProfileTypeCase, ProfileCreator> profileCreatorMap;

  @Autowired
  public ProfileModuleController(
      StudentProfileCreator studentProfileCreator, FacultyProfileCreator facultyProfileCreator) {
    // Initialize EnumMaps for mapping profile creator types to implementations
    // Will be used for other type of profile operations like profile editing
    // or profile deletion.
    this.profileCreatorMap = new EnumMap<>(ProfileTypeCase.class);

    // Map Profile type case to ProfileCreator their respective implementations.
    this.profileCreatorMap.put(ProfileTypeCase.STUDENT_PROFILE, studentProfileCreator);
    this.profileCreatorMap.put(ProfileTypeCase.FACULTY_PROFILE, facultyProfileCreator);
  }

  @Override
  public ModuleResponse processConfig(ModuleConfig moduleConfig) {
    validateConfig(moduleConfig);

    ProfileRequest request = moduleConfig.getProfileRequest();
    ProfileResponse response;
    switch (request.getOperationRequestCase()) {
      case CREATE_PROFILE_REQUEST:
        response =
            ProfileResponse.newBuilder()
                .setCreateProfileResponse(handleProfileCreation(request.getCreateProfileRequest()))
                .build();
        break;
      // Add more cases as we add more operation types, e.g. edit, delete
      default:
        throw new UnsupportedOperationException(
            "Unsupported operation_request: " + request.getOperationRequestCase());
    }
    return ModuleResponse.newBuilder().setProfileResponse(response).build();
  }

  private CreateProfileResponse handleProfileCreation(CreateProfileRequest request) {
    ProfileTypeCase type = request.getProfileTypeCase();

    if (type == ProfileTypeCase.PROFILETYPE_NOT_SET) {
      throw new IllegalArgumentException("ProfileType is not set in CreateProfileRequest.");
    }
    ProfileCreator profileCreator = profileCreatorMap.get(type);

    if (profileCreator == null) {
      throw new UnsupportedOperationException("Unsupported profile_type: " + type);
    }
    return profileCreator.createProfile(request);
  }

  private void validateConfig(ModuleConfig moduleConfig) {
    if (!moduleConfig.hasProfileRequest()) {
      throw new IllegalArgumentException("ModuleConfig does not contain a ProfileRequest.");
    }
  }
}
