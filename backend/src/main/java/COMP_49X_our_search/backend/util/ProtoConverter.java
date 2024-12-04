package COMP_49X_our_search.backend.util;

import COMP_49X_our_search.backend.database.entities.Department;
import COMP_49X_our_search.backend.database.entities.Faculty;
import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.entities.Project;
import COMP_49X_our_search.backend.database.entities.ResearchPeriod;
import COMP_49X_our_search.backend.database.entities.UmbrellaTopic;
import proto.data.Entities.DepartmentProto;
import proto.data.Entities.FacultyProto;
import proto.data.Entities.MajorProto;
import proto.data.Entities.ProjectProto;

public class ProtoConverter {
  private ProtoConverter() {}

  public static DepartmentProto toDepartmentProto(Department department) {
    return DepartmentProto.newBuilder()
        .setDepartmentId(department.getId())
        .setDepartmentName(department.getName())
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

  public static FacultyProto toFacultyProto(Faculty faculty) {
    return FacultyProto.newBuilder()
        .setFirstName(faculty.getFirstName())
        .setLastName(faculty.getLastName())
        .setEmail(faculty.getEmail())
        .build();
  }
}
