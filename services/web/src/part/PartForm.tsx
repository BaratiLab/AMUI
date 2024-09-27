/**
 * PartForm.tsx
 * Part form for creating and updating part.
 */

// Node Modules
import { Box, Button, SelectChangeEvent, TextField } from '@mui/material';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Actions
import { updatePart } from 'part/slice/detail';
import { createPart } from 'part/slice/list';

// Components
// import MaterialSelect from 'material/MaterialSelect';

// Enums
import { Status } from 'enums';

// Hooks
import { useAppDispatch, useAppSelector } from 'hooks';

// Types
import { Part, PartListCreateResponse, PartDetailUpdateResponse } from 'part/_types';

interface Props {
  part?: Part | null
}

interface Request {
  name: string;
}

const PartForm: FC<Props> = ({ part = null }) => {
  // Hooks
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [request, setRequest] = useState<Request>({
    name: '',
  });

  const [isChanged, setIsChanged] = useState(false);

  const { create } = useAppSelector((state) => state.partList);

  useEffect(() => {
    // Updates disabled state of the submit button.
    if (part) {
      setIsChanged(
        request.name !== part.name
      );
    } else {
      setIsChanged(request.name !== '');
    }
  }, [request, part])

  useEffect(() => {
    // Sets request form object to `part` prop.
    // `part` prop is provided if editing existing project.
    if (part) {
      setRequest({
        name: part.name,
      });
    }
  }, [part]);

  useEffect(() => {
    // Navigates to build profile page on successful creation.
    if (create.status === Status.Succeeded) {
      const partId = create.response?.id;
      navigate(`/part/${partId}`);
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

  // const handleMaterialSelect = (e: SelectChangeEvent) => {
  //   const { value } = e.target;
  //   setRequest((prevState) => ({
  //     ...prevState,
  //     material: Number(value),
  //   }));
  // };

  const handleClick = async () => {
    if (part) {
      // Sends request to update existing part.
      const { payload } = await dispatch(updatePart({
        // Adds id for update request
        id: part.id,
        ...request,
      }));
      if ((payload as PartDetailUpdateResponse)?.code === 200 ) {
        navigate("/part");
      }
    } else {
      // Sends request to create new build profile.
      const { payload } = await dispatch(createPart(request));
      if ((payload as PartListCreateResponse)?.code === 201 ) {
        navigate("/part");
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: "1em" }}>
      <TextField
        label="Name"
        name="name"
        onChange={handleChange}
        value={request.name}
      />
      <Button disabled={!isChanged} onClick={handleClick} variant="contained">
        Submit
      </Button>
    </Box>
  );
};

export default PartForm;