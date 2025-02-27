/**
 * Interface for profile creation. Defines a method for creating user profiles,
 * which should be implemented by ProfileCreator implementations.
 *
 * @author Augusto Escudero
 */
package COMP_49X_our_search.backend.profile;


import proto.profile.ProfileModule.CreateProfileRequest;
import proto.profile.ProfileModule.CreateProfileResponse;

public interface ProfileCreator {
  CreateProfileResponse createProfile(CreateProfileRequest request);
}
