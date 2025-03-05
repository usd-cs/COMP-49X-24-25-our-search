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
import proto.profile.ProfileModule.DeleteProfileRequest;
import proto.profile.ProfileModule.DeleteProfileResponse;
import proto.profile.ProfileModule.EditProfileRequest;
import proto.profile.ProfileModule.EditProfileResponse;
import proto.profile.ProfileModule.ProfileRequest;
import proto.profile.ProfileModule.ProfileResponse;
import proto.profile.ProfileModule.RetrieveProfileRequest;
import proto.profile.ProfileModule.RetrieveProfileResponse;

public class ProfileModuleControllerTest {

  private ProfileModuleController profileModuleController;
  private StudentProfileCreator studentProfileCreator;
  private StudentProfileRetriever studentProfileRetriever;
  private StudentProfileEditor studentProfileEditor;
  private StudentProfileDeleter studentProfileDeleter;
  private FacultyProfileCreator facultyProfileCreator;
  private FacultyProfileEditor facultyProfileEditor;
  private UserService userService;

  @BeforeEach
  void setUp() {
    studentProfileCreator = mock(StudentProfileCreator.class);
    studentProfileRetriever = mock(StudentProfileRetriever.class);
    studentProfileEditor = mock(StudentProfileEditor.class);
    studentProfileDeleter = mock(StudentProfileDeleter.class);
    facultyProfileCreator = mock(FacultyProfileCreator.class);
    facultyProfileEditor = mock(FacultyProfileEditor.class);
    userService = mock(UserService.class);
    profileModuleController =
        new ProfileModuleController(
            studentProfileCreator,
            studentProfileRetriever,
            studentProfileEditor,
            studentProfileDeleter,
            facultyProfileCreator,
            facultyProfileEditor,
            userService);
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
        ProfileResponse.newBuilder()
            .setRetrieveProfileResponse(mockRetrieveProfileResponse)
            .build();

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
  public void testProcessConfig_validRequest_editFaculty_returnsExpectedResult() {
    FacultyProto updatedFaculty =
        FacultyProto.newBuilder()
            .setFirstName("UpdatedFirst")
            .setLastName("UpdatedLast")
            .setEmail("faculty@test.com")
            .addDepartments("Computer Science")
            .build();

    EditProfileRequest editProfileRequest =
        EditProfileRequest.newBuilder()
            .setUserEmail("faculty@test.com")
            .setFacultyProfile(updatedFaculty)
            .build();

    EditProfileResponse mockEditProfileResponse =
        EditProfileResponse.newBuilder()
            .setSuccess(true)
            .setProfileId(2)
            .setEditedFaculty(updatedFaculty)
            .build();

    ProfileRequest profileRequest =
        ProfileRequest.newBuilder().setEditProfileRequest(editProfileRequest).build();
    ProfileResponse mockProfileResponse =
        ProfileResponse.newBuilder().setEditProfileResponse(mockEditProfileResponse).build();

    when(userService.getUserRoleByEmail("faculty@test.com")).thenReturn(UserRole.FACULTY);
    when(facultyProfileEditor.editProfile(editProfileRequest)).thenReturn(mockEditProfileResponse);

    ModuleConfig moduleConfig = ModuleConfig.newBuilder().setProfileRequest(profileRequest).build();
    ModuleResponse response = profileModuleController.processConfig(moduleConfig);

    assertEquals(mockProfileResponse, response.getProfileResponse());
  }

  @Test
  public void testProcessConfig_validRequest_deleteStudent_returnsExpectedResult() {
    String email = "student@test.com";

    DeleteProfileRequest deleteProfileRequest =
        DeleteProfileRequest.newBuilder().setUserEmail(email).build();

    DeleteProfileResponse mockDeleteProfileResponse =
        DeleteProfileResponse.newBuilder().setSuccess(true).setProfileId(1).build();

    ProfileRequest profileRequest =
        ProfileRequest.newBuilder().setDeleteProfileRequest(deleteProfileRequest).build();
    ProfileResponse mockProfileResponse =
        ProfileResponse.newBuilder().setDeleteProfileResponse(mockDeleteProfileResponse).build();

    when(userService.getUserRoleByEmail(email)).thenReturn(UserRole.STUDENT);
    when(studentProfileDeleter.deleteProfile(deleteProfileRequest))
        .thenReturn(mockDeleteProfileResponse);

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
