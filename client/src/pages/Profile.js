import { Container, Stack, Typography } from '@mui/material';
import Page from 'components/Page';
import { ProfileForm } from 'sections/dashboard/profile';

export default function Profile() {
  return (
    <Page title="Profile">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Profile
          </Typography>
        </Stack>
        <ProfileForm />
      </Container>
    </Page>
  );
}
