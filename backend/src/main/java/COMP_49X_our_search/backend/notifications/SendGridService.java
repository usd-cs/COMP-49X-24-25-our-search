package COMP_49X_our_search.backend.notifications;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SendGridService {

  @Value("${SENDGRID_API_KEY:}")
  private String sendGridApiKey;

  @Value("${SENDGRID_FROM_EMAIL:}")
  private String fromEmail;

  public void sendEmail(String toEmail, String subject, String body) throws IOException {
    if (sendGridApiKey == null
        || sendGridApiKey.isBlank()
        || fromEmail == null
        || fromEmail.isBlank()) {
      System.out.println("SendGrid is not configured. Skipping email to " + toEmail);
      return;
    }

    Email from = new Email(fromEmail);
    Email to = new Email(toEmail);
    Content content = new Content("text/plain", body);
    Mail mail = new Mail(from, subject, to, content);

    SendGrid sendGrid = new SendGrid(sendGridApiKey);
    Request request = new Request();

    try {
      request.setMethod(Method.POST);
      request.setEndpoint("mail/send");
      request.setBody(mail.build());
      Response response = sendGrid.api(request);
      System.out.println("Email sent! Status Code: " + response.getStatusCode());
      System.out.println(response.getBody());
      System.out.println(response.getHeaders());
    } catch (IOException ex) {
      System.err.println("Error sending email: " + ex.getMessage());
      throw ex;
    }
  }
}
