import React from 'react';
import { Typography, Box, Paper, Container } from '@mui/material';

/**
 * Privacy Policy component for OUR SEARCH
 * Displays the privacy policy information in a simple, readable format
 * @author Eduardo Perez Rocha <eperezrocha@sandiego.edu>
 */

function PrivacyPolicy() {
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
          OUR SEARCH Privacy Policy
        </Typography>

        <Box mb={3}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            1 | Who we are
          </Typography>
          <Typography variant="body1">
            SEARCH is a USD web app run by the Office of Undergraduate Research (OUR) to link undergraduate students with faculty research opportunities.
          </Typography>
        </Box>

        <Box mb={3}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            2 | What we collect
          </Typography>
          <ul>
            <li>
              <Typography>
                Account basics from USD Single-Sign-On: name, @sandiego.edu email, USD ID
              </Typography>
            </li>
            <li>
              <Typography>
                Profile details you add: major, interests, résumé (optional)
              </Typography>
            </li>
            <li>
              <Typography>
                Faculty listings: project descriptions, status
              </Typography>
            </li>
            <li>
              <Typography>
                Usage logs: pages visited, search filters, IP / browser
              </Typography>
            </li>
          </ul>
        </Box>

        <Box mb={3}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            3 | Why we collect it
          </Typography>
          <ul>
            <li>
              <Typography>
                Authenticate users and customize access
              </Typography>
            </li>
            <li>
              <Typography>
                Match students ↔ faculty and send email alerts
              </Typography>
            </li>
            <li>
              <Typography>
                Maintain security, fix bugs, and gauge engagement
              </Typography>
            </li>
            <li>
              <Typography>
                Produce anonymized stats for program reporting
              </Typography>
            </li>
          </ul>
        </Box>

        <Box mb={3}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            4 | How we share
          </Typography>
          <Typography variant="body1">
            Within USD: OUR staff, relevant faculty, and students per role-based visibility.
            Service providers (Google Cloud, email relay) under strict contracts.
            Legal or safety reasons if required. We <strong>never sell</strong> or rent your data.
          </Typography>
        </Box>

        <Box mb={3}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            5 | Cookies & tracking
          </Typography>
          <Typography variant="body1">
            Only essential session cookies and accessibility preferences; no ads or third-party trackers.
          </Typography>
        </Box>

        <Box mb={3}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            6 | Retention
          </Typography>
          <ul>
            <li>
              <Typography>
                Profiles/projects: deleted on request or after 24 months of inactivity
              </Typography>
            </li>
            <li>
              <Typography>
                Logs: 12 months
              </Typography>
            </li>
            <li>
              <Typography>
                Encrypted backups: max 6 months
              </Typography>
            </li>
          </ul>
        </Box>

        <Box mb={3}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            7 | Security
          </Typography>
          <Typography variant="body1">
            Google OAuth, TLS 1.3, data-at-rest encryption, role-based access, regular audits. No system is 100% secure—contact us if you suspect misuse.
          </Typography>
        </Box>

        <Box mb={3}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            8 | Your choices
          </Typography>
          <ul>
            <li>
              <Typography>
                View/edit/delete your profile at any time
              </Typography>
            </li>
            <li>
              <Typography>
                Unsubscribe from non-essential emails
              </Typography>
            </li>
            <li>
              <Typography>
                California & GDPR users: rights to access, delete, or port data—email us.
              </Typography>
            </li>
          </ul>
        </Box>

        <Box mb={3}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            9 | International use
          </Typography>
          <Typography variant="body1">
            Data is processed in the U.S.; standard safeguards apply for cross-border transfers.
          </Typography>
        </Box>

        <Box mb={3}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            11 | Policy changes
          </Typography>
          <Typography variant="body1">
            We'll post updates in-app and email active users. Continued use = acceptance.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default PrivacyPolicy;