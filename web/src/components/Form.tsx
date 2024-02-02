import { FC } from 'react';
import { Box, Input, Button } from '@mui/material';

const Form: FC<{ handler: any }> = ({ handler}) => {
    return (
        <Box display="flex" justifyContent="center" alignItems="center">
            <label htmlFor="power-input">Power&nbsp;</label>
            <Input id="power-input" type="number" inputProps={{ min: 25, max: 25000 }} defaultValue={25} />
            <label htmlFor="velocity-input">Velocity&nbsp;</label>
            <Input id="velocity-input" type="number" inputProps={{ min: 0.6, max: 8000 }} defaultValue={0.6} />
            <Button onClick={handler}>Submit</Button>
        </Box>
    );
};

export default Form;
