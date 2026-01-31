import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import { showToast } from './toastSlice';

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (userId, thunkAPI) => {
    try {
      const res = await api.get(`/tasks/user/${userId}`);
      return res.data;
    } catch (err) {
      thunkAPI.dispatch(
        showToast({
          message: err.response?.data?.error || 'Failed to load tasks',
          severity: 'error',
        })
      );
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async ({ userId, data }, thunkAPI) => {
    try {
      const res = await api.post('/tasks', { ...data, userId });
      thunkAPI.dispatch(
        showToast({ message: 'Task created successfully', severity: 'success' })
      );
      return res.data;
    } catch (err) {
      thunkAPI.dispatch(
        showToast({
          message: err.response?.data?.error || 'Failed to create task',
          severity: 'error',
        })
      );
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ userId, taskId, data }, thunkAPI) => {
    try {
      const res = await api.put(`/tasks/${taskId}/user/${userId}`, data);
      thunkAPI.dispatch(
        showToast({ message: 'Task updated successfully', severity: 'success' })
      );
      return res.data;
    } catch (err) {
      thunkAPI.dispatch(
        showToast({
          message: err.response?.data?.error || 'Failed to update task',
          severity: 'error',
        })
      );
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async ({ userId, taskId }, thunkAPI) => {
    try {
      await api.delete(`/tasks/${taskId}/user/${userId}`);
      thunkAPI.dispatch(
        showToast({ message: 'Task deleted successfully', severity: 'success' })
      );
      return taskId;
    } catch (err) {
      thunkAPI.dispatch(
        showToast({
          message: err.response?.data?.error || 'Failed to delete task',
          severity: 'error',
        })
      );
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    fetchLoading: false,
    mutationLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.fetchLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.fetchLoading = false;
        state.error = action.payload;
      })

      .addCase(createTask.pending, (state) => {
        state.mutationLoading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.mutationLoading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state) => {
        state.mutationLoading = false;
      })

      .addCase(updateTask.pending, (state) => {
        state.mutationLoading = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.mutationLoading = false;
        const index = state.tasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) state.tasks[index] = action.payload;
      })
      .addCase(updateTask.rejected, (state) => {
        state.mutationLoading = false;
      })

      .addCase(deleteTask.pending, (state) => {
        state.mutationLoading = true;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.mutationLoading = false;
        state.tasks = state.tasks.filter(t => t.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state) => {
        state.mutationLoading = false;
      });
  },
});

export default tasksSlice.reducer;
