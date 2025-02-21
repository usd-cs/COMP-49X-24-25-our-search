package COMP_49X_our_search.backend.profile;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import proto.core.Core.ModuleConfig;
import proto.core.Core.ModuleResponse;
import proto.data.Entities.StudentProto;
import proto.profile.ProfileModule.CreateProfileRequest;
import proto.profile.ProfileModule.CreateProfileResponse;
import proto.profile.ProfileModule.ProfileRequest;
import proto.profile.ProfileModule.ProfileResponse;

public class ProfileModuleControllerTest {

  private ProfileModuleController profileModuleController;
  private StudentProfileCreator studentProfileCreator;

  @BeforeEach
  void setUp() {
    studentProfileCreator = mock(StudentProfileCreator.class);
    profileModuleController = new ProfileModuleController(studentProfileCreator);
  }

  @Test
  public void testProcessConfig_validRequest_createStudent_returnsExpectedResult() {
    StudentProto validStudent =
        StudentProto.newBuilder().setFirstName("First").setLastName("Last").build();

    CreateProfileRequest createProfileRequest =
        CreateProfileRequest.newBuilder().setStudentProfile(validStudent).build();
    CreateProfileResponse mockCreateProfileResponse =
        CreateProfileResponse.newBuilder().setProfileId(1).setSuccess(true).build();

    ProfileRequest profileRequest =
        ProfileRequest.newBuilder().setCreateProfileRequest(createProfileRequest).build();
    ProfileResponse mockProfileResponse =
        ProfileResponse.newBuilder().setCreateProfileResponse(mockCreateProfileResponse).build();

    when(studentProfileCreator.createProfile(createProfileRequest))
        .thenReturn(mockCreateProfileResponse);

    ModuleConfig moduleConfig = ModuleConfig.newBuilder().setProfileRequest(profileRequest).build();

    ModuleResponse response = profileModuleController.processConfig(moduleConfig);
    assertEquals(mockProfileResponse, response.getProfileResponse());
  }

  @Test
  public void testProcessConfig_profileTypeNotSet_throwsException() {
    ProfileRequest invalidRequest =
        ProfileRequest.newBuilder()
            .setCreateProfileRequest(CreateProfileRequest.getDefaultInstance())
            .build();
    ModuleConfig moduleConfig = ModuleConfig.newBuilder().setProfileRequest(invalidRequest).build();

    Exception exception =
        assertThrows(
            IllegalArgumentException.class,
            () -> {
              profileModuleController.processConfig(moduleConfig);
            });

    assertEquals("ProfileType is not set in CreateProfileRequest.", exception.getMessage());
  }

  @Test
  public void testProcessConfig_operationTypeNotSet_throwsException() {
    ProfileRequest invalidRequest = ProfileRequest.getDefaultInstance();
    ModuleConfig moduleConfig = ModuleConfig.newBuilder().setProfileRequest(invalidRequest).build();

    Exception exception =
        assertThrows(
            UnsupportedOperationException.class,
            () -> {
              profileModuleController.processConfig(moduleConfig);
            });

    assertEquals("Unsupported operation_request: OPERATIONREQUEST_NOT_SET", exception.getMessage());
  }

  @Test
  public void testProcessConfig_requestDoesNotContainProfileRequest_throwsException() {
    ModuleConfig moduleConfig = ModuleConfig.getDefaultInstance();

    Exception exception =
        assertThrows(
            IllegalArgumentException.class,
            () -> {
              profileModuleController.processConfig(moduleConfig);
            });

    assertEquals("ModuleConfig does not contain a ProfileRequest.", exception.getMessage());
  }
}
