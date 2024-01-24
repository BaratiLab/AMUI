import { FC } from 'react';
import { Box} from '@mui/material';
import DenseTable from '../components/table';


const Temp2: FC = () => {
    return (
        
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            
              

             <div>
             <DenseTable />
             </div>  
        </Box>
       
        
        
    
    );
};

export default Temp2;
