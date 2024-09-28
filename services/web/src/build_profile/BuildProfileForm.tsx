/**
 * BuildProfileForm.tsx
 * BuildProfile form for creating and updating buildProfile.
 */

// Node Modules
import { Box, Button, SelectChangeEvent, TextField } from '@mui/material';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Actions
import { updateBuildProfile } from 'build_profile/slice/detail';
import { createBuildProfile } from 'build_profile/slice/list';

// Components
import MaterialSelect from 'material/MaterialSelect';
import MachineSelect from 'machine/MachineSelect';

// Hooks
import { useAppDispatch } from 'hooks';

// Types
import {
  BuildProfileRequest,
  BuildProfileListCreateResponse,
  BuildProfileDetailUpdateResponse,
} from 'build_profile/_types';

interface Props {
  buildProfile?: BuildProfileRequest | null
}

interface Request {
  title: string;
  description: string;
  machine_id: number | null;
  material_id: number | null;
}

const BuildProfileForm: FC<Props> = ({ buildProfile = null }) => {
  // Hooks
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [request, setRequest] = useState<Request>({
    title: '',
    description: '',
    machine_id: null,
    material_id: null,
  });

  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    // Updates disabled state of the submit button.
    if (buildProfile) {
      setIsChanged(
        request.title !== buildProfile.title ||
        request.description !== buildProfile.description ||
        request.machine_id !== buildProfile.machine_id ||
        request.material_id !== buildProfile.material_id 
      );
    } else {
      setIsChanged(
        request.title !== '' ||
        request.description !== '' ||
        request.machine_id !== null ||
        request.material_id !== null
      );
    }
  }, [request, buildProfile])

  useEffect(() => {
    // Sets request form object to `buildProfile` prop.
    // `buildProfile` prop is provided if editing existing project.
    if (buildProfile) {
      setRequest({
        title: buildProfile.title,
        description: buildProfile.description,
        machine_id: buildProfile.machine_id || null,
        material_id: buildProfile.material_id || null
      });
    }
  }, [buildProfile]);

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
      [name]: Number(value),
    }));
  };

  const handleClick = async () => {
    if (buildProfile) {
      // Sends request to update existing buildProfile.
      const { payload } = await dispatch(updateBuildProfile({
        // Adds id for update request
        id: buildProfile.id,
        ...request,
      }));
      if ((payload as BuildProfileDetailUpdateResponse)?.code === 200 ) {
        navigate("/build_profile");
      }
    } else {
      // Sends request to create new build profile.
      const { payload } = await dispatch(createBuildProfile(request));
      if ((payload as BuildProfileListCreateResponse)?.code === 201 ) {
        navigate("/build_profile");
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: "1em" }}>
      <TextField
        label="Title"
        name="title"
        onChange={handleChange}
        value={request.title}
      />
      <TextField
        label="Description"
        multiline
        name="description"
        onChange={handleChange}
        rows={4}
        value={request.description}
      />
      <MaterialSelect value={request.material_id} onChange={handleSelect} />
      <MachineSelect value={request.machine_id} onChange={handleSelect} />
      <Button disabled={!isChanged} onClick={handleClick} variant="contained">
        Submit
      </Button>
    </Box>
  );
};

export default BuildProfileForm;