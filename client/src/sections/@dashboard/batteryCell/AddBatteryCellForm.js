import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
// material
import { Stack, TextField, MenuItem, IconButton, InputAdornment, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// component
import { useDispatch, useSelector } from 'react-redux';
import { handleChange, createBatteryCell } from '../../../features/batteryCell/batteryCellSlice';

// ----------------------------------------------------------------------

export default function AddBatteryCellForm() {
  const {
    cellNameId,
    cycles,
    cathode,
    cathodeOptions,
    anode,
    anodeOptions,
    capacityAh,
    type,
    typeOptions,
    source,
    sourceOptions,
    temperatureC,
    maxStateOfCharge,
    minStateOfCharge,
    depthOfDischarge,
    chargeCapacityRate,
    dischargeCapacityRate,
    formikInitialValues,
  } = useSelector((store) => store.batteryCell);

  const dispatch = useDispatch();

  const AddBatteryCellSchema = Yup.object().shape({
    cellNameId: Yup.string().min(2, 'Too Short!').max(100, 'Too Long!').required('Cell Name ID is required'),
    cycles: Yup.string().max(100, 'Too Long!').required('Cycles required'),
    capacityAh: Yup.string().max(100, 'Too Long!').required('Capacity (Ah) is required'),
    temperatureC: Yup.string().max(100, 'Too Long!').required('Temperature (C) is required'),
    maxStateOfCharge: Yup.string().max(100, 'Too Long!').required('Max State of Charge is required'),
    minStateOfCharge: Yup.string().max(100, 'Too Long!').required('Min State of Charge is required'),
    depthOfDischarge: Yup.string().max(100, 'Too Long!').required('Depth of Discharge is required'),
    chargeCapacityRate: Yup.string().max(100, 'Too Long!').required('Charge Capacity Rate required'),
    dischargeCapacityRate: Yup.string().max(100, 'Too Long!').required('Discharge Capacity Rate is required'),
  });

  const formik = useFormik({
    initialValues: {
      cellNameId: '',
      cycles: '',
      cathode: 'LCO',
      anode: 'Graphite',
      capacityAh: '',
      type: '18650',
      source: 'HNEI',
      temperatureC: '',
      maxStateOfCharge: '',
      minStateOfCharge: '',
      depthOfDischarge: '',
      chargeCapacityRate: '',
      dischargeCapacityRate: '',
    },
    validationSchema: AddBatteryCellSchema,
    onSubmit: () => {
      dispatch(
        createBatteryCell({
          cellNameId: formik.values.cellNameId,
          cycles: formik.values.cycles,
          cathode: cathode || 'LCO',
          anode: anode || 'graphite',
          capacityAh: formik.values.capacityAh,
          type: type || '18650',
          source: source || 'HNEI',
          temperatureC: formik.values.temperatureC,
          maxStateOfCharge: formik.values.maxStateOfCharge,
          minStateOfCharge: formik.values.minStateOfCharge,
          depthOfDischarge: formik.values.depthOfDischarge,
          chargeCapacityRate: formik.values.chargeCapacityRate,
          dischargeCapacityRate: formik.values.dischargeCapacityRate,
        })
      );
      resetForm();
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, resetForm } = formik;

  const handleBatteryCellInput = (event) => {
    const { name, value } = event.target;
    dispatch(handleChange({ name, value }));
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            name="cellNameId"
            label="Cell Name ID"
            {...getFieldProps('cellNameId')}
            error={Boolean(touched.cellNameId && errors.cellNameId)}
            helperText={touched.cellNameId && errors.cellNameId}
            value={formik.values.cellNameId}
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Cycles"
              {...getFieldProps('cycles')}
              error={Boolean(touched.cycles && errors.cycles)}
              helperText={touched.cycles && errors.cycles}
              value={formik.values.cycles}
            />
            <TextField
              fullWidth
              name="cathode"
              label="Cathode"
              select
              value={cathode}
              onChange={handleBatteryCellInput}
            >
              {cathodeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField fullWidth name="anode" label="Anode" select value={anode} onChange={handleBatteryCellInput}>
              {anodeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Capacity (Ah)"
              {...getFieldProps('capacityAh')}
              error={Boolean(touched.capacityAh && errors.capacityAh)}
              helperText={touched.capacityAh && errors.capacityAh}
              value={formik.values.capacityAh}
            />
            <TextField fullWidth name="type" label="Type" select value={type} onChange={handleBatteryCellInput}>
              {typeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField fullWidth name="source" label="Source" select value={source} onChange={handleBatteryCellInput}>
              {sourceOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Temperature (C)"
              {...getFieldProps('temperatureC')}
              error={Boolean(touched.temperatureC && errors.temperatureC)}
              helperText={touched.temperatureC && errors.temperatureC}
              value={formik.values.temperatureC}
            />
            <TextField
              fullWidth
              label="Max State of Charge"
              {...getFieldProps('maxStateOfCharge')}
              error={Boolean(touched.maxStateOfCharge && errors.maxStateOfCharge)}
              helperText={touched.maxStateOfCharge && errors.maxStateOfCharge}
              value={formik.values.maxStateOfCharge}
            />
            <TextField
              fullWidth
              label="Min State of Charge"
              {...getFieldProps('minStateOfCharge')}
              error={Boolean(touched.minStateOfCharge && errors.minStateOfCharge)}
              helperText={touched.minStateOfCharge && errors.minStateOfCharge}
              value={formik.values.minStateOfCharge}
            />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Depth of Discharge"
              {...getFieldProps('depthOfDischarge')}
              error={Boolean(touched.depthOfDischarge && errors.depthOfDischarge)}
              helperText={touched.depthOfDischarge && errors.depthOfDischarge}
              value={formik.values.depthOfDischarge}
            />
            <TextField
              fullWidth
              label="Charge Capacity Rate"
              {...getFieldProps('chargeCapacityRate')}
              error={Boolean(touched.chargeCapacityRate && errors.chargeCapacityRate)}
              helperText={touched.chargeCapacityRate && errors.chargeCapacityRate}
              value={formik.values.chargeCapacityRate}
            />
            <TextField
              fullWidth
              label="Discharge Capacity Rate"
              {...getFieldProps('dischargeCapacityRate')}
              error={Boolean(touched.dischargeCapacityRate && errors.dischargeCapacityRate)}
              helperText={touched.dischargeCapacityRate && errors.dischargeCapacityRate}
              value={formik.values.dischargeCapacityRate}
            />
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} spacing={2}>
            <Button fullWidth size="large" type="submit" variant="contained" disabled={isSubmitting} padding={5}>
              Add Battery Cell
            </Button>
            <Button
              fullWidth
              size="large"
              variant="outlined"
              disabled={isSubmitting}
              ml={5}
              onClick={() => {
                console.log('hello world');
                resetForm();
              }}
            >
              Clear Values
            </Button>
          </Stack>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
