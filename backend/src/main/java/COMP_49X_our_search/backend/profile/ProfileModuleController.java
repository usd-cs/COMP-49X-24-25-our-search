package COMP_49X_our_search.backend.profile;

import COMP_49X_our_search.backend.core.ModuleController;
import COMP_49X_our_search.backend.database.enums.UserRole;
import COMP_49X_our_search.backend.database.services.UserService;
import java.util.EnumMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proto.core.Core.ModuleConfig;
import proto.core.Core.ModuleResponse;
import proto.profile.ProfileModule.CreateProfileRequest;
import proto.profile.ProfileModule.CreateProfileRequest.ProfileTypeCase;
import proto.profile.ProfileModule.CreateProfileResponse;
import proto.profile.ProfileModule.ProfileRequest;
import proto.profile.ProfileModule.ProfileResponse;
import proto.profile.ProfileModule.RetrieveProfileRequest;
import proto.profile.ProfileModule.RetrieveProfileResponse;

@Service
public class ProfileModuleController implements ModuleController {

  private final Map<ProfileTypeCase, ProfileCreator> profileCreatorMap;
  private final Map<UserRole, ProfileRetriever> profileRetrieverMap;

  private final UserService userService;

  @Autowired
  public ProfileModuleController(
      StudentProfileCreator studentProfileCreator,
      FacultyProfileCreator facultyProfileCreator,
      StudentProfileRetriever studentProfileRetriever,
      UserService userService) {
    this.userService = userService;
    // Initialize EnumMaps for mapping profile operations to their respective
    // implementations.
    // - profileCreatorMap maps profile creation requests to their corresponding
    //   ProfileCreator.
    // - profileRetrieverMap maps user roles to their corresponding
    //   ProfileRetriever for profile retrieval.
    // These maps will be extended in the future to support additional
    // operations like profile editing or deletion.
    this.profileCreatorMap = new EnumMap<>(ProfileTypeCase.class);
    this.profileRetrieverMap = new EnumMap<>(UserRole.class);

    // Map Profile type case to their respective ProfileCreator implementations.
    this.profileCreatorMap.put(ProfileTypeCase.STUDENT_PROFILE, studentProfileCreator);
    this.profileCreatorMap.put(ProfileTypeCase.FACULTY_PROFILE, facultyProfileCreator);

    // Map User role to their respective ProfileRetriever implementations.
    this.profileRetrieverMap.put(UserRole.STUDENT, studentProfileRetriever);
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
      case RETRIEVE_PROFILE_REQUEST:
        response =
            ProfileResponse.newBuilder()
                .setRetrieveProfileResponse(
                    handleProfileRetrieval(request.getRetrieveProfileRequest()))
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

  private RetrieveProfileResponse handleProfileRetrieval(RetrieveProfileRequest request) {
    UserRole role = userService.getUserRoleByEmail(request.getUserEmail());

    ProfileRetriever profileRetriever = profileRetrieverMap.get(role);

    if (profileRetriever == null) {
      throw new UnsupportedOperationException("Profile retrieval not supported for role: " + role);
    }

    return profileRetriever.retrieveProfile(request);
  }

  private void validateConfig(ModuleConfig moduleConfig) {
    if (!moduleConfig.hasProfileRequest()) {
      throw new IllegalArgumentException("ModuleConfig does not contain a ProfileRequest.");
    }
  }
}
