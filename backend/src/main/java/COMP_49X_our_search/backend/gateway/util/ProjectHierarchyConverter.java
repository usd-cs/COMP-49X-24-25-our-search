/**
 * Utility class for converting Protobuf project hierarchy data into DTOs for use in the frontend.
 *
 * @author Augusto Escudero
 */
package COMP_49X_our_search.backend.gateway.util;

import COMP_49X_our_search.backend.gateway.dto.DepartmentDTO;
import COMP_49X_our_search.backend.gateway.dto.DisciplineDTO;
import COMP_49X_our_search.backend.gateway.dto.FacultyDTO;
import COMP_49X_our_search.backend.gateway.dto.MajorDTO;
import COMP_49X_our_search.backend.gateway.dto.ProjectDTO;
import COMP_49X_our_search.backend.gateway.dto.ProjectHierarchyDTO;
import COMP_49X_our_search.backend.gateway.dto.StudentDTO;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;
import proto.data.Entities.DepartmentProto;
import proto.data.Entities.FacultyProto;
import proto.data.Entities.ProjectProto;
import proto.data.Entities.StudentProto;
import proto.fetcher.DataTypes.DepartmentWithFaculty;
import proto.fetcher.DataTypes.DisciplineWithMajors;
import proto.fetcher.DataTypes.MajorWithEntityCollection;
import proto.fetcher.DataTypes.ProjectHierarchy;

@Component
public final class ProjectHierarchyConverter {

  private ProjectHierarchyConverter() {}

  // TODO(@acescudero): Unused for now, /projects response format expects a list
  // of DepartmentDTO.
  private static ProjectHierarchyDTO protoProjectHierarchyToDto(ProjectHierarchy proto) {
    ProjectHierarchyDTO dto = new ProjectHierarchyDTO();
    dto.setDisciplines(
        proto.getDisciplinesList().stream()
            .map(ProjectHierarchyConverter::protoDisciplineWithMajorsToDto)
            .collect(Collectors.toList()));
    return dto;
  }

  public static DisciplineDTO protoDisciplineWithMajorsToDto(DisciplineWithMajors proto) {
    DisciplineDTO dto = new DisciplineDTO();
    dto.setId(proto.getDiscipline().getDisciplineId());
    dto.setName(proto.getDiscipline().getDisciplineName());
    if (proto.getMajorsList().getFirst().hasProjectCollection()) { // Has Project collection
      dto.setMajors(
          proto.getMajorsList().stream()
              .map(ProjectHierarchyConverter::protoMajorWithProjectsToMajorDto)
              .collect(Collectors.toList()));
      return dto;
    } else { // Has StudentCollection
      dto.setMajors(
          proto.getMajorsList().stream()
              .map(ProjectHierarchyConverter::protoMajorWithStudentsToMajorDto)
              .collect(Collectors.toList()));
      return dto;
    }
  }

  public static DepartmentDTO protoDepartmentWithFacultyToDto(
      DepartmentWithFaculty departmentWithFacultyProto) {
    DepartmentDTO departmentDTO = new DepartmentDTO();
    departmentDTO.setId(departmentWithFacultyProto.getDepartment().getDepartmentId());
    departmentDTO.setName(departmentWithFacultyProto.getDepartment().getDepartmentName());

    List<FacultyDTO> facultyDTOs =
        departmentWithFacultyProto.getFacultyWithProjectsList().stream()
            .map(
                facultyWithProjects -> {
                  FacultyDTO facultyDTO = new FacultyDTO();
                  FacultyProto facultyProto = facultyWithProjects.getFaculty();

                  facultyDTO.setId(facultyProto.getFacultyId());
                  facultyDTO.setFirstName(facultyProto.getFirstName());
                  facultyDTO.setLastName(facultyProto.getLastName());
                  facultyDTO.setEmail(facultyProto.getEmail());
                  facultyDTO.setDepartment(new ArrayList<>(facultyProto.getDepartmentsList()));

                  List<ProjectDTO> projectDTOs =
                      facultyWithProjects.getProjectsList().stream()
                          .map(
                              projectProto -> {
                                ProjectDTO projectDTO = new ProjectDTO();
                                projectDTO.setId(projectProto.getProjectId());
                                projectDTO.setName(projectProto.getProjectName());
                                projectDTO.setDescription(projectProto.getDescription());
                                projectDTO.setDesiredQualifications(
                                    projectProto.getDesiredQualifications());
                                projectDTO.setIsActive(projectProto.getIsActive());
                                projectDTO.setMajors(new ArrayList<>(projectProto.getMajorsList()));
                                projectDTO.setUmbrellaTopics(
                                    new ArrayList<>(projectProto.getUmbrellaTopicsList()));
                                projectDTO.setResearchPeriods(
                                    new ArrayList<>(projectProto.getResearchPeriodsList()));

                                return projectDTO;
                              })
                          .collect(Collectors.toList());

                  facultyDTO.setProjects(projectDTOs);
                  return facultyDTO;
                })
            .collect(Collectors.toList());

    departmentDTO.setFaculty(facultyDTOs);

    departmentDTO.setMajors(new ArrayList<>());

    return departmentDTO;
  }

  private static MajorDTO protoMajorWithStudentsToMajorDto(MajorWithEntityCollection proto) {
    MajorDTO dto = new MajorDTO();
    dto.setId(proto.getMajor().getMajorId());
    dto.setId(proto.getMajor().getMajorId());
    dto.setName(proto.getMajor().getMajorName());
    dto.setPosts(
        proto.getStudentCollection().getStudentsList().stream()
            .map(ProjectHierarchyConverter::protoStudentToStudentDto)
            .collect(Collectors.toList()));
    return dto;
  }

  private static MajorDTO protoMajorWithProjectsToMajorDto(MajorWithEntityCollection proto) {
    MajorDTO dto = new MajorDTO();
    dto.setId(proto.getMajor().getMajorId());
    dto.setName(proto.getMajor().getMajorName());
    dto.setPosts(
        proto.getProjectCollection().getProjectsList().stream()
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

  public static FacultyDTO protoFacultyToFacultyDto(FacultyProto proto) {
    FacultyDTO dto = new FacultyDTO();
    dto.setId(proto.getFacultyId());
    dto.setFirstName(proto.getFirstName());
    dto.setLastName(proto.getLastName());
    dto.setEmail(proto.getEmail());
    dto.setDepartment(proto.getDepartmentsList());
    return dto;
  }

  public static StudentDTO protoStudentToStudentDto(StudentProto proto) {
    StudentDTO dto = new StudentDTO();
    dto.setFirstName(proto.getFirstName());
    dto.setLastName(proto.getLastName());
    dto.setEmail(proto.getEmail());
    dto.setClassStatus(proto.getClassStatus());
    dto.setGraduationYear(proto.getGraduationYear());
    dto.setMajors(proto.getMajorsList());
    dto.setResearchFieldInterests(proto.getResearchFieldInterestsList());
    dto.setResearchPeriodsInterest(proto.getResearchPeriodsInterestsList());
    dto.setInterestReason(proto.getInterestReason());
    dto.setHasPriorExperience(proto.getHasPriorExperience());
    dto.setIsActive(proto.getIsActive());
    return dto;
  }
}
