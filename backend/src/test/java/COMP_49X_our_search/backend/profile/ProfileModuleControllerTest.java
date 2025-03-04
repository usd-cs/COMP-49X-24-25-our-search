package COMP_49X_our_search.backend.profile;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import COMP_49X_our_search.backend.database.enums.UserRole;
import COMP_49X_our_search.backend.database.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import proto.core.Core.ModuleConfig;
import proto.core.Core.ModuleResponse;
import proto.data.Entities.FacultyProto;
import proto.data.Entities.StudentProto;
import proto.profile.ProfileModule.CreateProfileRequest;
import proto.profile.ProfileModule.CreateProfileResponse;
import proto.profile.ProfileModule.EditProfileRequest;
import proto.profile.ProfileModule.EditProfileResponse;
import proto.profile.ProfileModule.ProfileRequest;
import proto.profile.ProfileModule.ProfileResponse;
import proto.profile.ProfileModule.RetrieveProfileRequest;
import proto.profile.ProfileModule.RetrieveProfileResponse;

public class ProfileModuleControllerTest {

  private ProfileModuleController profileModuleController;
  private StudentProfileCreator studentProfileCreator;
  private FacultyProfileCreator facultyProfileCreator;
  private StudentProfileRetriever studentProfileRetriever;
  private StudentProfileEditor studentProfileEditor;
  private UserService userService;

  @BeforeEach
  void setUp() {
    studentProfileCreator = mock(StudentProfileCreator.class);
    facultyProfileCreator = mock(FacultyProfileCreator.class);
    studentProfileRetriever = mock(StudentProfileRetriever.class);
    studentProfileEditor = mock(StudentProfileEditor.class);
    userService = mock(UserService.class);
    profileModuleController =
        new ProfileModuleController(
            studentProfileCreator, facultyProfileCreator, studentProfileRetriever, studentProfileEditor, userService);
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
  public void testProcessConfig_validRequest_createFaculty_returnsExpectedResult() {
    FacultyProto validFaculty =
        FacultyProto.newBuilder()
            .setFirstName("John")
            .setLastName("Doe")
            .setEmail("johndoe@test.com")
            .addDepartments("Computer Science")
            .build();

    CreateProfileRequest createProfileRequest =
        CreateProfileRequest.newBuilder().setFacultyProfile(validFaculty).build();
    CreateProfileResponse mockCreateProfileResponse =
        CreateProfileResponse.newBuilder().setProfileId(2).setSuccess(true).build();

    ProfileRequest profileRequest =
        ProfileRequest.newBuilder().setCreateProfileRequest(createProfileRequest).build();
    ProfileResponse mockProfileResponse =
        ProfileResponse.newBuilder().setCreateProfileResponse(mockCreateProfileResponse).build();

    when(facultyProfileCreator.createProfile(createProfileRequest))
        .thenReturn(mockCreateProfileResponse);

    ModuleConfig moduleConfig = ModuleConfig.newBuilder().setProfileRequest(profileRequest).build();

    ModuleResponse response = profileModuleController.processConfig(moduleConfig);
    assertEquals(mockProfileResponse, response.getProfileResponse());
  }

  @Test
  public void testProcessConfig_validRequest_retrieveStudent_returnsExpectedResult() {
    StudentProto validStudent =
        StudentProto.newBuilder()
            .setFirstName("First")
            .setLastName("Last")
            .setEmail("flast@test.com")
            .setClassStatus("Senior")
            .setGraduationYear(2025)
            .addMajors("Computer Science")
            .addResearchFieldInterests("Computer Science")
            .addResearchPeriodsInterests("Fall 2025")
            .setInterestReason("Test reason")
            .setHasPriorExperience(true)
            .setIsActive(true)
            .build();

    RetrieveProfileRequest retrieveProfileRequest =
        RetrieveProfileRequest.newBuilder().setUserEmail("flast@test.com").build();

    RetrieveProfileResponse mockRetrieveProfileResponse =
        RetrieveProfileResponse.newBuilder()
            .setSuccess(true)
            .setProfileId(1)
            .setRetrievedStudent(validStudent)
            .build();

    ProfileRequest profileRequest =
        ProfileRequest.newBuilder().setRetrieveProfileRequest(retrieveProfileRequest).build();
    ProfileResponse mockProfileResponse =
        ProfileResponse.newBuilder().setRetrieveProfileResponse(mockRetrieveProfileResponse).build();

    when(userService.getUserRoleByEmail("flast@test.com")).thenReturn(UserRole.STUDENT);

    when(studentProfileRetriever.retrieveProfile(retrieveProfileRequest))
        .thenReturn(mockRetrieveProfileResponse);

    ModuleConfig config = ModuleConfig.newBuilder().setProfileRequest(profileRequest).build();
    ModuleResponse response = profileModuleController.processConfig(config);
    assertEquals(mockProfileResponse, response.getProfileResponse());
  }

  @Test
  public void testProcessConfig_validRequest_editStudent_returnsExpectedResult() {
    StudentProto updatedStudent =
        StudentProto.newBuilder()
            .setFirstName("UpdatedFirst")
            .setLastName("UpdatedLast")
            .setEmail("flast@test.com")
            .setClassStatus("Senior")
            .setGraduationYear(2025)
            .addMajors("Computer Science")
            .addResearchFieldInterests("Computer Science")
            .addResearchPeriodsInterests("Fall 2025")
            .setInterestReason("New reason")
            .setHasPriorExperience(true)
            .setIsActive(true)
            .build();

    EditProfileRequest editProfileRequest =
        EditProfileRequest.newBuilder()
            .setUserEmail("flast@test.com")
            .setStudentProfile(updatedStudent)
            .build();

    EditProfileResponse mockEditProfileResponse =
        EditProfileResponse.newBuilder()
            .setSuccess(true)
            .setProfileId(1)
            .setEditedStudent(updatedStudent)
            .build();

    ProfileRequest profileRequest =
        ProfileRequest.newBuilder().setEditProfileRequest(editProfileRequest).build();

    ProfileResponse mockProfileResponse =
        ProfileResponse.newBuilder().setEditProfileResponse(mockEditProfileResponse).build();

    when(userService.getUserRoleByEmail("flast@test.com")).thenReturn(UserRole.STUDENT);

    when(studentProfileEditor.editProfile(editProfileRequest)).thenReturn(mockEditProfileResponse);

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
