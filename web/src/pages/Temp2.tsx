import { FC } from 'react';
import { Box, Typography } from '@mui/material';
import DenseTable from '../components/table';
import { theme } from '../theme';
import { ThemeProvider } from '@mui/material/styles';

const Temp2: FC = () => {
    return (
        <ThemeProvider theme={theme}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            
              {/*<Typography variant="h1">Placeholder Page 2</Typography> */}

             <div>
             <DenseTable />
             </div>  
        </Box>
        </ThemeProvider>
        
        
    
    );
};

export default Temp2;
