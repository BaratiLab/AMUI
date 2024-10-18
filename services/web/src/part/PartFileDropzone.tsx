/**
 * PartFileDropzone.tsx
 * Dropzone component for creating Part File and Part entries.
 */

// Node Modules
import { Box, Button, Container, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { FC, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { StlViewer } from 'react-stl-viewer';
import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator';

// Hooks
import { useAppDispatch } from 'hooks';


// Actions
import { updatePart } from 'part/slice/partDetail';
import { createPartFile } from 'part/slice/partFileList';
import { createPart } from 'part/slice/partList';

// Config
const customConfig: Config = {
  dictionaries: [adjectives, colors, animals],
  separator: ' ',
  style: 'capital',
  length: 2,
};

// Types
import { PartDetailResponse, PartFileListCreateResponse, PartListCreateResponse } from 'part/_types';

interface Props {
  part?: PartDetailResponse | null
}

interface PartFileRequest {
  file: File | null;
}

interface PartRequest {
  id?: number;
  name: string;
  part_file_id: number | null;
  part_file_ids: number[];
}

const PartFileDropzone: FC<Props> = ({ part = null }) => {

  // Hooks
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [partFileRequest, setPartFileRequest] = useState<PartFileRequest>({
    file: null
  });

  const [partRequest, setPartRequest] = useState<PartRequest>({
    name: uniqueNamesGenerator(customConfig),
    part_file_id: null,
    part_file_ids: [],
  });

  const [stlURL, setSTLURL] = useState("")

  const {getRootProps, getInputProps} = useDropzone({
    accept: {
      "application/octet-stream": [".stl"]
    },
    maxFiles: 1,
    onDropAccepted: (files: Array<File>) => {
      // Set file to request on accepted drop.
      setPartFileRequest({
        file: files[0]
      })

      setSTLURL(URL.createObjectURL(files[0]))
    },
  });

  useEffect(() => {
    // Sets request form object to `part` prop.
    // `part` prop is provided if editing existing project.
    if (part) {
      setPartRequest({
        id: part.id,
        name: part.name,
        part_file_id: part.part_file.id,
        part_file_ids: part.part_files.map((partFile) => partFile.id),
      });

      if (part.part_file.file) {
        setSTLURL(part.part_file.file)
      }
    }
  }, [part]);

  // Callbacks
  const handleUpload = async () => {
    console.log("upload")
    // Create a new Part File and Part entry.
    // TODO: Create a single route to handle this on the backend.
    const partFileResponse = await dispatch(createPartFile(partFileRequest));
    const partFilePayload = partFileResponse.payload as PartFileListCreateResponse;
    if (partFilePayload?.code === 201 ) {
      const partFileId = partFilePayload?.data.id;
      setPartFileRequest({
        file: null
      })
      if (part) {
        // Updates Part
        const request = {
          ...partRequest,
          part_file_id: partFileId,
          part_file_ids: [partFileId, ...partRequest.part_file_ids],
        };
        await dispatch(updatePart(request));
      } else {
        const request = {
          ...partRequest,
          part_file_id: partFileId,
          part_file_ids: [partFileId],
        };
        const partResponse = await dispatch(createPart(request));
        const partPayload = partResponse.payload as PartListCreateResponse
        if (partPayload?.code === 201) {
          const partId = partPayload?.data.id;
          console.log(partId)
          navigate(`/part/${partId}`);
        }
      }
    }
  };

  // JSX 
  const stlViewerJSX = (partFileRequest.file || part?.part_file) && (
    <StlViewer
      orbitControls
      shadows
      style={{ height: "75vh" }}
      url={stlURL}
    />
  );

  const uploadSTLButtonJSX = partFileRequest.file !== null && (
    <Button
      endIcon={<SendIcon />}
      fullWidth
      onClick={handleUpload}
      variant="contained"
    >
      Upload File
    </Button>
  );

  return (
    <Container sx={{ display: "flex", flexDirection: "column",  gap: 1 }}>
      {stlViewerJSX}
      {uploadSTLButtonJSX}
      <Box
        sx={{
          alignItems: 'center',
          border: '0.25em dashed grey',
          borderRadius: 1,
          display: "flex",
          flexDirection: 'column',
          height: 200,
          justifyContent: 'center',
        }}
        {...getRootProps({className: 'dropzone'})} 
      >
        <input {...getInputProps()} />
        <Typography variant="h6">Upload your Part Here</Typography>
      </Box>
    </Container>
  );
};

export default PartFileDropzone;
