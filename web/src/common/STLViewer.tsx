/**
 * STLViewer.tsx
 * Component to upload and view STLs
 * TODO: Refactor component
 */

// Node Modules
import { Box, Button } from "@mui/material";
import { FC, useRef, useEffect, useState, ChangeEvent } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const STLViewer: FC<{ height: number; width: number }> = ({
  height,
  width,
}) => {
  // Hooks
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [camera, setCamera] = useState<THREE.Camera | null>(null);
  const [controls, setControls] = useState<OrbitControls | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
      renderer.setSize(width, height);
      setRenderer(renderer);

      setScene(new THREE.Scene());
      setCamera(new THREE.PerspectiveCamera(75, width / height, 0.1, 1000));
    }
  }, []);

  useEffect(() => {
    if (camera) {
      setControls(new OrbitControls(camera, renderer!.domElement));
    }
  }, [camera, renderer]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      scene?.remove(scene.children[0]);
      const stlFileUrl = e.target.files[0];
      const loader = new STLLoader();
      loader.load(URL.createObjectURL(stlFileUrl), (geometry) => {
        const material = new THREE.MeshNormalMaterial();
        const mesh = new THREE.Mesh(geometry, material);
        scene!.add(mesh);
        camera!.position.x = 5;
        camera!.position.y = 5;
        camera!.position.z = 5;
        controls!.update();
        animate(mesh);
      });
    }
  };

  const animate = (mesh: THREE.Mesh) => {
    requestAnimationFrame(() => animate(mesh));
    renderer!.render(scene!, camera!);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <canvas ref={canvasRef} />
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
      >
        Upload file
        <VisuallyHiddenInput type="file" onChange={handleFileChange} />
      </Button>
    </Box>
  );
};

export default STLViewer;
