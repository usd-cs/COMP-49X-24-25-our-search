package COMP_49X_our_search.backend.database.services;

import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.repositories.MajorRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MajorService {

  private final MajorRepository majorRepository;

  @Autowired
  public MajorService(MajorRepository majorRepository) {
    this.majorRepository = majorRepository;
  }

  public List<Major> getAllMajors() {
    return majorRepository.findAll();
  }

  public List<Major> getMajorsByDepartmentId(int departmentId) {
    return majorRepository.findAllByDepartments_Id(departmentId);
  }
}
