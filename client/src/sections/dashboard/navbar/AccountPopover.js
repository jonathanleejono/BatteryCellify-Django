import { Avatar, Box, Divider, IconButton, MenuItem, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import MenuPopover from 'components/MenuPopover';
import { dashboardRoute, landingRoute, profileRoute } from 'constants/routes';
import { clearStore, getUser, logoutUser } from 'features/user/userThunk';
import { handleToastErrors } from 'notifications/toast';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { removeUserFromLocalStorage } from 'utils/localStorage';

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
    linkTo: dashboardRoute,
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
    linkTo: profileRoute,
  },
];

export default function AccountPopover() {
  const anchorRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFetchUser = useCallback(async () => {
    const resultAction = await dispatch(getUser());

    handleToastErrors(resultAction, getUser, 'Error fetching user details');
  }, [dispatch]);

  useEffect(() => {
    handleFetchUser();
  }, [handleFetchUser, dispatch]);

  const { user } = useSelector((store) => store.user);

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = () => {
    toast.success('Logging out...');
    dispatch(logoutUser());
    dispatch(clearStore());
    removeUserFromLocalStorage();
    navigate(landingRoute);
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src="/static/mock-images/avatars/avatar_default.jpg" alt="photoURL" />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} to={option.linkTo} component={RouterLink} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  );
}
