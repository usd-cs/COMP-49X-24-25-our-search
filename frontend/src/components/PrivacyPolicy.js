import React from 'react'
import { Typography, Box, Container } from '@mui/material'

/**
 * Privacy Policy component for OUR SEARCH
 * Displays the privacy policy information
 * @author Eduardo Perez Rocha <eperezrocha@sandiego.edu>
 */

function PrivacyPolicy () {
  return (
    <Container maxWidth='md' sx={{ py: 6 }}>
      <Typography variant='h3' component='h1' gutterBottom align='center' sx={{ fontWeight: 'bold', mb: 6 }}>
        OUR SEARCH Privacy Policy
      </Typography>

      <Box mb={5}>
        <Typography variant='h5' component='h2' sx={{ fontWeight: 'bold', mb: 2 }}>
          1 | Who we are
        </Typography>
        <Typography variant='body1' sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
          SEARCH is a USD web app run by the Office of Undergraduate Research (OUR) to link undergraduate students with faculty research opportunities.
        </Typography>
      </Box>

      <Box mb={5}>
        <Typography variant='h5' component='h2' sx={{ fontWeight: 'bold', mb: 2 }}>
          2 | What we collect
        </Typography>
        <ul style={{ paddingLeft: '2rem' }}>
          <li>
            <Typography sx={{ fontSize: '1.1rem', lineHeight: 1.6, mb: 1 }}>
              Account basics from USD Single-Sign-On: name, @sandiego.edu email, USD ID
            </Typography>
          </li>
          <li>
            <Typography sx={{ fontSize: '1.1rem', lineHeight: 1.6, mb: 1 }}>
              Profile details you add: major, interests, résumé (optional)
            </Typography>
          </li>
          <li>
            <Typography sx={{ fontSize: '1.1rem', lineHeight: 1.6, mb: 1 }}>
              Faculty listings: project descriptions, status
            </Typography>
          </li>
          <li>
            <Typography sx={{ fontSize: '1.1rem', lineHeight: 1.6, mb: 1 }}>
              Usage logs: pages visited, search filters, IP / browser
            </Typography>
          </li>
        </ul>
      </Box>

      <Box mb={5}>
        <Typography variant='h5' component='h2' sx={{ fontWeight: 'bold', mb: 2 }}>
          3 | Why we collect it
        </Typography>
        <ul style={{ paddingLeft: '2rem' }}>
          <li>
            <Typography sx={{ fontSize: '1.1rem', lineHeight: 1.6, mb: 1 }}>
              Authenticate users and customize access
            </Typography>
          </li>
          <li>
            <Typography sx={{ fontSize: '1.1rem', lineHeight: 1.6, mb: 1 }}>
              Match students ↔ faculty and send email alerts
            </Typography>
          </li>
          <li>
            <Typography sx={{ fontSize: '1.1rem', lineHeight: 1.6, mb: 1 }}>
              Maintain security, fix bugs, and gauge engagement
            </Typography>
          </li>
          <li>
            <Typography sx={{ fontSize: '1.1rem', lineHeight: 1.6, mb: 1 }}>
              Produce anonymized stats for program reporting
            </Typography>
          </li>
        </ul>
      </Box>

      <Box mb={5}>
        <Typography variant='h5' component='h2' sx={{ fontWeight: 'bold', mb: 2 }}>
          4 | How we share
        </Typography>
        <Typography variant='body1' sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
          Within USD: OUR staff, relevant faculty, and students per role-based visibility.
          <br /><br />
          Service providers (Google Cloud, email relay) under strict contracts.
          <br /><br />
          Legal or safety reasons if required. We <strong>never sell</strong> or rent your data.
        </Typography>
      </Box>

      <Box mb={5}>
        <Typography variant='h5' component='h2' sx={{ fontWeight: 'bold', mb: 2 }}>
          5 | Cookies & tracking
        </Typography>
        <Typography variant='body1' sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
          Only essential session cookies and accessibility preferences; no ads or third-party trackers.
        </Typography>
      </Box>

      <Box mb={5}>
        <Typography variant='h5' component='h2' sx={{ fontWeight: 'bold', mb: 2 }}>
          6 | Retention
        </Typography>
        <ul style={{ paddingLeft: '2rem' }}>
          <li>
            <Typography sx={{ fontSize: '1.1rem', lineHeight: 1.6, mb: 1 }}>
              Profiles/projects: deleted on request or after 24 months of inactivity
            </Typography>
          </li>
          <li>
            <Typography sx={{ fontSize: '1.1rem', lineHeight: 1.6, mb: 1 }}>
              Logs: 12 months
            </Typography>
          </li>
          <li>
            <Typography sx={{ fontSize: '1.1rem', lineHeight: 1.6, mb: 1 }}>
              Encrypted backups: max 6 months
            </Typography>
          </li>
        </ul>
      </Box>

      <Box mb={5}>
        <Typography variant='h5' component='h2' sx={{ fontWeight: 'bold', mb: 2 }}>
          7 | Security
        </Typography>
        <Typography variant='body1' sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
          Google OAuth, TLS 1.3, data-at-rest encryption, role-based access, regular audits. No system is 100% secure—contact us if you suspect misuse.
        </Typography>
      </Box>

      <Box mb={5}>
        <Typography variant='h5' component='h2' sx={{ fontWeight: 'bold', mb: 2 }}>
          8 | Your choices
        </Typography>
        <ul style={{ paddingLeft: '2rem' }}>
          <li>
            <Typography sx={{ fontSize: '1.1rem', lineHeight: 1.6, mb: 1 }}>
              View/edit/delete your profile at any time
            </Typography>
          </li>
          <li>
            <Typography sx={{ fontSize: '1.1rem', lineHeight: 1.6, mb: 1 }}>
              Unsubscribe from non-essential emails
            </Typography>
          </li>
          <li>
            <Typography sx={{ fontSize: '1.1rem', lineHeight: 1.6, mb: 1 }}>
              California & GDPR users: rights to access, delete, or port data—email us.
            </Typography>
          </li>
        </ul>
      </Box>

      <Box mb={5}>
        <Typography variant='h5' component='h2' sx={{ fontWeight: 'bold', mb: 2 }}>
          9 | International use
        </Typography>
        <Typography variant='body1' sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
          Data is processed in the U.S.; standard safeguards apply for cross-border transfers.
        </Typography>
      </Box>

      <Box mb={5}>
        <Typography variant='h5' component='h2' sx={{ fontWeight: 'bold', mb: 2 }}>
          10 | Children
        </Typography>
        <Typography variant='body1' sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
          Service intended for USD users 16+. We delete under-16 data if discovered.
        </Typography>
      </Box>

      <Box mb={3}>
        <Typography variant='h5' component='h2' sx={{ fontWeight: 'bold', mb: 2 }}>
          11 | Policy changes
        </Typography>
        <Typography variant='body1' sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
          We'll post updates in-app and email active users. Continued use = acceptance.
        </Typography>
      </Box>
    </Container>
  )
}

export default PrivacyPolicy
