import { Card, Container, Link, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Logo from 'components/Logo';
import Page from 'components/Page';
import { loginRoute } from 'constants/routes';
import { Link as RouterLink } from 'react-router-dom';
import RegisterForm from 'sections/user-auth/RegisterForm';
import useResponsive from 'utils/useResponsiveLayout';

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

export default function Register() {
  const mdUp = useResponsive('up', 'md');

  return (
    <Page title="Register">
      <RootStyle>
        <HeaderStyle>
          <Logo />
        </HeaderStyle>

        {mdUp && (
          <SectionStyle>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Manage your research more effectively
            </Typography>
            <img alt="research person" src="/static/illustrations/illustration_register.png" />
          </SectionStyle>
        )}

        <Container>
          <ContentStyle>
            <Typography variant="h4" gutterBottom>
              Sign Up
            </Typography>

            <Typography sx={{ color: 'text.secondary', mb: 5 }}>Explore and analyze battery cell data.</Typography>

            <RegisterForm />

            <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
              Already have an account?{' '}
              <Link variant="subtitle2" to={loginRoute} component={RouterLink}>
                Login
              </Link>
            </Typography>
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
