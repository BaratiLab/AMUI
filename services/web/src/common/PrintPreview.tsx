/**
 * PrintPreview.tsx
 * Displays `.stl` and `.gcode` previews for print projects.
 * TODO: Think of a better (more specifc) component name for this.
 */

// Node Modules
import { OrbitControls, OrthographicCamera } from '@react-three/drei';
import { Canvas, Euler, Vector3 } from '@react-three/fiber'
import { number, object, string } from 'prop-types';
import { CSSProperties, FC, Suspense, useEffect, useState } from 'react';
import styled from '@emotion/styled'
import { BufferGeometry, Group } from 'three';
import { GCodeLoader } from 'three/examples/jsm/loaders/GCodeLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

// Enums
enum FileType {
  Gcode = 'gcode',
  Stl = 'stl',
}

// Styled Components
export const StyledPrintPreview = styled.div`
  background-color: white;
  border-radius: 0.5em;
  display: flex;
  flex-direction: column;
  grid-area: print-preview;
  gap: 1em;
  padding: 1em;
`;

export const StyledPrintPreviewTabs = styled.div`
  display: flex;
  gap: 0.5em;

  button {
    border-radius: 0.5em;
    border-style: none;
    background-color: transparent;
    font-size: 1.5em;
    transition-duration: 250ms;

    :hover:enabled {
      background-color: rgba(0, 0, 0, 0.1);
      cursor: pointer;
    }
  }
`;

export const StyledPrintPreviewModel = styled.div`
  aspect-ratio: 1 / 1;
`;

export const StyledPrintPreviewCanvas = styled(Canvas)`
  border-radius: 0.5em;
  background-color: #eee;
`;

// Types
export interface Props {
  className?: string;
  gcodeMeshRotation?: Euler,
  gcodePosition?: Euler;
  gcodeScale?: number;
  gcodeUrl?: string;
  stlMeshRotation?: Euler,
  stlPosition?: Vector3;
  stlScale?: number;
  stlUrl: string;
  style?: CSSProperties;
}

const PrintPreview: FC<Props> = ({
  className,
  gcodeMeshRotation,
  gcodePosition,
  gcodeScale,
  gcodeUrl,
  stlMeshRotation,
  stlPosition,
  stlScale,
  stlUrl,
  style,
}) => {
  // Hooks
  const [fileType, setFileType] = useState(FileType.Stl);
  const [geometry, setGeometry] = useState<BufferGeometry>();

  // `{} as Group` is a hacky fix to resolve 
  // Type error: Type 'Group | undefined' is not assignable to type 'object'.
  const [object, setObject] = useState<Group>({} as Group);

  useEffect(() => {
    // Utilizes STL loader to set geometry from .stl url to state.
    const stlLoader = new STLLoader();
    stlLoader.load(stlUrl, geo => { setGeometry(geo) });
  }, [stlUrl]);

  useEffect(() => {
    if (gcodeUrl) {
      const gcodeLoader = new GCodeLoader();
      gcodeLoader.load(gcodeUrl, object => { setObject(object) });
    }
  }, [gcodeUrl]);

  // JSX
  const meshJSX = () => {
    switch(fileType) {
      case FileType.Gcode:
        return (
          <primitive
            object={object}
            position={gcodePosition}
            rotation={gcodeMeshRotation}
            scale={gcodeScale}
          />
        );
      case FileType.Stl:
        return (
          <mesh
            geometry={geometry}
            scale={stlScale}
            position={stlPosition}
            rotation={stlMeshRotation}
          >
            <meshStandardMaterial color="#757575" />
          </mesh>
        );
    }
  };

  const gcodeButtonJSX = gcodeUrl && (
    <button
      disabled={fileType === FileType.Gcode}
      onClick={() => setFileType(FileType.Gcode)}
    >
      GCode
    </button>
  );

  return (
    <StyledPrintPreview className={className} style={style}>
      <StyledPrintPreviewTabs>
        <button
          disabled={fileType === FileType.Stl}
          onClick={() => setFileType(FileType.Stl)}
        >
          STL
        </button>
        {gcodeButtonJSX}
      </StyledPrintPreviewTabs>
      <StyledPrintPreviewModel>
        {/* `<PrintPreviewTabs />` here causes overlap with elements below. */}
        <StyledPrintPreviewCanvas orthographic={true}>
          <Suspense fallback={null}>
            <OrthographicCamera getObjectsByProperty={true} makeDefault position={[500, 500, 500]}>
              <pointLight castShadow={true} intensity={0.5} position={[-1000, 0, 1000]}/>
              <pointLight castShadow={true} intensity={0.5} position={[1000, 0, 1000]}/>
            </OrthographicCamera>
            {meshJSX()}
            <OrbitControls />
          </Suspense>
        </StyledPrintPreviewCanvas >
      </StyledPrintPreviewModel>
    </StyledPrintPreview>
  );
};

export default PrintPreview;

PrintPreview.defaultProps = {
  gcodePosition: [-150, -150, 0],
  gcodeScale: 1,
  stlMeshRotation: [-Math.PI / 2, 0, 0],
  stlScale: 1,
};

PrintPreview.propTypes = {
  className: string,
  gcodeScale: number,
  gcodeUrl: string,
  stlScale: number,
  stlUrl: string.isRequired,
  style: object,
};
