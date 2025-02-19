package COMP_49X_our_search.backend.fetcher;

import static COMP_49X_our_search.backend.util.ProtoConverter.toDisciplineProto;
import static COMP_49X_our_search.backend.util.ProtoConverter.toMajorProto;

import COMP_49X_our_search.backend.database.entities.Discipline;
import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.entities.Student;
import COMP_49X_our_search.backend.database.services.DisciplineService;
import COMP_49X_our_search.backend.database.services.MajorService;
import COMP_49X_our_search.backend.database.services.StudentService;
import COMP_49X_our_search.backend.util.ProtoConverter;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proto.fetcher.DataTypes.DisciplineWithMajors;
import proto.fetcher.DataTypes.MajorWithEntityCollection;
import proto.fetcher.DataTypes.ProjectHierarchy;
import proto.fetcher.DataTypes.StudentCollection;
import proto.fetcher.FetcherModule.FetcherRequest;
import proto.fetcher.FetcherModule.FetcherRequest.FetcherTypeCase;
import proto.fetcher.FetcherModule.FetcherResponse;
import proto.fetcher.FetcherModule.FilteredType;

@Service
public class StudentFetcher implements Fetcher {

  private final DisciplineService disciplineService;
  private final MajorService majorService;
  private final StudentService studentService;

  @Autowired
  public StudentFetcher(
      DisciplineService disciplineService,
      MajorService majorService,
      StudentService studentService) {
    this.disciplineService = disciplineService;
    this.majorService = majorService;
    this.studentService = studentService;
  }

  @Override
  public FetcherResponse fetch(FetcherRequest request) {
    validateRequest(request);
    List<Discipline> disciplines = disciplineService.getAllDisciplines();

    List<DisciplineWithMajors> disciplineWithMajors =
        disciplines.stream().map(this::buildDisciplineWithMajors).toList();

    return FetcherResponse.newBuilder()
        .setProjectHierarchy(ProjectHierarchy.newBuilder().addAllDisciplines(disciplineWithMajors))
        .build();
  }

  private DisciplineWithMajors buildDisciplineWithMajors(Discipline discipline) {
    List<Major> majors = majorService.getMajorsByDisciplineId(discipline.getId());
    return DisciplineWithMajors.newBuilder()
        .setDiscipline(toDisciplineProto(discipline))
        .addAllMajors(majors.stream().map(this::buildMajorWithStudents).toList())
        .build();
  }

  private MajorWithEntityCollection buildMajorWithStudents(Major major) {
    List<Student> studentsMajoring = studentService.getStudentsByMajorId(major.getId());
    List<Student> studentsInterested = studentService.getStudentsByResearchFieldInterestId(major.getId());
    // The set should include:
    // 1) Students who are majoring in the given major.
    // 2) Students who have expressed interest in researching this field,
    //    even if they are majoring in a different discipline.
    Set<Student> uniqueStudents = new HashSet<>(studentsMajoring);
    uniqueStudents.addAll(studentsInterested);

    return MajorWithEntityCollection.newBuilder()
        .setMajor(toMajorProto(major))
        .setStudentCollection(
            StudentCollection.newBuilder()
                .addAllStudents(uniqueStudents.stream().map(ProtoConverter::toStudentProto).toList()))
        .build();
  }

  private void validateRequest(FetcherRequest request) {
    if (request.getFetcherTypeCase() == FetcherTypeCase.FETCHERTYPE_NOT_SET) {
      throw new IllegalArgumentException(
          String.format(
              "Expected fetcher_type to be set, but no fetcher type was provided. Valid types: %s",
              "filtered_fetcher"));
    }
    if (request.getFetcherTypeCase() != FetcherTypeCase.FILTERED_FETCHER) {
      throw new IllegalArgumentException(
          String.format(
              "Expected fetcher_type 'filtered_fetcher', but got '%s'",
              request.getFetcherTypeCase().toString().toLowerCase()));
    }
    if (request.getFilteredFetcher().getFilteredType() != FilteredType.FILTERED_TYPE_STUDENTS) {
      throw new IllegalArgumentException(
          String.format(
              "Expected filtered_type '%s', but got '%s'",
              FilteredType.FILTERED_TYPE_STUDENTS,
              request.getFilteredFetcher().getFilteredType().toString()));
    }
  }
}
