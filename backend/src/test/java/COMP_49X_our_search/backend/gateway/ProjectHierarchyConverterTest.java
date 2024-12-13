package COMP_49X_our_search.backend.gateway;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import COMP_49X_our_search.backend.gateway.dto.DepartmentDTO;
import COMP_49X_our_search.backend.gateway.dto.MajorDTO;
import COMP_49X_our_search.backend.gateway.dto.ProjectDTO;
import COMP_49X_our_search.backend.gateway.util.ProjectHierarchyConverter;
import java.util.List;
import org.junit.jupiter.api.Test;
import proto.data.Entities.DepartmentProto;
import proto.data.Entities.MajorProto;
import proto.data.Entities.ProjectProto;
import proto.fetcher.DataTypes.DepartmentWithMajors;
import proto.fetcher.DataTypes.MajorWithProjects;

public class ProjectHierarchyConverterTest {

        @Test
        public void testProtoDepartmentWithMajorsToDto_returnsExpectedResult() {
                ProjectProto projectProto = ProjectProto.newBuilder()
                                .setProjectId(1).setProjectName("AI Research")
                                .setDescription("Research in artificial intelligence")
                                .setDesiredQualifications("Python, ML Basics")
                                .addUmbrellaTopics("AI")
                                .addResearchPeriods("Fall 2024")
                                .setIsActive(true).addMajors("Computer Science")
                                .build();

                MajorWithProjects majorProto = MajorWithProjects.newBuilder()
                                .setMajor(MajorProto.newBuilder()
                                                .setMajorId(101)
                                                .setMajorName("Computer Science")
                                                .build())
                                .addProjects(projectProto).build();

                DepartmentWithMajors departmentProto = DepartmentWithMajors
                                .newBuilder()
                                .setDepartment(DepartmentProto.newBuilder()
                                                .setDepartmentId(201)
                                                .setDepartmentName(
                                                                "Engineering")
                                                .build())
                                .addMajors(majorProto).build();

                DepartmentDTO departmentDTO = ProjectHierarchyConverter
                                .protoDepartmentWithMajorsToDto(
                                                departmentProto);

                assertNotNull(departmentDTO);
                assertEquals(201, departmentDTO.getId());
                assertEquals("Engineering", departmentDTO.getName());
                assertEquals(1, departmentDTO.getMajors().size());

                MajorDTO majorDTO = departmentDTO.getMajors().get(0);
                assertEquals(101, majorDTO.getId());
                assertEquals("Computer Science", majorDTO.getName());
                assertEquals(1, majorDTO.getPosts().size());

                ProjectDTO projectDTO = majorDTO.getPosts().get(0);
                assertEquals(1, projectDTO.getId());
                assertEquals("AI Research", projectDTO.getName());
                assertEquals("Research in artificial intelligence",
                                projectDTO.getDescription());
                assertEquals("Python, ML Basics",
                                projectDTO.getDesiredQualifications());
                assertEquals(List.of("AI"), projectDTO.getUmbrellaTopics());
                assertEquals(List.of("Fall 2024"),
                                projectDTO.getResearchPeriods());
                assertTrue(projectDTO.getIsActive());
                assertEquals(List.of("Computer Science"),
                                projectDTO.getMajors());
        }
}
