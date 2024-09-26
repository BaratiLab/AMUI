/**
 * BuildProfileForm.tsx
 * BuildProfile form for creating and updating buildProfile.
 */

// Node Modules
import { Box, Button, TextField } from '@mui/material';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Actions
import { updateBuildProfile } from 'build_profile/slice/detail';
import { createBuildProfile } from 'build_profile/slice/list';

// Enums
import { Status } from 'enums';

// Hooks
import { useAppDispatch, useAppSelector } from 'hooks';

// Types
import { BuildProfile } from 'build_profile/_types';
interface Props {
  buildProfile: BuildProfile | null
}

const BuildProfileForm: FC<Props> = ({ buildProfile = null }) => {
  // Hooks
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [request, setRequest] = useState({
    title: '',
    description: '',
  });
  const [isChanged, setIsChanged] = useState(false);

  const { create } = useAppSelector((state) => state.buildProfileList);

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

  useEffect(() => {
    // Navigates to build profile page on successful creation.
    if (create.status === Status.Succeeded) {
      const buildProfileId = create.response?.id;
      navigate(`/build_profile/${buildProfileId}`);
    }
  }, [navigate, create.status])

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
      dispatch(updateBuildProfile({
        // Adds id for update request
        id: buildProfile.id,
        ...request,
      }));
    } else {
      // Sends request to create new build profile.
      dispatch(createBuildProfile(request));
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