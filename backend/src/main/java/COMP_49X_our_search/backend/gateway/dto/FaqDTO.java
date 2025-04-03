package COMP_49X_our_search.backend.gateway.dto;

public class FaqDTO {

  private int id;
  private String question;
  private String answer;

  public FaqDTO() {}

  public FaqDTO(int id, String question, String answer) {
    this.id = id;
    this.question = question;
    this.answer = answer;
  }

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
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
