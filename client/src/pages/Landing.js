import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// @mui
import { styled } from '@mui/material/styles';
import { Card, Link, Container, Typography, Button } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Page from '../components/Page';
import Logo from '../components/Logo';
// sections
import AuthSocial from '../sections/auth/AuthSocial';

// ----------------------------------------------------------------------

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

// ----------------------------------------------------------------------

export default function Landing() {
  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  const { user, isLoading } = useSelector((store) => store.user);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // mark-app
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  return (
    <Page title="Landing">
      <RootStyle>
        <Container>
          <ContentStyle>
            <Typography variant="h2" gutterBottom>
              BatteryCellify
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 5, fontSize: 18 }}>
              Manage battery cells and research through a state of the art dashboard. Built on top of React and FastAPI.
              Communicate to the PostgreSQL database with the SQLAlchemy ORM. Visual data through Plotly.js, with the
              help of processing data with Pandas.
            </Typography>

            <Button variant="contained" component={RouterLink} to="/register" size="large">
              Enter
            </Button>
          </ContentStyle>
        </Container>

        {mdUp && (
          <SectionStyle>
            <img alt="register" src="/static/battery.svg" />
          </SectionStyle>
        )}
      </RootStyle>
    </Page>
  );
}
