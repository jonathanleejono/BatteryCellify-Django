import { Button, Stack, TextField } from '@mui/material';
import { updateUser } from 'features/user/userThunk';
import { Form, FormikProvider, useFormik } from 'formik';
import { handleToast } from 'notifications/toast';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

export default function ProfileForm() {
  const dispatch = useDispatch();

  const { user } = useSelector((store) => store.user);

  const ProfileSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Too Short!').max(20, 'Too Long!').required('Name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
  });

  const formik = useFormik({
    // needs to be true to persist data from redux on refresh
    enableReinitialize: true,
    initialValues: {
      name: user.name,
      email: user.email,
    },
    validationSchema: ProfileSchema,
    onSubmit: async () => {
      const resultAction = await dispatch(updateUser(formik.values));

      handleToast(resultAction, updateUser, 'Profile updated!', 'Error updating profile');
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, resetForm } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Name"
              {...getFieldProps('name')}
              data-cy="name"
              inputProps={{ data_cy: 'profile-name-input' }}
              error={Boolean(touched.name && errors.name)}
              helperText={touched.name && errors.name}
              value={formik.values.name}
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
          </Stack>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
