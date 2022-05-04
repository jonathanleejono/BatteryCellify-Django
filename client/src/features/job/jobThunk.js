import { showLoading, hideLoading, getAllJobs } from "../allJobs/allJobsSlice";
import customFetch, { checkForUnauthorizedResponse } from "../../utils/axios";
import { clearValues } from "./jobSlice";

export const createJobThunk = async (
  { position, company, jobLocation, jobType, status },
  thunkAPI
) => {
  try {
    const resp = await customFetch.post("/jobs", {
      position,
      company,
      jobLocation,
      jobType,
      status,
    });
    thunkAPI.dispatch(clearValues());
    console.log("resp.data: ", resp.data);
    console.log("resp.data.msg: ", resp.data.msg);
    return resp.data;
  } catch (err) {
    return (
      checkForUnauthorizedResponse(err, thunkAPI),
      thunkAPI.rejectWithValue(
        err.response.data.detail || err.response.data.error
      )
    );
  }
};
export const deleteJobThunk = async (jobId, thunkAPI) => {
  thunkAPI.dispatch(showLoading());
  try {
    const resp = await customFetch.delete(`/jobs/${jobId}`);
    thunkAPI.dispatch(getAllJobs());
    return resp.data.msg;
  } catch (err) {
    thunkAPI.dispatch(hideLoading());
    return (
      checkForUnauthorizedResponse(err, thunkAPI),
      thunkAPI.rejectWithValue(
        err.response.data.detail || err.response.data.error
      )
    );
  }
};
export const editJobThunk = async ({ jobId, job }, thunkAPI) => {
  try {
    const resp = await customFetch.patch(`/jobs/${jobId}`, job);
    thunkAPI.dispatch(clearValues());
    return resp.data;
  } catch (err) {
    return (
      checkForUnauthorizedResponse(err, thunkAPI),
      thunkAPI.rejectWithValue(
        err.response.data.detail || err.response.data.error
      )
    );
  }
};
