'use client';
import { EChartsOption } from 'echarts';
import EChartsReact from 'echarts-for-react';

export interface SlideBarChartProps {
  chartData?: {
    name: string;
    labels: string[];
    values: number[];
  }[];
}

const createOption: (_?: SlideBarChartProps['chartData']) => EChartsOption = (
  data,
) => {
  const xAxisData = data?.length ? data[0].labels : [];

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
    },
    yAxis: {
      type: 'value',
    },
    series: data?.map((item) => ({
      name: item.name,
      type: 'bar',
      data: item.values,
      showBackground: true,
    })),
  };
  return option;
};

export default function SlideBarChart(props: SlideBarChartProps) {
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
