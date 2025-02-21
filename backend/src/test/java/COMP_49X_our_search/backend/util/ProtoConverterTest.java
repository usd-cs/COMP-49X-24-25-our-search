package COMP_49X_our_search.backend.util;

import static COMP_49X_our_search.backend.util.ProtoConverter.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

import COMP_49X_our_search.backend.database.entities.Department;
import COMP_49X_our_search.backend.database.entities.Discipline;
import COMP_49X_our_search.backend.database.entities.Faculty;
import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.entities.Project;
import COMP_49X_our_search.backend.database.entities.ResearchPeriod;
import COMP_49X_our_search.backend.database.entities.Student;
import COMP_49X_our_search.backend.database.entities.UmbrellaTopic;
import java.util.Set;
import org.junit.jupiter.api.Test;
import proto.data.Entities.DepartmentProto;
import proto.data.Entities.DisciplineProto;
import proto.data.Entities.FacultyProto;
import proto.data.Entities.MajorProto;
import proto.data.Entities.ProjectProto;
import proto.data.Entities.StudentProto;

public class ProtoConverterTest {

  @Test
  public void testToDepartmentProto_returnsExpectedResult() {
    Department departmentEntity = new Department();
    departmentEntity.setId(1);
    departmentEntity.setName("Engineering");

    DepartmentProto expected =
        DepartmentProto.newBuilder().setDepartmentId(1).setDepartmentName("Engineering").build();
    DepartmentProto result = toDepartmentProto(departmentEntity);

    assertEquals(expected, result, "DepartmentProto messages are not equal");
  }

  @Test
  public void testToMajorProto_returnsExpectedResult() {
    Major majorEntity = new Major();
    majorEntity.setId(1);
    majorEntity.setName("Computer Science");

    MajorProto expected =
        MajorProto.newBuilder().setMajorId(1).setMajorName("Computer Science").build();
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

    ProjectProto expected =
        ProjectProto.newBuilder()
            .setProjectId(1)
            .setProjectName("Project")
            .setDescription("Project description")
            .setDesiredQualifications("Project qualifications")
            .setIsActive(true)
            .addMajors("Computer Science")
            .addUmbrellaTopics("AI")
            .addResearchPeriods("Fall 2025")
            .setFaculty(
                FacultyProto.newBuilder()
                    .setFirstName("Dr.")
                    .setLastName("Faculty")
                    .setEmail("faculty@test.com"))
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

    FacultyProto expected =
        FacultyProto.newBuilder()
            .setFirstName("Dr.")
            .setLastName("Faculty")
            .setEmail("faculty@test.com")
            .build();
    FacultyProto result = toFacultyProto(facultyEntity);

    assertEquals(expected, result, "FacultyProto messages are not equal");
  }

  @Test
  public void testToDisciplineProto_returnsExpectedResult() {
    Discipline disciplineEntity = new Discipline();
    disciplineEntity.setId(1);
    disciplineEntity.setName("Engineering");

    DisciplineProto expected =
        DisciplineProto.newBuilder().setDisciplineId(1).setDisciplineName("Engineering").build();
    DisciplineProto result = toDisciplineProto(disciplineEntity);

    assertEquals(expected, result, "DisciplineProto messages are not equal");
  }

  @Test
  public void testToStudentProto_returnsExpectedResult() {
    Major csMajor = new Major();
    csMajor.setId(1);
    csMajor.setName("Computer Science");

    ResearchPeriod researchPeriod = new ResearchPeriod();
    researchPeriod.setName("Fall 2025");

    Student studentEntity = new Student();
    studentEntity.setFirstName("John");
    studentEntity.setLastName("Doe");
    studentEntity.setEmail("john.doe@example.com");
    studentEntity.setUndergradYear(3);
    studentEntity.setGraduationYear(2025);
    studentEntity.setMajors(Set.of(csMajor));
    studentEntity.setResearchFieldInterests(Set.of(csMajor));
    studentEntity.setResearchPeriods(Set.of(researchPeriod));
    studentEntity.setInterestReason("Interested in AI research");
    studentEntity.setHasPriorExperience(true);
    studentEntity.setIsActive(true);

    StudentProto expected =
        StudentProto.newBuilder()
            .setFirstName("John")
            .setLastName("Doe")
            .setEmail("john.doe@example.com")
            .setClassStatus("Junior")
            .setGraduationYear(2025)
            .addMajors("Computer Science")
            .addResearchFieldInterests("Computer Science")
            .addResearchPeriodsInterests("Fall 2025")
            .setInterestReason("Interested in AI research")
            .setHasPriorExperience(true)
            .setIsActive(true)
            .build();

    StudentProto result = toStudentProto(studentEntity);

    assertEquals(expected, result, "StudentProto messages are not equal");
  }
}
