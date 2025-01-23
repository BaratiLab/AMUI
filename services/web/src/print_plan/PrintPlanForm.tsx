/**
 * PrintPlanForm.tsx
 * PrintPlan form for creating and updating printPlan.
 */

// Node Modules
import { Box, Button, Container, SelectChangeEvent, TextField } from '@mui/material';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StlViewer } from 'react-stl-viewer';

// Actions
import { createPrintPlanGenerateGCode, updatePrintPlan } from 'print_plan/slice/detail';
import { createPrintPlan } from 'print_plan/slice/list';

// Components
import BuildProfileSelect from 'build_profile/BuildProfileSelect';
import PartSelect from 'part/PartSelect';
import GCodeLayerViewer from 'slicer/GCodeLayerViewer';

// Hooks
import { useAppDispatch, useAppSelector } from 'hooks';

// Types
import {
  PrintPlanDetailResponse,
  PrintPlanListCreateResponse,
  PrintPlanDetailUpdateResponse,
} from 'print_plan/_types';

interface Props {
  printPlan?: PrintPlanDetailResponse | null
}

interface Request {
  name: string;
  build_profile_id: number | null;
  part_id: number | null;
}

const PrintPlanForm: FC<Props> = ({ printPlan = null }) => {
  // Hooks
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [request, setRequest] = useState<Request>({
    name: '',
    build_profile_id: null,
    part_id: null,
  });

  const [isChanged, setIsChanged] = useState(false);
  const {record: partListRecord} = useAppSelector((state) => state.partList)

  useEffect(() => {
    // Updates disabled state of the submit button.
    if (printPlan) {
      setIsChanged(
        request.name !== printPlan.name ||
        request.build_profile_id !== printPlan.build_profile?.id ||
        request.part_id !== printPlan.part?.id
      );
    } else {
      setIsChanged(
        request.name !== '' ||
        request.build_profile_id !== null ||
        request.part_id !== null
      );
    }
  }, [request, printPlan])

  useEffect(() => {
    // Sets request form object to `printPlan` prop.
    // `printPlan` prop is provided if editing existing project.
    if (printPlan) {
      setRequest({
        name: printPlan.name,
        build_profile_id: printPlan.build_profile?.id || null,
        part_id: printPlan.part?.id || null
      });
    }
  }, [printPlan]);

  // Callbacks
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRequest((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  };

  const handleSelect = (e: SelectChangeEvent) => {
    const { name, value } = e.target;

    setRequest((prevState) => ({
      ...prevState,
      [name]: Number(value) || null,
    }));
  };

  const handlePartSelect = (e: SelectChangeEvent) => {
    const { name, value } = e.target;

    if (printPlan === null) {
      // Autogenerate print plan name based on part
      const partName = partListRecord[value]?.name || ""
      setRequest((prevState) => ({
        ...prevState,
        [name]: Number(value) || null,
        name: `${partName} Print`,
      }));
    } else {
      setRequest((prevState) => ({
        ...prevState,
        [name]: Number(value) || null,
      }));
    }
  };

  const handleClick = async () => {
    if (printPlan) {
      // Sends request to update existing printPlan.
      const { payload } = await dispatch(updatePrintPlan({
        // Adds id for update request
        id: printPlan.id,
        ...request,
      }));
      if ((payload as PrintPlanDetailUpdateResponse)?.code === 200 ) {
        navigate("/print_plan");
      }
    } else {
      // Sends request to create new build profile.
      const { payload } = await dispatch(createPrintPlan(request));
      if ((payload as PrintPlanListCreateResponse)?.code === 201 ) {
        navigate("/print_plan");
      }
    }
  };

  const handleGenerateGCodeClick = async () => {
    if (printPlan?.id) {
      const { payload } = await dispatch(
        createPrintPlanGenerateGCode(printPlan.id.toString())
      );
      console.log(payload)
    }
  };

  // JSX 
  const stlViewerJSX = printPlan?.part?.part_file.file && (
    <>
      <Container sx={{display: "flex", alignItems: "center", justifyContent: "center"}}>
        <StlViewer
          orbitControls
          shadows
          style={{ height: "50vh", width: "700px"}}
          url={printPlan?.part?.part_file.file}
        />
        {printPlan.gcode_file && <GCodeLayerViewer url={printPlan.gcode_file} />}
      </Container>
      <Button onClick={handleGenerateGCodeClick}>
        Slice Part
      </Button>
    </>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: "1em" }}>
      {stlViewerJSX}
      <TextField
        label="Name"
        name="name"
        onChange={handleChange}
        value={request.name}
      />
      <PartSelect value={request.part_id} onChange={handlePartSelect} />
      <BuildProfileSelect
        value={request.build_profile_id}
        onChange={handleSelect}
      />
      <Button disabled={!isChanged} onClick={handleClick} variant="contained">
        Submit
      </Button>
    </Box>
  );
};

export default PrintPlanForm;