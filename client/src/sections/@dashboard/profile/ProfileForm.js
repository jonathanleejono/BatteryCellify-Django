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
    first_name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('First name required'),
    last_name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
  });

  const formik = useFormik({
    initialValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
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
              data-cy="first_name"
              inputProps={{ data_cy: 'first-name-input' }}
              {...getFieldProps('first_name')}
              error={Boolean(touched.first_name && errors.first_name)}
              helperText={touched.first_name && errors.first_name}
              value={formik.values.first_name}
            />

            <TextField
              fullWidth
              label="Last name"
              {...getFieldProps('last_name')}
              data-cy="last_name"
              error={Boolean(touched.last_name && errors.last_name)}
              helperText={touched.last_name && errors.last_name}
              value={formik.values.last_name}
            />
          </Stack>

          <TextField
            fullWidth
            autoComplete="email"
            type="email"
            data-cy="email"
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
