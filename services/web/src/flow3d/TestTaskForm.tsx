/**
 * PartForm.tsx
 * Part form for creating and updating part.
 */

// Node Modules
import { Box, Button, TextField } from '@mui/material';
import { ChangeEvent, FC, useState } from 'react';

// API
import { getFlow3DTestTask, postFlow3DTestTask } from './_api';

interface Request {
  x: string;
  y: string;
}

const TestTaskForm: FC = () => {
  const [request, setRequest] = useState<Request>({
    x: '',
    y: '',
  });

  const [taskId, setTaskId] = useState('')

  // Callbacks
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRequest((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  };

  const handleClick = async () => {
    await postFlow3DTestTask(request);
  };

  const handleClickTaskResult = async () => {
    await getFlow3DTestTask(taskId);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: "1em" }}>
      <TextField
        label="X"
        name="x"
        onChange={handleChange}
        value={request.x}
      />
      <TextField
        label="Y"
        name="y"
        onChange={handleChange}
        value={request.y}
      />
      <Button onClick={handleClick} variant="contained">
        Submit
      </Button>
      <TextField
        label="Task Result"
        name="task_result"
        onChange={(e) => setTaskId(e.target.value)}
        value={taskId}
      />
      <Button onClick={handleClickTaskResult} variant="contained">
        Submit
      </Button>
    </Box>
  );
};

export default TestTaskForm;
