import { createSlice } from '@reduxjs/toolkit';

const toastSlice = createSlice({
  name: 'toast',
  initialState: {
    open: false,
    message: '',
    severity: 'info'
  },
  reducers: {
    showToast: (state, action) => {
      const { message, severity } = action.payload;
      state.open = true;
      state.message = message;
      state.severity = severity || 'info';
    },
    hideToast: (state) => {
      state.open = false;
      state.message = '';
    }
  }
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;
