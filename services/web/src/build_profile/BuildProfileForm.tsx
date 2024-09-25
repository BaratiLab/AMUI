/**
 * BuildProfileForm.tsx
 * BuildProfile form for creating and updating buildProfile.
 */

// Node Modules
import { Box, Button, TextField } from '@mui/material';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Actions
import { setBuildProfileForm } from 'build_profile/slice/form';

// API
import { postBuildProfile, putBuildProfile } from './_api';

// Hooks
import { useAppDispatch } from 'hooks';

// Types
interface Props {
  buildProfile?: {
    id: number,
    title: string,
    description?: string,
    created_on: string,
    updated_on: string,
  }
}

const BuildProfileForm: FC<Props> = ({ buildProfile }) => {
  // Hooks
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [request, setRequest] = useState({
    title: '',
    description: '',
  });
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    // Updates disabled state of the submit button.
    if (buildProfile) {
      setIsChanged(
        request.title !== buildProfile.title ||
        request.description !== buildProfile.description
      );
    } else {
      setIsChanged(request.title !== '' || request.description !== '');
    }
  }, [request, buildProfile])

  useEffect(() => {
    // Sets request form object to `buildProfile` prop.
    // `buildProfile` prop is provided if editing existing project.
    if (buildProfile) {
      setRequest({
        title: buildProfile.title,
        description: buildProfile.description,
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

  const handleClick = async () => {
    if (buildProfile) {
      // Sends request to update existing buildProfile.
      const { data, response } = await putBuildProfile(buildProfile.id, request);
      if (response.status === 200) {
        dispatch(setBuildProfileForm(data));
      }
    } else {
      // Sends request to create new buildProfile.
      const { data, response } = await postBuildProfile(request);
      if (response.status === 201) {
        navigate(`/buildProfiles/${data.id}`);
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
      <Button disabled={!isChanged} onClick={handleClick} variant="contained">
        Submit
      </Button>
    </Box>
  );
};

export default BuildProfileForm;