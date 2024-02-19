import { FC } from 'react';
import { Box, Input, Button } from '@mui/material';

const Form: FC<{ handler: any }> = ({ handler}) => {
    return (
        <Box display="flex" justifyContent="center" alignItems="center">
            <label htmlFor="power-input">Power&nbsp;</label>
            <Input id="power-input" type="number" />
            <label htmlFor="velocity-input">Velocity&nbsp;</label>
            <Input id="velocity-input" type="number" />

            <label htmlFor="material-input">Material&nbsp;</label>
            <select name="material" id="material-input">
                <option value="">--Select an option--</option>
                <option value="SS304L">SS304L</option>
                <option value="TiC/Inconel 718">TiC/Inconel 718</option>
                <option value="Ti-49Al-2Cr-2Nb">Ti-49Al-2Cr-2Nb</option>
                <option value="Al-C-Co-Fe-Mn-Ni">Al-C-Co-Fe-Mn-Ni</option>
                <option value="Cu10Sn">Cu10Sn</option>
                <option value="K403 superalloy">K403 superalloy</option>
                <option value="SS17-4PH">SS17-4PH</option>
                <option value="Al-2.5Fe">Al-2.5Fe</option>
                <option value="MS1-">MS1-</option>
                <option value="Ni-5Nb">Ni-5Nb</option>
                <option value="AA7075">AA7075</option>
                <option value="HCP Cu">HCP Cu</option>
                <option value="SS316L">SS316L</option>
                <option value="Zn-2Al">Zn-2Al</option>
                <option value="Ti-45Al">Ti-45Al</option>
                <option value="SS304">SS304</option>
                <option value="IN625">IN625</option>
                <option value="Tungsten">Tungsten</option>
                <option value="IN738LC">IN738LC</option>
                <option value="AlSi10Mg">AlSi10Mg</option>
                <option value="Ti-6Al-4V">Ti-6Al-4V</option>
                <option value="WE43">WE43</option>
                <option value="Ti6242">Ti6242</option>
                <option value="Co-Cr-Fe-Mn-Ni">Co-Cr-Fe-Mn-Ni</option>
                <option value="Invar36">Invar36</option>
                <option value="CMSX-4">CMSX-4</option>
                <option value="Hastelloy X">Hastelloy X</option>
                <option value="4140 steel">4140 steel</option>
                <option value="IN718">IN718</option>
            </select>
            <label htmlFor="hatch-input">Hatch Spacing&nbsp;</label>
            <Input id="hatch-input" type="number" />

            <label htmlFor="process-input">Process&nbsp;</label>
            <select name="process" id="process-input">
                <option value="">--Select an option--</option>
                <option value="PBF">PBF</option>
                <option value="DED">DED</option>
            </select>

            {/* <label htmlFor="subprocess-input">Sub-Process&nbsp;</label>
            <Input id="subprocess-input" /> */}

            <Button onClick={handler}>Submit</Button>
        </Box>
    );
};

export default Form;
