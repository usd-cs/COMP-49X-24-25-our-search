package COMP_49X_our_search.backend.util;

import COMP_49X_our_search.backend.database.entities.User;
import COMP_49X_our_search.backend.database.services.UserService;
import COMP_49X_our_search.backend.profile.ProfileModuleController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.Collections;

import proto.core.Core.ModuleResponse;
import proto.core.Core.ModuleConfig;
import proto.profile.ProfileModule.DeleteProfileResponse;
import proto.profile.ProfileModule.ProfileResponse;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class UserExpirationCheckerTest {

    private UserService userService;
    private ProfileModuleController profileModuleController;
    private UserExpirationChecker userExpirationChecker;

    @BeforeEach
    public void setUp() throws Exception {
        userService = mock(UserService.class);
        profileModuleController = mock(ProfileModuleController.class);
        userExpirationChecker = new UserExpirationChecker(userService, profileModuleController);
        Field expirationField = UserExpirationChecker.class.getDeclaredField("expirationYears");
        expirationField.setAccessible(true);
        expirationField.set(userExpirationChecker, 4);
    }

    @Test
    public void testCheckExpiredUsers_noExpiredUsers() {
        User user = new User();
        user.setEmail("notexpired@test.com");
        user.setCreatedAt(LocalDateTime.now().minusYears(3));

        when(userService.getAllUsers()).thenReturn(Collections.singletonList(user));

        userExpirationChecker.checkExpiredUsers();

        verify(profileModuleController, never()).processConfig(any(ModuleConfig.class));
    }

    @Test
    public void testCheckExpiredUsers_withExpiredUser_success() {
        User user = new User();
        user.setEmail("expired@test.com");
        user.setCreatedAt(LocalDateTime.now().minusYears(5));

        when(userService.getAllUsers()).thenReturn(Collections.singletonList(user));

        DeleteProfileResponse deleteProfileResponse = DeleteProfileResponse.newBuilder()
                .setSuccess(true)
                .build();
        ProfileResponse profileResponse = ProfileResponse.newBuilder()
                .setDeleteProfileResponse(deleteProfileResponse)
                .build();
        ModuleResponse moduleResponse = ModuleResponse.newBuilder()
                .setProfileResponse(profileResponse)
                .build();

        when(profileModuleController.processConfig(any(ModuleConfig.class))).thenReturn(moduleResponse);

        userExpirationChecker.checkExpiredUsers();

        verify(profileModuleController, times(1)).processConfig(any(ModuleConfig.class));
    }

    @Test
    public void testCheckExpiredUsers_withExpiredUser_failure() {
        User user = new User();
        user.setEmail("expired_failure@test.com");
        user.setCreatedAt(LocalDateTime.now().minusYears(5));

        when(userService.getAllUsers()).thenReturn(Collections.singletonList(user));

        DeleteProfileResponse deleteProfileResponse = DeleteProfileResponse.newBuilder()
                .setSuccess(false)
                .setErrorMessage("Deletion failed")
                .build();
        ProfileResponse profileResponse = ProfileResponse.newBuilder()
                .setDeleteProfileResponse(deleteProfileResponse)
                .build();
        ModuleResponse moduleResponse = ModuleResponse.newBuilder()
                .setProfileResponse(profileResponse)
                .build();

        when(profileModuleController.processConfig(any(ModuleConfig.class))).thenReturn(moduleResponse);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userExpirationChecker.checkExpiredUsers();
        });
        assertEquals("Deletion failed", exception.getMessage());

        verify(profileModuleController, times(1)).processConfig(any(ModuleConfig.class));
    }
}
