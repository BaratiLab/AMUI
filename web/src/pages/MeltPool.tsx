/**
 * MeltPool.tsx
 * Example component for retrieving melt pool data from Django
 */

// Node Modules
import { FC } from 'react';
import { Box, Typography } from '@mui/material';

// Components
import ClassificationRecords from 'melt_pool/ClassificationsRecords';
import GeometryRecords from 'melt_pool/GeometryRecords';

const MeltPool: FC = () => (
    <Box
        alignItems='center'
        display='flex'
        flexDirection='column'
        justifyContent='center'
    >
        <Typography variant='h3'>Melt Pool</Typography>
        <ClassificationRecords /> 
        <GeometryRecords />
    </Box>
);

export default MeltPool;
