package COMP_49X_our_search.backend.util;

import COMP_49X_our_search.backend.database.entities.User;
import COMP_49X_our_search.backend.database.services.UserService;
import COMP_49X_our_search.backend.profile.ProfileModuleController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import proto.core.Core.ModuleResponse;
import proto.core.Core.ModuleConfig;
import proto.profile.ProfileModule.DeleteProfileResponse;
import proto.profile.ProfileModule.DeleteProfileRequest;
import proto.profile.ProfileModule.ProfileRequest;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserExpirationChecker {

    @Value("${user.expiration.years}")
    private int expirationYears;

    private final UserService userService;

    private final ProfileModuleController profileModuleController;

    @Autowired
    public UserExpirationChecker(UserService userService, ProfileModuleController profileModuleController) {
        this.userService = userService;
        this.profileModuleController = profileModuleController;
    }

    @Scheduled(cron = "0 0 0 * * ?")
    public void checkExpiredUsers() {
        List<User> allUsers = userService.getAllUsers();

        LocalDateTime now = LocalDateTime.now();

        for (User user : allUsers) {
            if (user.getCreatedAt() != null && user.getCreatedAt().plusYears(expirationYears).isBefore(now)) {
                String email = user.getEmail();
                ProfileRequest profileRequest = ProfileRequest.newBuilder().setDeleteProfileRequest(DeleteProfileRequest.newBuilder().setUserEmail(email)).build();
                ModuleConfig moduleConfig = ModuleConfig.newBuilder().setProfileRequest(profileRequest).build();
                ModuleResponse moduleResponse = profileModuleController.processConfig(moduleConfig);
                DeleteProfileResponse deleteProfileResponse = moduleResponse.getProfileResponse().getDeleteProfileResponse();
                if(!deleteProfileResponse.getSuccess()) {
                    throw new RuntimeException(deleteProfileResponse.getErrorMessage());
                }
            }
        }
    }
}

