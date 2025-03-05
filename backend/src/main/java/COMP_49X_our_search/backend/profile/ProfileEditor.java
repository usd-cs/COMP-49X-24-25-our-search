/**
 * Interface for profile editing. Defines a method for editing user profiles,
 * which should be implemented by ProfileEditor implementations.
 *
 * @author Augusto Escudero
 */
package COMP_49X_our_search.backend.profile;

import proto.profile.ProfileModule.EditProfileRequest;
import proto.profile.ProfileModule.EditProfileResponse;

public interface ProfileEditor {
  EditProfileResponse editProfile(EditProfileRequest request);
}
