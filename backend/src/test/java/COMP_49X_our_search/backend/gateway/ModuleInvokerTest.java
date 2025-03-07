package COMP_49X_our_search.backend.gateway;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import COMP_49X_our_search.backend.fetcher.FetcherModuleController;
import COMP_49X_our_search.backend.profile.ProfileModuleController;
import COMP_49X_our_search.backend.project.ProjectModuleController;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import proto.core.Core.ModuleConfig;
import proto.core.Core.ModuleResponse;
import proto.data.Entities.DisciplineProto;
import proto.data.Entities.FacultyProto;
import proto.data.Entities.ProjectProto;
import proto.data.Entities.StudentProto;
import proto.fetcher.DataTypes.DisciplineCollection;
import proto.fetcher.FetcherModule.DirectFetcher;
import proto.fetcher.FetcherModule.DirectType;
import proto.fetcher.FetcherModule.FetcherRequest;
import proto.fetcher.FetcherModule.FetcherResponse;
import proto.profile.ProfileModule.CreateProfileRequest;
import proto.profile.ProfileModule.CreateProfileResponse;
import proto.profile.ProfileModule.ProfileRequest;
import proto.profile.ProfileModule.ProfileResponse;
import proto.project.ProjectModule.CreateProjectRequest;
import proto.project.ProjectModule.CreateProjectResponse;
import proto.project.ProjectModule.ProjectRequest;

public class ModuleInvokerTest {

  private ModuleInvoker moduleInvoker;
  private FetcherModuleController fetcherModuleController;
  private ProfileModuleController profileModuleController;
  private ProjectModuleController projectModuleController;

  @BeforeEach
  void setUp() {
    fetcherModuleController = mock(FetcherModuleController.class);
    profileModuleController = mock(ProfileModuleController.class);
    projectModuleController = mock(ProjectModuleController.class);
    moduleInvoker =
        new ModuleInvoker(
            fetcherModuleController, profileModuleController, projectModuleController);
  }

  @Test
  public void testProcessConfig_validFetcherRequest_returnsExpectedResponse() {
    FetcherRequest mockRequest =
        FetcherRequest.newBuilder()
            .setDirectFetcher(
                DirectFetcher.newBuilder().setDirectType(DirectType.DIRECT_TYPE_DISCIPLINES))
            .build();
    FetcherResponse mockResponse =
        FetcherResponse.newBuilder()
            .setDisciplineCollection(
                DisciplineCollection.newBuilder()
                    .addDisciplines(DisciplineProto.newBuilder().setDisciplineName("Engineering")))
            .build();
    when(fetcherModuleController.processConfig(any(ModuleConfig.class)))
        .thenReturn(ModuleResponse.newBuilder().setFetcherResponse(mockResponse).build());

    ModuleConfig validConfig = ModuleConfig.newBuilder().setFetcherRequest(mockRequest).build();
    ModuleResponse response = moduleInvoker.processConfig(validConfig);

    assertEquals(mockResponse, response.getFetcherResponse());
  }

  @Test
  public void testProcessConfig_validProfileRequest_returnsExpectedResult() {
    CreateProfileRequest mockCreateProfileRequest =
        CreateProfileRequest.newBuilder()
            .setStudentProfile(
                StudentProto.newBuilder()
                    .setFirstName("First")
                    .setLastName("Last")
                    .setEmail("flast@test.com")
                    .setClassStatus("Senior")
                    .setGraduationYear(2025)
                    .addMajors("Computer Science")
                    .addResearchFieldInterests("AI")
                    .addResearchPeriodsInterests("Fall 2025")
                    .setInterestReason("Test reason"))
            .build();

    ProfileRequest mockProfileRequest =
        ProfileRequest.newBuilder().setCreateProfileRequest(mockCreateProfileRequest).build();

    CreateProfileResponse mockProfileResponse =
        CreateProfileResponse.newBuilder().setSuccess(true).setProfileId(1).build();

    when(profileModuleController.processConfig(any(ModuleConfig.class)))
        .thenReturn(
            ModuleResponse.newBuilder()
                .setProfileResponse(
                    ProfileResponse.newBuilder().setCreateProfileResponse(mockProfileResponse))
                .build());

    ModuleConfig validConfig =
        ModuleConfig.newBuilder().setProfileRequest(mockProfileRequest).build();

    ModuleResponse response = moduleInvoker.processConfig(validConfig);

    assertEquals(mockProfileResponse, response.getProfileResponse().getCreateProfileResponse());
  }

  @Test
  public void testProcessConfig_validProjectRequest_returnsExpectedResult() {
    CreateProjectRequest mockCreateProjectRequest =
        CreateProjectRequest.newBuilder()
            .setProject(
                ProjectProto.newBuilder()
                    .setProjectName("My Special Secret Research")
                    .setDescription("This is a test description")
                    .setDesiredQualifications("Must be in the know...")
                    .setIsActive(false)
                    .addAllMajors(List.of("Biomedical Engineering"))
                    .addAllUmbrellaTopics(List.of("The Human Experience"))
                    .addAllResearchPeriods(List.of("Fall 2025"))
                    .setFaculty(FacultyProto.newBuilder().setEmail("faculty@test.com")))
            .build();

    ProjectRequest mockProjectRequest =
        ProjectRequest.newBuilder().setCreateProjectRequest(mockCreateProjectRequest).build();

    CreateProjectResponse mockProjectResponse =
        CreateProjectResponse.newBuilder()
            .setSuccess(true)
            .setProjectId(1)
            .setCreatedProject(mockCreateProjectRequest.getProject())
            .build();

    when(projectModuleController.processConfig(any(ModuleConfig.class)))
        .thenReturn(
            ModuleResponse.newBuilder()
                .setProjectResponse(
                    proto.project.ProjectModule.ProjectResponse.newBuilder()
                        .setCreateProjectResponse(mockProjectResponse))
                .build());

    ModuleConfig validConfig = ModuleConfig.newBuilder().setProjectRequest(mockProjectRequest).build();

    ModuleResponse response = moduleInvoker.processConfig(validConfig);

    assertEquals(mockProjectResponse, response.getProjectResponse().getCreateProjectResponse());
  }


  @Test
  public void testProcessConfig_nullModuleConfig_throwsException() {
    Exception exception =
        assertThrows(
            IllegalArgumentException.class,
            () -> {
              moduleInvoker.processConfig(null);
            });

    assertEquals("ModuleConfig cannot be null.", exception.getMessage());
  }

  @Test
  public void testProcessConfig_missingRequestCase_throwsException() {
    ModuleConfig invalidConfig = ModuleConfig.getDefaultInstance();

    Exception exception =
        assertThrows(
            IllegalArgumentException.class,
            () -> {
              moduleInvoker.processConfig(invalidConfig);
            });

    assertEquals("Request type not set in ModuleConfig", exception.getMessage());
  }
}
