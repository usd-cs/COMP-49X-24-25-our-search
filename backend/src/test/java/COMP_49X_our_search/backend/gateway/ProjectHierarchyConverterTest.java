package COMP_49X_our_search.backend.gateway;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import COMP_49X_our_search.backend.gateway.dto.DisciplineDTO;
import COMP_49X_our_search.backend.gateway.dto.MajorDTO;
import COMP_49X_our_search.backend.gateway.dto.ProjectDTO;
import COMP_49X_our_search.backend.gateway.util.ProjectHierarchyConverter;
import java.util.List;
import org.junit.jupiter.api.Test;
import proto.data.Entities.DisciplineProto;
import proto.data.Entities.MajorProto;
import proto.data.Entities.ProjectProto;
import proto.fetcher.DataTypes.DisciplineWithMajors;
import proto.fetcher.DataTypes.MajorWithEntityCollection;
import proto.fetcher.DataTypes.ProjectCollection;

public class ProjectHierarchyConverterTest {

  @Test
  public void testProtoDisciplineWithMajorsToDto_returnsExpectedResult() {
    ProjectProto projectProto =
        ProjectProto.newBuilder()
            .setProjectId(1)
            .setProjectName("AI Research")
            .setDescription("Research in artificial intelligence")
            .setDesiredQualifications("Python, ML Basics")
            .addUmbrellaTopics("AI")
            .addResearchPeriods("Fall 2024")
            .setIsActive(true)
            .addMajors("Computer Science")
            .build();

    MajorWithEntityCollection majorProto =
        MajorWithEntityCollection.newBuilder()
            .setMajor(
                MajorProto.newBuilder().setMajorId(101).setMajorName("Computer Science").build())
            .setProjectCollection(ProjectCollection.newBuilder().addProjects(projectProto))
            .build();

    DisciplineWithMajors disciplineProto =
        DisciplineWithMajors.newBuilder()
            .setDiscipline(
                DisciplineProto.newBuilder()
                    .setDisciplineId(201)
                    .setDisciplineName("Engineering")
                    .build())
            .addMajors(majorProto)
            .build();

    DisciplineDTO disciplineDTO =
        ProjectHierarchyConverter.protoDisciplineWithMajorsToDto(disciplineProto);

    assertNotNull(disciplineDTO);
    assertEquals(201, disciplineDTO.getId());
    assertEquals("Engineering", disciplineDTO.getName());
    assertEquals(1, disciplineDTO.getMajors().size());

    MajorDTO majorDTO = disciplineDTO.getMajors().get(0);
    assertEquals(101, majorDTO.getId());
    assertEquals("Computer Science", majorDTO.getName());
    assertEquals(1, majorDTO.getPosts().size());

    ProjectDTO projectDTO = (ProjectDTO) majorDTO.getPosts().getFirst();
    assertEquals(1, projectDTO.getId());
    assertEquals("AI Research", projectDTO.getName());
    assertEquals("Research in artificial intelligence", projectDTO.getDescription());
    assertEquals("Python, ML Basics", projectDTO.getDesiredQualifications());
    assertEquals(List.of("AI"), projectDTO.getUmbrellaTopics());
    assertEquals(List.of("Fall 2024"), projectDTO.getResearchPeriods());
    assertTrue(projectDTO.getIsActive());
    assertEquals(List.of("Computer Science"), projectDTO.getMajors());
  }
}
