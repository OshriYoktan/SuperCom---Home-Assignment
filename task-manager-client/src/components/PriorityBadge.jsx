import { Chip } from '@mui/material';

const PriorityBadge = ({ priority }) => {
  let color = 'default';
  if (priority === 1) color = 'success';
  else if (priority === 2) color = 'info';
  else if (priority === 3) color = 'warning';
  else if (priority >= 4) color = 'error';

  return <Chip label={`Priority ${priority}`} color={color} size="small" />;
};

export default PriorityBadge;
