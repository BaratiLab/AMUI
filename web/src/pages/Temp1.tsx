import { FC } from 'react';
import { Box, Typography } from '@mui/material';
import STLViewer from '../components/STLViewer';

const Temp1: FC = () => {
    return (
        <Box display='flex' justifyContent='center' alignItems='center' flexDirection='column'>
            <Typography variant='h3'>STL Viewer</Typography>
            <STLViewer height={600} width={600} />
        </Box>
    );
};

export default Temp1;
