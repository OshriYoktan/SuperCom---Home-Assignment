import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, MenuItem, Box, CircularProgress } from '@mui/material';
import { createTask, updateTask } from '../slices/tasksSlice';

const schema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  dueDate: yup
    .string()
    .required('Due date is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  priority: yup
    .number()
    .min(1)
    .max(5)
    .required()
    .transform((v) => Number(v)),
});

const formatDateForInput = (date) => {
  if (!date) return '';
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
};

const TaskForm = ({ task = null, onClose, user }) => {
  const dispatch = useDispatch();
  const { mutationLoading } = useSelector((state) => state.tasks);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { title: '', description: '', dueDate: '', priority: 1 },
  });

  useEffect(() => {
    if (task) {
      reset({
        ...task,
        dueDate: formatDateForInput(task.dueDate),
      });
    }
  }, [task, reset]);

  const onSubmit = (data) => {
    if (task?.id) {
      dispatch(updateTask({ userId: user.id, taskId: task.id, data })).then(() =>
        onClose?.()
      );
    } else {
      dispatch(createTask({ userId: user.id, data })).then(() => onClose?.());
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} mt={2} noValidate>
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Title" fullWidth margin="normal" error={!!errors.title} helperText={errors.title?.message} />
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Description" fullWidth margin="normal" error={!!errors.description} helperText={errors.description?.message} />
        )}
      />

      <Controller
        name="dueDate"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            type="date"
            label="Due Date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            error={!!errors.dueDate}
            helperText={errors.dueDate?.message}
            onChange={(e) => field.onChange(e.target.value)}
          />
        )}
      />

      <Controller
        name="priority"
        control={control}
        render={({ field }) => (
          <TextField {...field} select label="Priority" fullWidth margin="normal" error={!!errors.priority} helperText={errors.priority?.message}>
            {[1, 2, 3, 4, 5].map((p) => (
              <MenuItem key={p} value={p}>
                Priority {p}
              </MenuItem>
            ))}
          </TextField>
        )}
      />

      <Box mt={3} display="flex" gap={2}>
        <Button type="submit" variant="contained" disabled={mutationLoading} startIcon={mutationLoading && <CircularProgress size={18} />}>
          {task ? 'Update Task' : 'Create Task'}
        </Button>
        {onClose && <Button onClick={onClose} variant="outlined">Cancel</Button>}
      </Box>
    </Box>
  );
};

export default TaskForm;
