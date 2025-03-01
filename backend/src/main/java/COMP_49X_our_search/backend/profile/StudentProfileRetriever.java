/**
 * Profile retriever for students. This class handles the retrieval of student
 * profiles by querying the database using the user's email.
 *
 * Implements the ProfileRetriever interface.
 *
 * @author Augusto Escudero
 */
package COMP_49X_our_search.backend.profile;

import static COMP_49X_our_search.backend.util.ProtoConverter.toStudentProto;

import COMP_49X_our_search.backend.database.entities.Student;
import COMP_49X_our_search.backend.database.services.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proto.profile.ProfileModule.RetrieveProfileRequest;
import proto.profile.ProfileModule.RetrieveProfileResponse;

@Service
public class StudentProfileRetriever implements ProfileRetriever {

  private final StudentService studentService;

  @Autowired
  public StudentProfileRetriever(StudentService studentService) {
    this.studentService = studentService;
  }

  @Override
  public RetrieveProfileResponse retrieveProfile(RetrieveProfileRequest request) {
    validateRequest(request);
    Student dbStudent = studentService.getStudentByEmail(request.getUserEmail());
    return RetrieveProfileResponse.newBuilder()
        .setSuccess(true)
        .setProfileId(dbStudent.getId())
        .setRetrievedStudent(toStudentProto(dbStudent))
        .build();
  }

  private void validateRequest(RetrieveProfileRequest request) {
    if (request.getUserEmail().isEmpty()) {
      throw new IllegalArgumentException("RetrieveProfileRequest must contain 'user_email'");
    }
  }
}
