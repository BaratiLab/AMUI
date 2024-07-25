/**
 * ProcessMapChart.tsx
 * Visx chart component for displaying process map data.
 * https://airbnb.io/visx/dots
 */

// Node Modules
import { FC, useMemo, useState, useCallback, useRef } from 'react';
import { Group } from '@visx/group';
import { Circle } from '@visx/shape';
import { GradientSteelPurple } from '@visx/gradient';
import { scaleLinear } from '@visx/scale';
import { PointsRange } from '@visx/mock-data/lib/generators/genRandomNormalPoints';
import { withTooltip, Tooltip } from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { voronoi, VoronoiPolygon } from '@visx/voronoi';
import { localPoint } from '@visx/event';

// Types
import { MeltPoolDimension } from 'melt_pool/_types';
interface Defects {
  lackOfFusion: number;
  balling: number;
  keyholing: number;
}

interface DefectsMap {
  [key: string]: Defects;
}
interface Props {
  width: number;
  height: number;
  meltPoolDimensions: MeltPoolDimension[];
  processMap:DefectsMap;
  domains: [number, number][];
  showControls?: boolean;
};

let tooltipTimeout: number;

const ProcessMapChart: FC<Props & WithTooltipProvidedProps<PointsRange>> = 
  ({
    width,
    height,
    meltPoolDimensions,
    processMap,
    domains,
    showControls = true,
    hideTooltip,
    showTooltip,
    tooltipOpen,
    tooltipData,
    tooltipLeft,
    tooltipTop,
  }) => {
    if (width < 10) return null;

    // Hooks
    const [showVoronoi, setShowVoronoi] = useState(showControls);
    const svgRef = useRef<SVGSVGElement>(null);

    const xScale = useMemo(
      () =>
        scaleLinear<number>({
          domain: domains[0],
          range: [0, width],
          clamp: true,
        }),
      [width, domains],
    );

    const yScale = useMemo(
      () =>
        scaleLinear<number>({
          domain: domains[1],
          range: [height, 0],
          clamp: true,
        }),
      [height, domains],
    );

    const dimensionScale = useMemo(
      () =>
        scaleLinear<number>({
          domain: domains[2],
          range: [0, 10],
          clamp: true,
        }),
      [domains],
    );

    const voronoiLayout = useMemo(
      () => {
        const points: PointsRange[] = meltPoolDimensions.map((d) => [d["velocity"], d["power"], 0])
        return voronoi<PointsRange>({
          x: (d) => xScale(d[0]) ?? 0,
          y: (d) => yScale(d[1]) ?? 0,
          width,
          height,
        })(points)
      }, [width, height, xScale, yScale, meltPoolDimensions],
    );

    // Callbacks
    const handleMouseMove = useCallback(
      (event: React.MouseEvent | React.TouchEvent) => {
        if (tooltipTimeout) clearTimeout(tooltipTimeout);
        if (!svgRef.current) return;

        // find the nearest polygon to the current mouse position
        const point = localPoint(svgRef.current, event);
        if (!point) return;
        const neighborRadius = 100;
        const closest = voronoiLayout.find(point.x, point.y, neighborRadius);
        if (closest) {
          showTooltip({
            tooltipLeft: xScale(closest.data[0]),
            tooltipTop: yScale(closest.data[1]),
            tooltipData: closest.data,
          });
        }
      },
      [xScale, yScale, showTooltip, voronoiLayout],
    );

    const handleMouseLeave = useCallback(() => {
      tooltipTimeout = window.setTimeout(() => {
        hideTooltip();
      }, 300);
    }, [hideTooltip]);

    // JSX
    const pointsJSX = meltPoolDimensions.map((dimension, i) => {
      const point = [dimension["velocity"], dimension["power"]]
      return (
        <Circle
          key={`dimension-${dimension["power"]}-${dimension["velocity"]}`}
          className="dot"
          cx={xScale(point[0])}
          cy={yScale(point[1])}
          r={dimensionScale((dimension["depths_std"] + dimension["widths_std"] + dimension["lengths_std"])/3)}
          fill={tooltipData === point ? 'white' : '#f6c431'}
        />
      )
    });

    const voronoiLayoutJSX = voronoiLayout
      .polygons()
      .map((polygon, i) => {
        const key = `${polygon.data[1]}-${polygon.data[0]}`;

        const keyholing = processMap[key]["keyholing"] <= 1.5;
        const balling = processMap[key]["balling"] > 2.3;
        const lackOfFusion = processMap[key]["lackOfFusion"] >= 1;

        let fill = "green";
        if (keyholing) {
          fill = "red";
        } else if (balling) {
          fill = "purple";
        } else if (lackOfFusion) {
          fill = "blue";
        }

        return(
          <VoronoiPolygon
            key={`polygon-${i}`}
            polygon={polygon}
            fill={fill}
            stroke="white"
            strokeWidth={1}
            strokeOpacity={0.2}
            fillOpacity={tooltipData === polygon.data ? 0.5 : 0.25}
          />
      )});

    return (
      <div>
        <svg width={width} height={height} ref={svgRef}>
          <GradientSteelPurple id="gradient" />
          {/** capture all mouse events with a rect */}
          <rect
            width={width}
            height={height}
            rx={14}
            fill="url(#gradient)"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseLeave}
          />
          <Group pointerEvents="none">
            {pointsJSX}
            {showVoronoi && voronoiLayoutJSX}
          </Group>
        </svg>
        {tooltipOpen && tooltipData && tooltipLeft != null && tooltipTop != null && (
          <Tooltip left={tooltipLeft + 10} top={tooltipTop + 10}>
            <div>
              <strong>Velocity:</strong> {tooltipData[0]} m/s
            </div>
            <div>
              <strong>Power:</strong> {tooltipData[1]} W
            </div>
          </Tooltip>
        )}
        {showControls && (
          <div>
            <label style={{ fontSize: 12 }}>
              <input
                type="checkbox"
                checked={showVoronoi}
                onChange={() => setShowVoronoi(!showVoronoi)}
              />
              &nbsp;Show voronoi point map
            </label>
          </div>
        )}
      </div>
    );
  }

export default withTooltip<Props, PointsRange>(ProcessMapChart);