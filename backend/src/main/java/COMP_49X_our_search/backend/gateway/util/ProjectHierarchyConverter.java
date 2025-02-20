package COMP_49X_our_search.backend.gateway.util;

import COMP_49X_our_search.backend.gateway.dto.DisciplineDTO;
import COMP_49X_our_search.backend.gateway.dto.FacultyDTO;
import COMP_49X_our_search.backend.gateway.dto.MajorDTO;
import COMP_49X_our_search.backend.gateway.dto.ProjectDTO;
import COMP_49X_our_search.backend.gateway.dto.ProjectHierarchyDTO;
import java.util.ArrayList;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;
import proto.data.Entities.FacultyProto;
import proto.data.Entities.ProjectProto;
import proto.fetcher.DataTypes.DisciplineWithMajors;
import proto.fetcher.DataTypes.MajorWithProjects;
import proto.fetcher.DataTypes.ProjectHierarchy;

@Component
public final class ProjectHierarchyConverter {

  private ProjectHierarchyConverter() {}

  // TODO(@acescudero): Unused for now, /projects response format expects a list
  // of DepartmentDTO.
  private static ProjectHierarchyDTO protoProjectHierarchyToDto(
      ProjectHierarchy proto) {
    ProjectHierarchyDTO dto = new ProjectHierarchyDTO();
    dto.setDisciplines(proto.getDisciplinesList().stream()
        .map(ProjectHierarchyConverter::protoDisciplineWithMajorsToDto)
        .collect(Collectors.toList()));
    return dto;
  }

  public static DisciplineDTO protoDisciplineWithMajorsToDto(
      DisciplineWithMajors proto) {
    DisciplineDTO dto = new DisciplineDTO();
    dto.setId(proto.getDiscipline().getDisciplineId());
    dto.setName(proto.getDiscipline().getDisciplineName());
    dto.setMajors(proto.getMajorsList().stream()
        .map(ProjectHierarchyConverter::protoMajorWithProjectsToMajorDto)
        .collect(Collectors.toList()));
    return dto;
  }

  private static MajorDTO protoMajorWithProjectsToMajorDto(
      MajorWithProjects proto) {
    MajorDTO dto = new MajorDTO();
    dto.setId(proto.getMajor().getMajorId());
    dto.setName(proto.getMajor().getMajorName());
    dto.setPosts(proto.getProjectsList().stream()
        .map(ProjectHierarchyConverter::protoProjectToProjectDto)
        .collect(Collectors.toList()));
    return dto;
  }

  private static ProjectDTO protoProjectToProjectDto(ProjectProto proto) {
    ProjectDTO dto = new ProjectDTO();
    dto.setId(proto.getProjectId());
    dto.setName(proto.getProjectName());
    dto.setDescription(proto.getDescription());
    dto.setDesiredQualifications(proto.getDesiredQualifications());
    dto.setUmbrellaTopics(new ArrayList<>(proto.getUmbrellaTopicsList()));
    dto.setResearchPeriods(new ArrayList<>(proto.getResearchPeriodsList()));
    dto.setIsActive(proto.getIsActive());
    dto.setMajors(new ArrayList<>(proto.getMajorsList()));
    dto.setFaculty(protoFacultyToFacultyDto(proto.getFaculty()));
    return dto;
  }

  private static FacultyDTO protoFacultyToFacultyDto(FacultyProto proto) {
    FacultyDTO dto = new FacultyDTO();
    dto.setFirstName(proto.getFirstName());
    dto.setLastName(proto.getLastName());
    dto.setEmail(proto.getEmail());
    return dto;
  }
}
