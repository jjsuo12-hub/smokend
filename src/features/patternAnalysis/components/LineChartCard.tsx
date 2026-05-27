import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Line, Path, Text as SvgText } from 'react-native-svg';
import { Card } from '@/components/Card';
import { colors, spacing, typography } from '@/shared/styles';

export type LineChartSeries = {
  label: string;
  color: string;
  values: number[];
};

type LineChartCardProps = {
  title: string;
  description: string;
  labels: string[];
  series: LineChartSeries[];
};

const chartWidth = 320;
const chartHeight = 170;
const paddingLeft = 28;
const paddingRight = 14;
const paddingTop = 18;
const paddingBottom = 38;

export function LineChartCard({ title, description, labels, series }: LineChartCardProps) {
  const maxValue = Math.max(1, ...series.flatMap((item) => item.values));
  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;
  const xStep = labels.length > 1 ? plotWidth / (labels.length - 1) : 0;

  return (
    <Card>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.legend}>
        {series.map((item) => (
          <View key={item.label} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.label}</Text>
          </View>
        ))}
      </View>
      <View style={styles.chartFrame}>
        <Svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          {[0, 0.5, 1].map((ratio) => {
            const y = paddingTop + plotHeight * ratio;
            return <Line key={ratio} x1={paddingLeft} x2={chartWidth - paddingRight} y1={y} y2={y} stroke={colors.borderMuted} strokeWidth={1} />;
          })}
          {labels.map((label, index) => {
            const x = paddingLeft + xStep * index;
            return (
              <SvgText key={label} x={x} y={chartHeight - 12} fill={colors.textMuted} fontSize="10" textAnchor="middle">
                {label}
              </SvgText>
            );
          })}
          <SvgText x={paddingLeft - 8} y={paddingTop + 4} fill={colors.textMuted} fontSize="10" textAnchor="end">
            {maxValue}
          </SvgText>
          <SvgText x={paddingLeft - 8} y={paddingTop + plotHeight + 4} fill={colors.textMuted} fontSize="10" textAnchor="end">
            0
          </SvgText>
          {series.map((item) => {
            const points = item.values.map((value, index) => ({
              x: paddingLeft + xStep * index,
              y: paddingTop + plotHeight - (value / maxValue) * plotHeight,
            }));
            const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
            return (
              <G key={item.label}>
                <Path d={path} fill="none" stroke={item.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} />
                {points.map((point, index) => (
                  <Circle key={`${item.label}-${index}`} cx={point.x} cy={point.y} r={4} fill={item.color} />
                ))}
              </G>
            );
          })}
        </Svg>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: '900',
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 23,
    marginTop: spacing.xs,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  legendItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  legendDot: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  legendText: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '800',
  },
  chartFrame: {
    marginTop: spacing.md,
    width: '100%',
  },
});
