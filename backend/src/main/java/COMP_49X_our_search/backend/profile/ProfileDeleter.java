package COMP_49X_our_search.backend.profile;

import proto.profile.ProfileModule.DeleteProfileRequest;
import proto.profile.ProfileModule.DeleteProfileResponse;

public interface ProfileDeleter {
  DeleteProfileResponse deleteProfile(DeleteProfileRequest request);
}
