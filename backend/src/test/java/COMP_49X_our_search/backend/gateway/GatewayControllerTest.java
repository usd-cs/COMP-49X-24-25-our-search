package COMP_49X_our_search.backend.gateway;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import proto.core.Core.ModuleConfig;
import proto.core.Core.ModuleResponse;
import proto.data.Entities.DepartmentProto;
import proto.data.Entities.FacultyProto;
import proto.data.Entities.MajorProto;
import proto.data.Entities.ProjectProto;
import proto.fetcher.DataTypes.DepartmentWithMajors;
import proto.fetcher.DataTypes.MajorWithProjects;
import proto.fetcher.DataTypes.ProjectHierarchy;
import proto.fetcher.FetcherModule.FetcherResponse;

@WebMvcTest(GatewayController.class)
public class GatewayControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private ModuleInvoker moduleInvoker;

  private ModuleResponse mockModuleResponse;

  @BeforeEach
  void setUp() {
    FacultyProto faculty =
        FacultyProto.newBuilder()
            .setFirstName("Dr.")
            .setLastName("Faculty")
            .setEmail("faculty@test.com")
            .build();

    ProjectProto project =
        ProjectProto.newBuilder()
            .setProjectId(1)
            .setProjectName("AI Project")
            .setDescription("Research in AI and Machine Learning")
            .setDesiredQualifications("Knowledge of ML and basic AI algorithms")
            .setIsActive(true)
            .addMajors("Computer Science")
            .addUmbrellaTopics("AI")
            .addResearchPeriods("Fall 2025")
            .setFaculty(faculty)
            .build();

    MajorProto major =
        MajorProto.newBuilder().setMajorId(1).setMajorName("Computer Science").build();

    MajorWithProjects majorWithProjects =
        MajorWithProjects.newBuilder().setMajor(major).addProjects(project).build();

    DepartmentProto department =
        DepartmentProto.newBuilder().setDepartmentId(1).setDepartmentName("Engineering").build();

    DepartmentWithMajors departmentWithMajors =
        DepartmentWithMajors.newBuilder()
            .setDepartment(department)
            .addMajors(majorWithProjects)
            .build();

    ProjectHierarchy projectHierarchy =
        ProjectHierarchy.newBuilder().addDepartments(departmentWithMajors).build();

    mockModuleResponse =
        ModuleResponse.newBuilder()
            .setFetcherResponse(FetcherResponse.newBuilder().setProjectHierarchy(projectHierarchy))
            .build();
  }

  @Test
  void getProjects_returnsExpectedResult() throws Exception {
    when(moduleInvoker.processConfig(org.mockito.ArgumentMatchers.any(ModuleConfig.class)))
        .thenReturn(mockModuleResponse);

    mockMvc.perform(get("/projects"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$[0].id").value(1))
           .andExpect(jsonPath("$[0].name").value("Engineering"))
           .andExpect(jsonPath("$[0].majors[0].id").value(1))
           .andExpect(jsonPath("$[0].majors[0].name").value("Computer Science"))
           .andExpect(jsonPath("$[0].majors[0].posts[0].id").value(1))
           .andExpect(jsonPath("$[0].majors[0].posts[0].name").value("AI Project"))
           .andExpect(jsonPath("$[0].majors[0].posts[0].description").value("Research in AI and Machine Learning"))
           .andExpect(jsonPath("$[0].majors[0].posts[0].desiredQualifications").value("Knowledge of ML and basic AI algorithms"))
           .andExpect(jsonPath("$[0].majors[0].posts[0].isActive").value(true))
           .andExpect(jsonPath("$[0].majors[0].posts[0].majors[0]").value("Computer Science"))
           .andExpect(jsonPath("$[0].majors[0].posts[0].umbrellaTopics[0]").value("AI"))
           .andExpect(jsonPath("$[0].majors[0].posts[0].researchPeriods[0]").value("Fall 2025"))
           .andExpect(jsonPath("$[0].majors[0].posts[0].faculty.firstName").value("Dr."))
           .andExpect(jsonPath("$[0].majors[0].posts[0].faculty.lastName").value("Faculty"))
           .andExpect(jsonPath("$[0].majors[0].posts[0].faculty.email").value("faculty@test.com"));
  }
}
