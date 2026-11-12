import type { ChartColors } from "@sincpro/mobile-ui/Charts/chart-colors";
import type { CartesianFrame } from "@sincpro/mobile-ui/Charts/chart-geometry";
import type {
  BarRendererProps,
  ChartFont,
  DonutRendererProps,
  LineRendererProps,
} from "@sincpro/mobile-ui/Charts/chart-renderer";
import Svg, { Circle, G, Line, Path, Text as SvgText } from "react-native-svg";

/** Hairline gridlines and their tick labels; the zero line is drawn by `Baseline`. */
function Grid({
  frame,
  colors,
  font,
}: {
  frame: CartesianFrame;
  colors: ChartColors;
  font: ChartFont;
}) {
  const { plot } = frame;
  return (
    <G>
      {frame.ticks.map((tick) => (
        <G key={tick.value}>
          {tick.value === 0 ? null : (
            <Line
              stroke={colors.grid}
              strokeWidth={1}
              x1={plot.x}
              x2={plot.x + plot.width}
              y1={tick.y}
              y2={tick.y}
            />
          )}
          <SvgText
            fill={colors.label}
            fontFamily={font.numeric}
            fontSize={font.size}
            textAnchor="end"
            x={plot.x - 6}
            y={tick.y + font.size / 3}
          >
            {tick.label}
          </SvgText>
        </G>
      ))}
      {frame.labels.map((label) => (
        <SvgText
          fill={colors.label}
          fontFamily={font.family}
          fontSize={font.size}
          key={label.key}
          textAnchor="middle"
          x={label.x}
          y={frame.height - 6}
        >
          {label.text}
        </SvgText>
      ))}
    </G>
  );
}

function Baseline({ frame, colors }: { frame: CartesianFrame; colors: ChartColors }) {
  const y = frame.y(0);
  return (
    <Line
      stroke={colors.baseline}
      strokeWidth={1}
      x1={frame.plot.x}
      x2={frame.plot.x + frame.plot.width}
      y1={y}
      y2={y}
    />
  );
}

function SvgBarRenderer({ frame, bars, selected, colors, font }: BarRendererProps) {
  return (
    <Svg height={frame.height} width={frame.width}>
      <Grid colors={colors} font={font} frame={frame} />
      {bars.map((bar) => (
        <Path
          d={bar.path}
          fill={bar.color}
          key={`${bar.series}-${bar.index}`}
          opacity={selected === null || selected === bar.index ? 1 : colors.dimmed}
        />
      ))}
      <Baseline colors={colors} frame={frame} />
    </Svg>
  );
}

function Dot({
  x,
  y,
  color,
  colors,
}: {
  x: number;
  y: number;
  color: string;
  colors: ChartColors;
}) {
  return <Circle cx={x} cy={y} fill={color} r={4} stroke={colors.surface} strokeWidth={2} />;
}

function SvgLineRenderer({ frame, lines, selected, colors, font }: LineRendererProps) {
  const crosshair = selected === null ? null : frame.centers[selected];
  return (
    <Svg height={frame.height} width={frame.width}>
      <Grid colors={colors} font={font} frame={frame} />
      {lines.map((line) =>
        line.area ? (
          <Path
            d={line.area}
            fill={line.color}
            fillOpacity={0.1}
            key={`area-${line.series}`}
          />
        ) : null,
      )}
      <Baseline colors={colors} frame={frame} />
      {crosshair === null ? null : (
        <Line
          stroke={colors.baseline}
          strokeWidth={1}
          x1={crosshair}
          x2={crosshair}
          y1={frame.plot.y}
          y2={frame.plot.y + frame.plot.height}
        />
      )}
      {lines.map((line) => (
        <Path
          d={line.path}
          fill="none"
          key={`line-${line.series}`}
          stroke={line.color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />
      ))}
      {lines.flatMap((line) => {
        const focus = selected === null ? line.end : line.points[selected];
        const points = focus
          ? [...line.isolated.filter((point) => point !== focus), focus]
          : line.isolated;
        return points.map((point) => (
          <Dot
            color={line.color}
            colors={colors}
            key={`dot-${line.series}-${point.x}`}
            x={point.x}
            y={point.y}
          />
        ));
      })}
    </Svg>
  );
}

function SvgDonutRenderer({ frame, arcs, selected, colors }: DonutRendererProps) {
  return (
    <Svg height={frame.size} width={frame.size}>
      {arcs.map((arc) =>
        arc.path ? (
          <Path
            d={arc.path}
            fill={arc.color}
            fillRule="evenodd"
            key={arc.index}
            opacity={selected === null || selected === arc.index ? 1 : colors.dimmed}
          />
        ) : null,
      )}
    </Svg>
  );
}

export const svgChartRenderers = {
  bar: SvgBarRenderer,
  line: SvgLineRenderer,
  donut: SvgDonutRenderer,
};
