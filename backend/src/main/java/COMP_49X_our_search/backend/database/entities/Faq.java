package COMP_49X_our_search.backend.database.entities;

import COMP_49X_our_search.backend.database.enums.FaqType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "faqs")
public class Faq {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String question;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String answer;

  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private FaqType faqType;

  public Faq() {}

  public Faq(
      Integer id,
      String question,
      String answer,
      FaqType faqType
  ) {
    this.id = id;
    this.question = question;
    this.answer = answer;
    this.faqType = faqType;
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
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

  public FaqType getFaqType() {
    return faqType;
  }

  public void setFaqType(FaqType faqType) {
    this.faqType = faqType;
  }
}
