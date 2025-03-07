/**
 * Controller class for managing profile-related operations. This class maps profile operation types
 * to their corresponding profile creation, editing, or deletion implementations and processes
 * requests accordingly.
 *
 * <p>Supported operations:
 * - **Profile Creation**
 * - **Profile Editing**
 * - **Profile Deletion**
 *
 * <p>This controller determines the profile and operation type and invokes the corresponding
 * interface ('ProfileCreator', 'ProfileEditor', 'ProfileDeleter') through a mapped implementation,
 * for example 'StudentProfileCreator, or 'FacultyProfileEditor'. Each operation type is handled by
 * its respective interface and executed dynamically using the appropriate implementation.
 *
 * <p>Implements the ModuleController interface.
 *
 * @author Augusto Escudero
 */
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
import proto.profile.ProfileModule.DeleteProfileRequest;
import proto.profile.ProfileModule.DeleteProfileResponse;
import proto.profile.ProfileModule.EditProfileRequest;
import proto.profile.ProfileModule.EditProfileResponse;
import proto.profile.ProfileModule.ProfileRequest;
import proto.profile.ProfileModule.ProfileResponse;
import proto.profile.ProfileModule.RetrieveProfileRequest;
import proto.profile.ProfileModule.RetrieveProfileResponse;

@Service
public class ProfileModuleController implements ModuleController {

  private final Map<ProfileTypeCase, ProfileCreator> profileCreatorMap;
  private final Map<UserRole, ProfileRetriever> profileRetrieverMap;
  private final Map<UserRole, ProfileEditor> profileEditorMap;
  private final Map<UserRole, ProfileDeleter> profileDeleterMap;

  private final UserService userService;

  @Autowired
  public ProfileModuleController(
      StudentProfileCreator studentProfileCreator,
      StudentProfileRetriever studentProfileRetriever,
      StudentProfileEditor studentProfileEditor,
      StudentProfileDeleter studentProfileDeleter,
      FacultyProfileCreator facultyProfileCreator,
      FacultyProfileRetriever facultyProfileRetriever,
      FacultyProfileEditor facultyProfileEditor,
      FacultyProfileDeleter facultyProfileDeleter,
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
    this.profileEditorMap = new EnumMap<>(UserRole.class);
    this.profileDeleterMap = new EnumMap<>(UserRole.class);

    // Map Profile type case to their respective ProfileCreator implementations.
    this.profileCreatorMap.put(ProfileTypeCase.STUDENT_PROFILE, studentProfileCreator);
    this.profileCreatorMap.put(ProfileTypeCase.FACULTY_PROFILE, facultyProfileCreator);

    // Map User role to their respective ProfileRetriever implementations.
    this.profileRetrieverMap.put(UserRole.STUDENT, studentProfileRetriever);
    this.profileRetrieverMap.put(UserRole.FACULTY, facultyProfileRetriever);

    // Map User role to their respective ProfileEditor implementations
    this.profileEditorMap.put(UserRole.STUDENT, studentProfileEditor);
    this.profileEditorMap.put(UserRole.FACULTY, facultyProfileEditor);

    // Map User role to their respective ProfileDeleter implementations
    this.profileDeleterMap.put(UserRole.STUDENT, studentProfileDeleter);
    this.profileDeleterMap.put(UserRole.FACULTY, facultyProfileDeleter);
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
      case EDIT_PROFILE_REQUEST:
        response =
            ProfileResponse.newBuilder()
                .setEditProfileResponse(handleProfileEditing(request.getEditProfileRequest()))
                .build();
        break;
      case DELETE_PROFILE_REQUEST:
        response =
            ProfileResponse.newBuilder()
                .setDeleteProfileResponse(handleProfileDeletion(request.getDeleteProfileRequest()))
                .build();
        break;
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

  private EditProfileResponse handleProfileEditing(EditProfileRequest request) {
    UserRole role = userService.getUserRoleByEmail(request.getUserEmail());

    ProfileEditor profileEditor = profileEditorMap.get(role);

    if (profileEditor == null) {
      throw new UnsupportedOperationException("Profile retrieval not supported for role: " + role);
    }

    return profileEditor.editProfile(request);
  }

  private DeleteProfileResponse handleProfileDeletion(DeleteProfileRequest request) {
    UserRole role = userService.getUserRoleByEmail(request.getUserEmail());

    ProfileDeleter profileDeleter = profileDeleterMap.get(role);

    if(profileDeleter == null) {
      throw new UnsupportedOperationException("Profile deletion not supported for role: " + role);
    }

    return profileDeleter.deleteProfile(request);
  }

  private void validateConfig(ModuleConfig moduleConfig) {
    if (!moduleConfig.hasProfileRequest()) {
      throw new IllegalArgumentException("ModuleConfig does not contain a ProfileRequest.");
    }
  }
}
