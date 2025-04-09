package COMP_49X_our_search.backend.gateway.dto;

import COMP_49X_our_search.backend.database.enums.FaqType;

public class FaqRequestDTO {
  private int id; // Required for PUT, DELETE
  private FaqType type; // Required for POST
  private String question; // Required for POST, PUT
  private String answer;   // Required for POST, PUT

  public FaqRequestDTO() {}

  public FaqRequestDTO(int id, FaqType type, String question, String answer) {
    this.id = id;
    this.type = type;
    this.question = question;
    this.answer = answer;
  }

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

  public FaqType getType() {
    return type;
  }

  public void setType(FaqType type) {
    this.type = type;
  }

  public String getQuestion() {
    return question;
  }

  public void setQuestion(String question) {
    this.question = question;
  }

  public String getAnswer() {
    return answer;
  }

  public void setAnswer(String answer) {
    this.answer = answer;
  }
}
