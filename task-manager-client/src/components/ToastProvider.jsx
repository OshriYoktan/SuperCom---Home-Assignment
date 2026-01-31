import { useSelector, useDispatch } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';
import { hideToast } from '../slices/toastSlice';

const ToastProvider = () => {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector(state => state.toast);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    dispatch(hideToast());
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ToastProvider;
