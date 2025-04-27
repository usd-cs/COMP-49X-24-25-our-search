/**
 * Filtered fetcher for retrieving student data. This fetcher interacts with
 * the DisciplineService, MajorService, and StudentService to fetch students
 * grouped by disciplines and majors.
 *
 * It ensures that requests are valid and only processes requests of type
 * FILTERED_TYPE_STUDENTS.
 * Students are included in the response if they are either majoring in the
 * discipline or have expressed research interest in it (even if they are not
 * majoring in it).
 *
 * Implements the fetcher interface.
 *
 * @author Augusto Escudero
 */
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
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proto.fetcher.DataTypes.DisciplineWithMajors;
import proto.fetcher.DataTypes.MajorWithEntityCollection;
import proto.fetcher.DataTypes.ProjectHierarchy;
import proto.fetcher.DataTypes.StudentCollection;
import proto.fetcher.FetcherModule.FetcherRequest;
import proto.fetcher.FetcherModule.FetcherRequest.FetcherTypeCase;
import proto.fetcher.FetcherModule.FetcherResponse;
import proto.fetcher.FetcherModule.FilteredFetcher;
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

    List<DisciplineWithMajors> disciplineWithMajors = disciplines.stream()
      .map(discipline -> buildDisciplineWithMajors(discipline, request.getFilteredFetcher()))
      .toList();

    return FetcherResponse.newBuilder()
        .setProjectHierarchy(ProjectHierarchy.newBuilder().addAllDisciplines(disciplineWithMajors))
        .build();
  }

  private DisciplineWithMajors buildDisciplineWithMajors(Discipline discipline, FilteredFetcher filters) {
    List<Major> majors = majorService.getMajorsByDisciplineId(discipline.getId());
    return DisciplineWithMajors.newBuilder()
        .setDiscipline(toDisciplineProto(discipline))
        .addAllMajors(majors.stream().map(major -> buildMajorWithStudents(major, filters)).toList())
        .build();
  }

  private MajorWithEntityCollection buildMajorWithStudents(Major major, FilteredFetcher filters) {
    List<Student> studentsMajoring = studentService.getStudentsByMajorId(major.getId());
    List<Student> studentsInterested =
        studentService.getStudentsByResearchFieldInterestId(major.getId());
    // The set should include:
    // 1) Students who are majoring in the given major.
    // 2) Students who have expressed interest in researching this field,
    //    even if they are majoring in a different discipline.
    Set<Student> uniqueStudents = new HashSet<>(studentsMajoring);
    uniqueStudents.addAll(studentsInterested);

    Set<Student> activeUniqueStudents =
        uniqueStudents.stream().filter(Student::getIsActive).collect(Collectors.toSet());

    Set<Student> filteredStudents = activeUniqueStudents;

    // If major filter is applied, only keep students if:
    // 1. The current major being processed is in the filter list, OR
    // 2. No major filter is applied (empty list)
    if (!filters.getMajorIdsList().isEmpty()) {
      // If this major is in the filter list, show all students for this major
      if (filters.getMajorIdsList().contains(major.getId())) {
        // Keep all students for this major
      } else {
        // This major isn't in the filter list, so we only show students
        // who have the filtered majors as their research interests
        filteredStudents = activeUniqueStudents.stream()
            .filter(student -> student.getMajors().stream()
                .anyMatch(studentMajor -> filters.getMajorIdsList().contains(studentMajor.getId()))
                || student.getResearchFieldInterests().stream()
                    .anyMatch(interest -> filters.getMajorIdsList().contains(interest.getId())))
            .collect(Collectors.toSet());
      }
    }

    if (!filters.getResearchPeriodIdsList().isEmpty()) {
      filteredStudents = filteredStudents.stream()
          .filter(student -> student.getResearchPeriods().stream()
              .anyMatch(period -> filters.getResearchPeriodIdsList().contains(period.getId())))
          .collect(Collectors.toSet());
    }

    if (!filters.getKeywords().isEmpty()) {
      filteredStudents = filteredStudents.stream()
          .filter(student -> containsKeyword(student.getInterestReason(), filters.getKeywords())
          || containsKeyword(student.getFirstName() + " " + student.getLastName(), filters.getKeywords()))
          .collect(Collectors.toSet());
    }

    return MajorWithEntityCollection.newBuilder()
        .setMajor(toMajorProto(major))
        .setStudentCollection(
            StudentCollection.newBuilder()
                .addAllStudents(
                    filteredStudents.stream().map(ProtoConverter::toStudentProto).toList()))
        .build();
  }

  private boolean containsKeyword(String text, String keywords) {
    if (text == null || keywords == null || keywords.trim().isEmpty()) {
      return false;
    }

    String lowercaseText = text.toLowerCase();
    Set<String> keywordSet = Arrays.stream(keywords.toLowerCase().split("[ ,]"))
        .filter(k -> !k.trim().isEmpty()).collect(Collectors.toSet());

    return keywordSet.isEmpty() || keywordSet.stream().anyMatch(lowercaseText::contains);
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
