package COMP_49X_our_search.backend.profile;

import proto.profile.ProfileModule.RetrieveProfileRequest;
import proto.profile.ProfileModule.RetrieveProfileResponse;

public interface ProfileRetriever {
  RetrieveProfileResponse retrieveProfile(RetrieveProfileRequest request);
}
