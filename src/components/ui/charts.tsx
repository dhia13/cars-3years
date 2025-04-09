
import * as React from "react";
import * as RechartsPrimitive from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  type ChartConfig
} from "@/components/ui/chart";

interface BaseChartProps {
  data: any[];
  index: string;
  categories: string[];
  valueFormatter?: (value: number) => string;
  colors?: string[];
  className?: string;
  showXAxis?: boolean;
  showYAxis?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  showGrid?: boolean;
  startEndOnly?: boolean;
}

const defaultValueFormatter = (value: number) => `${value}`;

export function BarChart({
  data,
  index,
  categories,
  valueFormatter = defaultValueFormatter,
  colors = ["#0ea5e9", "#f59e0b", "#10b981", "#8b5cf6"],
  className,
  showXAxis = true,
  showYAxis = true,
  showLegend = true,
  showTooltip = true,
  showGrid = true,
  startEndOnly = false,
}: BaseChartProps) {
  const config = React.useMemo<ChartConfig>(() => {
    return categories.reduce((acc, category, i) => {
      return {
        ...acc,
        [category]: {
          label: category,
          color: colors[i % colors.length],
        },
      };
    }, {});
  }, [categories, colors]);

  return (
    <ChartContainer className={className} config={config}>
      <RechartsPrimitive.BarChart data={data} barGap={4}>
        {showGrid && (
          <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" vertical={false} />
        )}
        {showXAxis && (
          <RechartsPrimitive.XAxis
            dataKey={index}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={startEndOnly ? (value, i) => (i === 0 || i === data.length - 1 ? value : "") : undefined}
            minTickGap={0}
          />
        )}
        {showYAxis && (
          <RechartsPrimitive.YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `${value}`}
          />
        )}
        {showTooltip && (
          <ChartTooltip content={<ChartTooltipContent formatter={valueFormatter} />} />
        )}
        {showLegend && (
          <ChartLegend
            content={<ChartLegendContent />}
            verticalAlign="top"
            height={60}
          />
        )}
        {categories.map((category, i) => (
          <RechartsPrimitive.Bar
            key={category}
            name={category}
            dataKey={category}
            fill={colors[i % colors.length]}
            radius={[4, 4, 0, 0]}
            fillOpacity={0.9}
          />
        ))}
      </RechartsPrimitive.BarChart>
    </ChartContainer>
  );
}

export function LineChart({
  data,
  index,
  categories,
  valueFormatter = defaultValueFormatter,
  colors = ["#0ea5e9", "#f59e0b", "#10b981", "#8b5cf6"],
  className,
  showXAxis = true,
  showYAxis = true,
  showLegend = true,
  showTooltip = true,
  showGrid = true,
  startEndOnly = false,
}: BaseChartProps) {
  const config = React.useMemo<ChartConfig>(() => {
    return categories.reduce((acc, category, i) => {
      return {
        ...acc,
        [category]: {
          label: category,
          color: colors[i % colors.length],
        },
      };
    }, {});
  }, [categories, colors]);

  return (
    <ChartContainer className={className} config={config}>
      <RechartsPrimitive.LineChart data={data}>
        {showGrid && (
          <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" vertical={false} />
        )}
        {showXAxis && (
          <RechartsPrimitive.XAxis
            dataKey={index}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={startEndOnly ? (value, i) => (i === 0 || i === data.length - 1 ? value : "") : undefined}
            minTickGap={0}
          />
        )}
        {showYAxis && (
          <RechartsPrimitive.YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `${value}`}
          />
        )}
        {showTooltip && (
          <ChartTooltip content={<ChartTooltipContent formatter={valueFormatter} />} />
        )}
        {showLegend && (
          <ChartLegend
            content={<ChartLegendContent />}
            verticalAlign="top"
            height={60}
          />
        )}
        {categories.map((category, i) => (
          <RechartsPrimitive.Line
            key={category}
            name={category}
            dataKey={category}
            stroke={colors[i % colors.length]}
            strokeWidth={2}
            dot={{
              r: 4,
              fill: "white",
              stroke: colors[i % colors.length],
              strokeWidth: 2,
            }}
            activeDot={{
              r: 6,
              fill: "white",
              stroke: colors[i % colors.length],
              strokeWidth: 2,
            }}
          />
        ))}
      </RechartsPrimitive.LineChart>
    </ChartContainer>
  );
}

export function PieChart({
  data,
  index,
  categories,
  valueFormatter = defaultValueFormatter,
  colors = ["#0ea5e9", "#f59e0b", "#10b981", "#8b5cf6"],
  className,
  showLegend = true,
  showTooltip = true,
}: Omit<BaseChartProps, "showXAxis" | "showYAxis" | "showGrid" | "startEndOnly"> & {
  useLabelAsDomain?: boolean;
}) {
  const config = React.useMemo<ChartConfig>(() => {
    return data.reduce((acc, dataItem, i) => {
      const name = dataItem[index];
      return {
        ...acc,
        [name]: {
          label: name,
          color: colors[i % colors.length],
        },
      };
    }, {});
  }, [data, index, colors]);

  return (
    <ChartContainer className={className} config={config}>
      <RechartsPrimitive.PieChart>
        {showTooltip && (
          <ChartTooltip content={<ChartTooltipContent formatter={valueFormatter} nameKey={index} />} />
        )}
        {showLegend && (
          <ChartLegend
            content={<ChartLegendContent nameKey={index} />}
            verticalAlign="middle"
            align="right"
            layout="vertical"
            iconType="circle"
          />
        )}
        <RechartsPrimitive.Pie
          data={data}
          nameKey={index}
          dataKey={categories[0]}
          cx="50%"
          cy="50%"
          outerRadius={80}
          innerRadius={40}
          paddingAngle={2}
          strokeWidth={2}
          stroke="white"
        >
          {data.map((_, i) => (
            <RechartsPrimitive.Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
          ))}
        </RechartsPrimitive.Pie>
      </RechartsPrimitive.PieChart>
    </ChartContainer>
  );
}
