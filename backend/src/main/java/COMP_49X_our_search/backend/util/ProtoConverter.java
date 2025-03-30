/**
 * Utility class for converting database entity objects into their corresponding protobuf
 * representations.
 *
 * <p>Supported Conversions: - Department -> DepartmentProto - Discipline -> DisciplineProto - Major
 * -> MajorProto - Project -> ProjectProto - Student -> StudentProto - Faculty -> FacultyProto
 *
 * <p>Cannot be instantiated, o`nly contains static methods.
 *
 * @author Augusto Escudero
 */
package COMP_49X_our_search.backend.util;

import COMP_49X_our_search.backend.database.entities.Department;
import COMP_49X_our_search.backend.database.entities.Discipline;
import COMP_49X_our_search.backend.database.entities.Faculty;
import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.entities.Project;
import COMP_49X_our_search.backend.database.entities.ResearchPeriod;
import COMP_49X_our_search.backend.database.entities.Student;
import COMP_49X_our_search.backend.database.entities.UmbrellaTopic;
import proto.data.Entities.DepartmentProto;
import proto.data.Entities.DisciplineProto;
import proto.data.Entities.FacultyProto;
import proto.data.Entities.MajorProto;
import proto.data.Entities.ProjectProto;
import proto.data.Entities.StudentProto;

public class ProtoConverter {
  private ProtoConverter() {}

  public static DepartmentProto toDepartmentProto(Department department) {
    return DepartmentProto.newBuilder()
        .setDepartmentId(department.getId())
        .setDepartmentName(department.getName())
        .build();
  }

  public static DisciplineProto toDisciplineProto(Discipline discipline) {
    return DisciplineProto.newBuilder()
        .setDisciplineId(discipline.getId())
        .setDisciplineName(discipline.getName())
        .build();
  }

  public static MajorProto toMajorProto(Major major) {
    return MajorProto.newBuilder().setMajorId(major.getId()).setMajorName(major.getName()).build();
  }

  public static ProjectProto toProjectProto(Project project) {
    return ProjectProto.newBuilder()
        .setProjectId(project.getId())
        .setProjectName(project.getName())
        .setDescription(project.getDescription())
        .setDesiredQualifications(project.getDesiredQualifications())
        .setIsActive(project.getIsActive())
        .addAllMajors(project.getMajors().stream().map(Major::getName).toList())
        .addAllUmbrellaTopics(
            project.getUmbrellaTopics().stream().map(UmbrellaTopic::getName).toList())
        .addAllResearchPeriods(
            project.getResearchPeriods().stream().map(ResearchPeriod::getName).toList())
        .setFaculty(toFacultyProto(project.getFaculty()))
        .build();
  }

  public static StudentProto toStudentProto(Student student) {
    return StudentProto.newBuilder()
        .setStudentId(student.getId())
        .setFirstName(student.getFirstName())
        .setLastName(student.getLastName())
        .setEmail(student.getEmail())
        .setClassStatus(getClassStatus(student.getUndergradYear()))
        .setGraduationYear(student.getGraduationYear())
        .addAllMajors(student.getMajors().stream().map(Major::getName).sorted().toList())
        .addAllResearchFieldInterests(
            student.getResearchFieldInterests().stream().map(Major::getName).sorted().toList())
        .addAllResearchPeriodsInterests(
            student.getResearchPeriods().stream().map(ResearchPeriod::getName).sorted().toList())
        .setInterestReason(student.getInterestReason())
        .setHasPriorExperience(student.getHasPriorExperience())
        .setIsActive(student.getIsActive())
        .build();
  }

  public static FacultyProto toFacultyProto(Faculty faculty) {
    return FacultyProto.newBuilder()
        .setFirstName(faculty.getFirstName())
        .setLastName(faculty.getLastName())
        .setEmail(faculty.getEmail())
        .addAllDepartments(faculty.getDepartments().stream().map(Department::getName).sorted().toList())
        .setFacultyId(faculty.getId())
        .build();
  }

  private static String getClassStatus(Integer undergradYear) {
    switch (undergradYear) {
      case 1:
        return "Freshman";
      case 2:
        return "Sophomore";
      case 3:
        return "Junior";
      case 4:
        return "Senior";
      case 5:
        return "Fifth Year";
      default:
        return "Unknown";
    }
  }
}
