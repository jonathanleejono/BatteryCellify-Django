import { Button, Card, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Logo from 'components/Logo';
import Page from 'components/Page';
import { loginRoute, registerRoute } from 'constants/routes';
import { Link as RouterLink } from 'react-router-dom';
import useResponsive from 'utils/useResponsiveLayout';

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

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 1400,
  maxHeight: '95vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 2, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(8, 0),
}));

export default function Landing() {
  const mdUp = useResponsive('up', 'md');

  const PROD_ENV = process.env.NODE_ENV === 'production';

  return (
    <Page title="Landing">
      <RootStyle>
        <HeaderStyle>
          <Logo />
        </HeaderStyle>

        <Container>
          <ContentStyle>
            <Typography variant="h2" gutterBottom>
              BatteryCellify
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 5, fontSize: 18 }}>
              Manage battery cells and research through a state of the art dashboard. Built with React, Redux, Python,
              and Django. Communicate to the MySQL database with the Django ORM. Preprocess spreadsheets with Pandas,
              and visual data through Plotly.js.
            </Typography>

            <Button variant="contained" component={RouterLink} to={PROD_ENV ? registerRoute : loginRoute} size="large">
              Enter
            </Button>
          </ContentStyle>
        </Container>

        {mdUp && (
          <SectionStyle>
            <img alt="battery icon" src="/static/battery.svg" />
          </SectionStyle>
        )}
      </RootStyle>
    </Page>
  );
}
