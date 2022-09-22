import { toast } from 'react-toastify';

const showToast = (prevToast, toastType, msg) => {
  toast.update(prevToast, {
    render: `${msg}`,
    type: `${toastType}`,
    isLoading: false,
    autoClose: 2000,
    closeOnClick: true,
  });
};

const handleToast = (resultAction, asyncThunk, defaultSuccessMsg, defaultErrorMsg) => {
  toast.loading('Please wait...');

  // if the redux call is successful
  if (asyncThunk.fulfilled.match(resultAction)) {
    toast.dismiss();

    if (resultAction.payload.message) {
      toast.success(`${resultAction.payload.message}`);
    }

    if (!resultAction.payload.message && defaultSuccessMsg) {
      toast.success(`${defaultSuccessMsg}`);
    }

    return { data: 'success', payload: resultAction.payload };
  }

  toast.dismiss();

  // if the redux call isn't successful
  if (resultAction.payload) {
    // only use resultAction.payload because thunkAPI in redux
    // already destructures errors[0].message
    toast.error(`${resultAction.payload}`);
  }

  if (!resultAction.payload && defaultErrorMsg) {
    toast.error(`${defaultErrorMsg}`);
  }

  return { data: 'error' };
};

// errors only, no success msg
const handleToastErrors = (resultAction, asyncThunk, defaultErrorMsg) => {
  if (!asyncThunk.fulfilled.match(resultAction)) {
    if (resultAction.payload) {
      toast.error(`${resultAction.payload}`);
    }

    if (!resultAction.payload && defaultErrorMsg) {
      toast.error(`${defaultErrorMsg}`);
    }

    return { data: 'error' };
  }

  return { data: 'success', payload: resultAction.payload };
};

export { showToast, handleToast, handleToastErrors };
