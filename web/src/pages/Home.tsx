import { FC } from 'react';
import { Box, Typography } from '@mui/material';

const Home: FC = () => {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            <Typography variant="h1">Home Page</Typography>
        </Box>
    );
};

export default Home;
