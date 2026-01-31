import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../api/axios';
import { TextField, Button, Box, CircularProgress } from '@mui/material';
import { useState } from 'react';

const schema = yup.object({
  fullName: yup.string().required('Full Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  telephone: yup.string().required('Telephone is required'),
});

const fields = [
  { name: 'fullName', label: 'Full Name' },
  { name: 'email', label: 'Email' },
  { name: 'telephone', label: 'Telephone' },
];

const RegisterPage = ({ onRegistered }) => {
  const { handleSubmit, control, formState: { errors }, setError } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { fullName: '', email: '', telephone: '' }
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await api.post('/users', data);
      onRegistered(res.data);
    } catch (err) {
      setError('email', {
        type: 'manual',
        message: err.response?.data?.error || 'Registration failed'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5, p: 3, border: '1px solid #ccc', borderRadius: 2 }}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {fields.map(({ name, label }) => (
          <Controller
            key={name}
            name={name}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={label}
                fullWidth
                margin="normal"
                error={!!errors[name]}
                helperText={errors[name]?.message}
              />
            )}
          />
        ))}

        <Box mt={2}>
          <Button type="submit" variant="contained" fullWidth disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Register'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default RegisterPage;
