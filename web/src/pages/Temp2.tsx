import { FC } from 'react';
import { Box } from '@mui/material';
import DenseTable from '../components/table';


const colNames = ['Dessert (100g serving)', 'Calories', 'Fat (g)', 'Carbs (g)', 'Protein (g)'];
const rows = [
    ['Frozen yoghurt', '159', '6', '24', '4'],
    ['Ice cream sandwich', '237', '9', '37', '4.3'],
    ['Eclair', '262', '16', '24', '6'],
    ['Cupcake', '305', '3.7', '67', '4.3'],
    ['Gingerbread', '356', '16', '49', '3.9']
];

const Temp2: FC = () => {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            <div>
                <DenseTable colNames={colNames} rows={rows} />
            </div>
        </Box>
    );
};

export default Temp2;
