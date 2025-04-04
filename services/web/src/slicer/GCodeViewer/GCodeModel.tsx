import React, { CSSProperties, useEffect, useMemo, useRef, useState } from 'react'
import { Color } from 'three'
import { GCode, GCodeParseProgress } from './gcode/GCode'
import { BaseReader } from './gcode/reader'
import { GPoint } from './gcode/types'
import GCodeLines from './GCodeLines'
import Camera, { CameraInitialPosition } from './SceneElements/Camera'
import Floor from './SceneElements/Floor'
import OrbitControls from './SceneElements/OrbitControls'

const DEFAULT_HEIGHT = 20
const DEFAULT_CENTER = { x: 100, y: 100 }
const BACKGROUND = new Color('white')
const BASE_OPACITY = 0.7

export interface FloorProps {
  gridWidth?: number
  gridLength?: number
}

export interface GCodeViewerContentProps {
  onLayersLoaded?: (layers: number) => any
  layer?: number

  reader: BaseReader
  cameraInitialPosition?: CameraInitialPosition
  layerColor?: CSSProperties['color']
  topLayerColor?: CSSProperties['color']
  floorProps?: FloorProps
  visible?: number
  showAxes?: boolean
  orbitControls?: boolean
  quality?: number
  onProgress?: (progress: GCodeParseProgress) => any
  onFinishLoading?: (finish: GCodeParseProgress) => any
  onError?: (err: Error) => any
}

interface GPointBatch {
  points: GPoint[]
  avgZ: number
}

const GCodeModel: React.FC<GCodeViewerContentProps> = (
  {
    layer = null,
    onLayersLoaded = () => {},

    reader,
    cameraInitialPosition = {
      latitude: Math.PI / 8,
      longitude: -Math.PI / 8,
      distance: 50
    },
    layerColor = 'white',
    topLayerColor = 'white',
    visible = 1,
    quality = 1,
    showAxes = false,
    orbitControls = false,
    onProgress = () => {},
    onFinishLoading = () => {},
    floorProps: {
      gridLength = 0,
      gridWidth = 0
    } = {},
    onError,
  }
) => {
  const [sceneReady, setSceneReady] = useState(false)

  const gCodeRef = useRef<GCode>()
  const callbacks = useRef({ onFinishLoading, onError, onProgress })
  useEffect(() => {
    callbacks.current.onFinishLoading = onFinishLoading
    callbacks.current.onError = onError
    callbacks.current.onProgress = onProgress
  }, [onFinishLoading, onError, onProgress])

  const [center, setCenter] = useState(DEFAULT_CENTER)
  const [gPointBatches, setGPointBatches] = useState<GPointBatch[]>([])
  const [zLayers, setZLayers] = useState<GPointBatch[][]>([])

  useEffect(() => {
    function onGCodeProgress ({ points, baseCenter }: GCodeParseProgress): void {
      setGPointBatches(prev => {
        const sum = prev.reduce((acc, p) => acc+p.points.length, 0)
        const batchPoints = points.slice(sum)
        if (batchPoints.length === 0) {
          return prev
        }
        const avgZ = batchPoints.reduce((acc, p) => acc + p.z, 0) / (Math.max(batchPoints.length, 1))
        return [...prev, { points: batchPoints, avgZ }]
      })
      setCenter(prev =>
        prev.x !== baseCenter.x && prev.y !== baseCenter.y ? baseCenter : prev
      )
      setSceneReady(true)
    }

    function onGCodeFinish ({ points, baseCenter }: GCodeParseProgress): void {
      const pointsZLayers = points.reduce((acc, point, index, array) => {
        const accLength = acc.length;
        if (!acc.length) {
          // Handles first case
          acc = [[point]]
        } else {
          const prevLayerIndex = accLength - 1;
          const prevPoint = array[index - 1]
          const prevZ = prevPoint.z;
          const currentZ = point.z;

          if (prevZ === currentZ) {
            acc[prevLayerIndex].push(point);
          } else {
            acc.push([point]);
          }
        }
        return acc;
      }, [])

      console.log("pointsZLayers", pointsZLayers);
      setZLayers(pointsZLayers);
      onLayersLoaded(pointsZLayers);
    }

    setGPointBatches([])
    gCodeRef.current?.abort()
    gCodeRef.current = new GCode({
      quality,
      onProgress: (progress) => {
        onGCodeProgress(progress)
        if (callbacks.current.onProgress != null) {
          callbacks.current.onProgress(progress)
        }
      },
      onFinished: (progress) => {
        onGCodeProgress(progress)
        onGCodeFinish(progress)
        if (callbacks.current.onFinishLoading != null) {
          callbacks.current.onFinishLoading(progress)
        }
      }
    })

    gCodeRef.current.parse(reader).catch((err) => {
      if (callbacks.current.onError != null) {
        callbacks.current.onError(err)
      }
    })

  }, [reader, quality])

  const maxZ = useMemo(() => Math.max(...gPointBatches.map(({ avgZ }) => avgZ)), [gPointBatches])
  const visibleZ = maxZ*Math.min(visible, 1)

  const filteredGPoints = gPointBatches.filter(({ avgZ }) => avgZ <= visibleZ)

  const isLastLayerBatch = (batch: GPointBatch): boolean =>
    batch === filteredGPoints[filteredGPoints.length-1] || Math.abs(visibleZ - batch.avgZ) < 0.4

  const color = (batch: GPointBatch): string => isLastLayerBatch(batch) ? topLayerColor : layerColor
  const opacity = (batch: GPointBatch): number => (batch.avgZ/visibleZ)*(1-BASE_OPACITY)+BASE_OPACITY
  const lineWidth = (batch: GPointBatch): number => isLastLayerBatch(batch) ? 2 : 0.1

  const modelCenter = useMemo<[number, number, number]>(() =>
    [center.x, center.y, DEFAULT_HEIGHT]
  , [center.x, center.y])

  const gridCenter = useMemo<[number, number, number] | undefined>(() =>
    gridWidth > 0 && gridLength > 0 ? [gridWidth / 2, gridLength / 2, DEFAULT_HEIGHT] : undefined
  , [gridWidth, gridLength])

  const cameraCenter = gridCenter ?? modelCenter

  // JSX
  const layerOrModelJSX = layer === null ? (
    filteredGPoints.map((pointBatch, i) =>
        <GCodeLines
            key={`${i} ${pointBatch.points.length}`}
            points={pointBatch.points}
            color={color(pointBatch)}
            opacity={sceneReady ? opacity(pointBatch) : 0}
            linewidth={lineWidth(pointBatch)}
        />
    )
  ) : (
    zLayers.length && (
        <GCodeLines
            points={zLayers[layer]}
            // color={color(pointBatch)}
            opacity={sceneReady ? 1 : 0}
            // linewidth={lineWidth(pointBatch)}
        />
    )
  );

  return (
        <>
            <Camera
                initialPosition={cameraInitialPosition}
                center={cameraCenter}
            />
            {sceneReady && showAxes &&
                <axesHelper args={[50]}/>
            }
            <Floor
                visible={sceneReady}
                length={gridLength}
                width={gridWidth}
            />
            <scene background={BACKGROUND}/>
            {sceneReady && orbitControls &&
                <OrbitControls target={cameraCenter}/>
            }
            <group>
                {layerOrModelJSX}
                {/* {filteredGPoints.map((pointBatch, i) =>
                    <GCodeLines
                        key={`${i} ${pointBatch.points.length}`}
                        points={pointBatch.points}
                        color={color(pointBatch)}
                        opacity={sceneReady ? opacity(pointBatch) : 0}
                        linewidth={lineWidth(pointBatch)}
                    />
                )} */}
            </group>
        </>
  )
}

export default GCodeModel
