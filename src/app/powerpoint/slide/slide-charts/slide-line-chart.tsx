'use client';
import { EChartsOption } from 'echarts';
import EChartsReact from 'echarts-for-react';

export interface SlideLineChartProps {
  chartData?: {
    name: string;
    labels: string[];
    values: number[];
  }[];
}

const createOption: (_?: SlideLineChartProps['chartData']) => EChartsOption = (
  data,
) => {
  const xAxisData = data?.length ? data[0].labels : [];

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisData,
    },
    yAxis: {
      type: 'value',
    },
    series: data?.map((item) => ({
      name: item.name,
      type: 'line',
      data: item.values,
    })),
  };
  return option;
};

export default function SlideLineChart(props: SlideLineChartProps) {
  const option = createOption(props.chartData);
  return !props.chartData ? null : (
    <EChartsReact
      style={{
        height: '100%',
        minHeight: 300,
      }}
      option={option}
    />
  );
}
