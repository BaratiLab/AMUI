/**
 * ViewSTL.tsx
 * Page to upload and view STL.
 */

// Node Modules
import { FC } from 'react';
import { Box, Typography } from '@mui/material';

// Components
import STLViewer from 'common/STLViewer';

const ViewSTL: FC = () =>  (
    <Box
        alignItems='center'
        display='flex'
        flexDirection='column'
        justifyContent='center'
    >
        <Typography variant='h3'>STL Viewer</Typography>
        <STLViewer height={600} width={600} />
    </Box>
);

export default ViewSTL;
