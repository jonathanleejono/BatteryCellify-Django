import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
// material
import { Stack, TextField, IconButton, InputAdornment, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// component
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../../features/user/userSlice';
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

export default function ProfileForm() {
  const dispatch = useDispatch();

  const { user, isLoading } = useSelector((store) => store.user);

  const ProfileSchema = Yup.object().shape({
    firstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('First name required'),
    lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
  });

  const formik = useFormik({
    initialValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    },
    validationSchema: ProfileSchema,
    onSubmit: () => {
      dispatch(updateUser(formik.values));
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="First name"
              {...getFieldProps('firstName')}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
              value={formik.values.firstName}
            />

            <TextField
              fullWidth
              label="Last name"
              {...getFieldProps('lastName')}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
              value={formik.values.lastName}
            />
          </Stack>

          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
            value={formik.values.email}
          />

          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} spacing={2}>
            <Button fullWidth size="large" type="submit" variant="contained" disabled={isSubmitting} padding={5}>
              Update Profile
            </Button>
            <Button
              fullWidth
              size="large"
              variant="outlined"
              disabled={isSubmitting}
              ml={5}
              onClick={() => console.log('hello world')}
            >
              Clear Values
            </Button>
          </Stack>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
