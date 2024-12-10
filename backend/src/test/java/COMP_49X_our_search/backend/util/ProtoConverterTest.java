package COMP_49X_our_search.backend.util;

import static COMP_49X_our_search.backend.util.ProtoConverter.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

import COMP_49X_our_search.backend.database.entities.Department;
import COMP_49X_our_search.backend.database.entities.Faculty;
import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.entities.Project;
import COMP_49X_our_search.backend.database.entities.ResearchPeriod;
import COMP_49X_our_search.backend.database.entities.UmbrellaTopic;
import java.util.Set;
import org.junit.jupiter.api.Test;
import proto.data.Entities.DepartmentProto;
import proto.data.Entities.FacultyProto;
import proto.data.Entities.MajorProto;
import proto.data.Entities.ProjectProto;

public class ProtoConverterTest {

  @Test
  public void testToDepartmentProto_returnsExpectedResult() {
    Department departmentEntity = new Department();
    departmentEntity.setId(1);
    departmentEntity.setName("Engineering");

    DepartmentProto expected = DepartmentProto.newBuilder().setDepartmentId(1)
        .setDepartmentName("Engineering").build();
    DepartmentProto result = toDepartmentProto(departmentEntity);

    assertEquals(expected, result, "DepartmentProto messages are not equal");
  }

  @Test
  public void testToMajorProto_returnsExpectedResult() {
    Major majorEntity = new Major();
    majorEntity.setId(1);
    majorEntity.setName("Computer Science");

    MajorProto expected = MajorProto.newBuilder().setMajorId(1)
        .setMajorName("Computer Science").build();
    MajorProto result = toMajorProto(majorEntity);

    assertEquals(expected, result, "MajorProto messages are not equal");
  }

  @Test
  public void testToProjectProto_returnsExpectedResult() {
    Major majorEntity = new Major();
    majorEntity.setId(1);
    majorEntity.setName("Computer Science");

    UmbrellaTopic umbrellaTopicEntity = new UmbrellaTopic();
    umbrellaTopicEntity.setName("AI");

    ResearchPeriod researchPeriodEntity = new ResearchPeriod();
    researchPeriodEntity.setName("Fall 2025");

    Faculty facultyEntity = new Faculty();
    facultyEntity.setFirstName("Dr.");
    facultyEntity.setLastName("Faculty");
    facultyEntity.setEmail("faculty@test.com");

    Project projectEntity = new Project();
    projectEntity.setId(1);
    projectEntity.setName("Project");
    projectEntity.setDescription("Project description");
    projectEntity.setDesiredQualifications("Project qualifications");
    projectEntity.setIsActive(true);
    projectEntity.setMajors(Set.of(majorEntity));
    projectEntity.setUmbrellaTopics(Set.of(umbrellaTopicEntity));
    projectEntity.setResearchPeriods(Set.of(researchPeriodEntity));
    projectEntity.setFaculty(facultyEntity);

    ProjectProto expected = ProjectProto.newBuilder().setProjectId(1)
        .setProjectName("Project").setDescription("Project description")
        .setDesiredQualifications("Project qualifications").setIsActive(true)
        .addMajors("Computer Science").addUmbrellaTopics("AI")
        .addResearchPeriods("Fall 2025")
        .setFaculty(FacultyProto.newBuilder().setFirstName("Dr.")
            .setLastName("Faculty").setEmail("faculty@test.com"))
        .build();
    ProjectProto result = toProjectProto(projectEntity);

    assertEquals(expected, result, "ProjectProto messages are not equal");
  }

  @Test
  public void testToFacultyProto_returnsExpectedResult() {
    Faculty facultyEntity = new Faculty();
    facultyEntity.setFirstName("Dr.");
    facultyEntity.setLastName("Faculty");
    facultyEntity.setEmail("faculty@test.com");

    FacultyProto expected = FacultyProto.newBuilder().setFirstName("Dr.")
        .setLastName("Faculty").setEmail("faculty@test.com").build();
    FacultyProto result = toFacultyProto(facultyEntity);

    assertEquals(expected, result, "FacultyProto messages are not equal");
  }
}
