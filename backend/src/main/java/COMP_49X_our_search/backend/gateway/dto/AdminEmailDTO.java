package COMP_49X_our_search.backend.gateway.dto;

public class AdminEmailDTO {
  private String email;

  public AdminEmailDTO() {}

  public AdminEmailDTO(String email) {
    this.email = email;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }
}
