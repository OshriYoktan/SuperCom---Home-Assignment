import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TaskForm from '../components/TaskForm';
import PriorityBadge from '../components/PriorityBadge';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  CircularProgress,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Tooltip
} from '@mui/material';
import { Edit, Delete, CalendarMonth, Person, Email } from '@mui/icons-material';
import { fetchTasks, deleteTask } from '../slices/tasksSlice';

const TasksPage = ({ user }) => {
  const dispatch = useDispatch();
  const { tasks, fetchLoading } = useSelector((state) => state.tasks);

  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    dispatch(fetchTasks(user.id));
  }, [user.id, dispatch]);

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setDeletingId(taskId);
    await dispatch(deleteTask({ userId: user.id, taskId }));
    setDeletingId(null);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold" color="primary.main">
          Task Manager
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
          onClick={() => {
            setEditTask(null);
            setShowForm(true);
          }}
        >
          + Add Task
        </Button>
      </Box>

      <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>{editTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        <DialogContent dividers>
          <TaskForm task={editTask} onClose={() => setShowForm(false)} user={user} />
        </DialogContent>
      </Dialog>

      {fetchLoading ? (
        <Box mt={10} display="flex" flexDirection="column" alignItems="center">
          <CircularProgress size={60} thickness={4} />
          <Typography mt={2} color="textSecondary">Loading your tasks...</Typography>
        </Box>
      ) : (
        <Grid sx={{ justifyContent: { xs: 'center', lg: 'flex-start' }}} container spacing={2}>
          {tasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={task.id} sx={{ display: 'flex' }}>
              <Card
                sx={{
                  height: '340px',
                  width: '340px', // Forces card to stay within Grid column
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  border: '1px solid #eee',
                  overflow: 'hidden', // Prevents content from leaking out
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    transform: 'translateY(-5px)', 
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)' 
                  },
                }}
              >
                <CardContent sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: '100%', 
                  p: 3,
                  minWidth: 0 // Critical fix for flexbox children
                }}>
                  
                  {/* Title + Priority */}
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1} sx={{ width: '100%' }}>
                    <Tooltip title={task.title} arrow>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 'bold',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flexGrow: 1,
                          mr: 1,
                          wordBreak: 'break-all'
                        }}
                      >
                        {task.title}
                      </Typography>
                    </Tooltip>
                    <Box sx={{ flexShrink: 0 }}>
                      <PriorityBadge priority={task.priority} />
                    </Box>
                  </Box>

                  {/* Description */}
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '40px',
                      mb: 2,
                      wordBreak: 'break-word'
                    }}
                  >
                    {task.description || "No description provided."}
                  </Typography>

                  <Divider sx={{ mb: 2 }} />

                  {/* Info Section */}
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={0.8}>
                      <CalendarMonth fontSize="small" color="action" />
                      <Typography variant="caption" fontWeight="500">
                        Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1} mb={0.8}>
                      <Person fontSize="small" color="action" />
                      <Typography variant="caption" noWrap sx={{ width: '100%' }}>
                        {task.fullName}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Email fontSize="small" color="action" />
                      <Typography variant="caption" noWrap sx={{ width: '100%' }}>
                        {task.email}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Actions */}
                  <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => {
                        setEditTask(task);
                        setShowForm(true);
                      }}
                      sx={{ backgroundColor: '#e3f2fd', '&:hover': { backgroundColor: '#bbdefb' } }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>

                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(task.id)}
                      disabled={deletingId === task.id}
                      sx={{ backgroundColor: '#ffebee', '&:hover': { backgroundColor: '#ffcdd2' } }}
                    >
                      {deletingId === task.id ? <CircularProgress size={20} /> : <Delete fontSize="small" />}
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default TasksPage;