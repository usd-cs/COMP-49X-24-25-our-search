package COMP_49X_our_search.backend.fetcher;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import proto.core.Core.ModuleConfig;
import proto.core.Core.ModuleResponse;
import proto.data.Entities.DepartmentProto;
import proto.data.Entities.FacultyProto;
import proto.data.Entities.MajorProto;
import proto.data.Entities.ProjectProto;
import proto.fetcher.DataTypes.DepartmentCollection;
import proto.fetcher.DataTypes.DepartmentWithMajors;
import proto.fetcher.DataTypes.MajorWithProjects;
import proto.fetcher.DataTypes.ProjectHierarchy;
import proto.fetcher.FetcherModule.DirectFetcher;
import proto.fetcher.FetcherModule.DirectType;
import proto.fetcher.FetcherModule.FetcherRequest;
import proto.fetcher.FetcherModule.FetcherResponse;
import proto.fetcher.FetcherModule.FilteredFetcher;
import proto.fetcher.FetcherModule.FilteredType;

public class FetcherModuleControllerTest {

    private FetcherModuleController fetcherModuleController;
    private DepartmentFetcher departmentFetcher;
    private ProjectFetcher projectFetcher;

    @BeforeEach
    void setUp() {
        departmentFetcher = mock(DepartmentFetcher.class);
        projectFetcher = mock(ProjectFetcher.class);
        fetcherModuleController =
                new FetcherModuleController(departmentFetcher, projectFetcher);
    }

    @Test
    public void testProcessConfig_validRequest_directType_returnsExpectedResponse() {
        FetcherRequest mockRequest = FetcherRequest.newBuilder()
                .setDirectFetcher(DirectFetcher.newBuilder()
                        .setDirectType(DirectType.DEPARTMENTS))
                .build();

        FetcherResponse mockResponse =
                FetcherResponse.newBuilder()
                        .setDepartmentCollection(DepartmentCollection
                                .newBuilder()
                                .addDepartments(DepartmentProto.newBuilder()
                                        .setDepartmentName("Engineering")))
                        .build();
        when(departmentFetcher.fetch(mockRequest)).thenReturn(mockResponse);

        ModuleConfig moduleConfig = ModuleConfig.newBuilder()
                .setFetcherRequest(mockRequest).build();

        ModuleResponse response =
                fetcherModuleController.processConfig(moduleConfig);
        assertEquals(mockResponse, response.getFetcherResponse());
    }

    @Test
    public void testProcessConfig_validRequest_filteredType_returnsExpectedResponse() {
        FetcherRequest mockRequest =
                FetcherRequest.newBuilder()
                        .setFilteredFetcher(FilteredFetcher.newBuilder()
                                .setFilteredType(FilteredType.PROJECTS))
                        .build();

        MajorWithProjects majorWithProjects = MajorWithProjects.newBuilder()
                .setMajor(MajorProto.newBuilder()
                        .setMajorName("Computer Science"))
                .addProjects(ProjectProto.newBuilder().setProjectId(1)
                        .setProjectName("Project Name")
                        .setDescription("Project Description")
                        .setDesiredQualifications("Project Qualifications")
                        .setIsActive(true).addMajors("Computer Science")
                        .addUmbrellaTopics("AI").addResearchPeriods("Fall 2025")
                        .setFaculty(FacultyProto.newBuilder()
                                .setFirstName("Dr.").setLastName("Faculty")
                                .setEmail("faculty@test.com")))
                .build();

        DepartmentWithMajors departmentWithMajors =
                DepartmentWithMajors.newBuilder()
                        .setDepartment(DepartmentProto.newBuilder()
                                .setDepartmentName("Engineering"))
                        .addMajors(majorWithProjects).build();

        FetcherResponse mockResponse = FetcherResponse.newBuilder()
                .setProjectHierarchy(ProjectHierarchy.newBuilder()
                        .addDepartments(departmentWithMajors))
                .build();

        when(projectFetcher.fetch(mockRequest)).thenReturn(mockResponse);

        ModuleConfig moduleConfig = ModuleConfig.newBuilder()
                .setFetcherRequest(mockRequest).build();

        ModuleResponse response =
                fetcherModuleController.processConfig(moduleConfig);
        assertEquals(mockResponse, response.getFetcherResponse());
    }

    @Test
    public void testProcessConfig_missingFetcherRequest_throwsException() {
        ModuleConfig invalidConfig = ModuleConfig.getDefaultInstance();

        Exception exception =
                assertThrows(IllegalArgumentException.class, () -> {
                    fetcherModuleController.processConfig(invalidConfig);
                });
        assertEquals("ModuleConfig does not contain a FetcherRequest.",
                exception.getMessage());
    }

    @Test
    public void testProcessConfig_unsupportedFetcherType_throwsException() {
        FetcherRequest invalidRequest = FetcherRequest.newBuilder().build();
        ModuleConfig moduleConfig = ModuleConfig.newBuilder()
                .setFetcherRequest(invalidRequest).build();

        Exception exception =
                assertThrows(UnsupportedOperationException.class, () -> {
                    fetcherModuleController.processConfig(moduleConfig);
                });

        assertEquals("Unsupported FetcherType: FETCHERTYPE_NOT_SET",
                exception.getMessage());
    }
}
