import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from '../slices/tasksSlice';
import toastReducer from '../slices/toastSlice';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    toast: toastReducer,
  }
});

export default store;
