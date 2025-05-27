package COMP_49X_our_search.backend.notifications;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import java.io.IOException;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SendGridService {

  @Value("${SENDGRID_API_KEY:}")
  private String sendGridApiKey;

  @Value("${SENDGRID_FROM_EMAIL:}")
  private String fromEmail;

  public void sendEmail(String toEmail, String subject, String body, String contentType)
      throws IOException {

    if (isNotConfigured()) {
      System.out.println("SendGrid is not configured. Skipping email to " + toEmail);
      return;
    }

    Mail mail = buildSinglePartMail(toEmail, subject, body, contentType);
    dispatch(mail);
  }

  public void sendEmailPlain(String toEmail, String subject, String body) throws IOException {
    sendEmail(toEmail, subject, body, "text/plain");
  }

  public void sendEmailHtml(String toEmail, String subject, String htmlBody) throws IOException {
    sendEmail(toEmail, subject, htmlBody, "text/html");
  }

  public void sendEmailMultipart(String toEmail, String subject, String plainBody, String htmlBody)
      throws IOException {

    if (isNotConfigured()) {
      System.out.println("SendGrid is not configured. Skipping email to " + toEmail);
      return;
    }

    Mail mail = new Mail();
    mail.setFrom(new Email(fromEmail));
    mail.setSubject(subject);
    mail.addPersonalization(
        new com.sendgrid.helpers.mail.objects.Personalization() {
          {
            addTo(new Email(toEmail));
          }
        });

    mail.addContent(new Content("text/plain", plainBody));
    mail.addContent(new Content("text/html", htmlBody));

    dispatch(mail);
  }

  public void sendEmailWithBcc(
      List<String> bccEmails, String subject, String body, String contentType) throws IOException {
    if (isNotConfigured()) {
      System.out.println("SendGrid is not configured. Skipping email to BCC recipients");
      return;
    }

    Mail mail = new Mail();
    mail.setFrom(new Email(fromEmail));
    mail.setSubject(subject);
    mail.addContent(new Content(contentType, body));

    com.sendgrid.helpers.mail.objects.Personalization personalization =
        new com.sendgrid.helpers.mail.objects.Personalization();

    for (String bccEmail : bccEmails) {
      personalization.addBcc(new Email(bccEmail));
    }
    mail.addPersonalization(personalization);

    dispatch(mail);
  }

  private boolean isNotConfigured() {
    return sendGridApiKey == null
        || sendGridApiKey.isBlank()
        || fromEmail == null
        || fromEmail.isBlank();
  }

  private Mail buildSinglePartMail(
      String toEmail, String subject, String body, String contentType) {
    Email from = new Email(fromEmail);
    Email to = new Email(toEmail);
    Content content = new Content(contentType, body);
    return new Mail(from, subject, to, content);
  }

  private void dispatch(Mail mail) throws IOException {
    SendGrid sg = new SendGrid(sendGridApiKey);
    Request rq = new Request();
    rq.setMethod(Method.POST);
    rq.setEndpoint("mail/send");
    rq.setBody(mail.build());

    Response resp = sg.api(rq);
    System.out.println("Email sent! Status: " + resp.getStatusCode());
  }
}
