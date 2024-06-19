'use client';

import { EChartsOption } from 'echarts';
import EChartsReact from 'echarts-for-react';
import { FC, useEffect, useState } from 'react';

type StackedBarChartProps = {
  data: {
    xAxis: {
      data: number[];
      name: string;
    }[];
    yAxis: (number | string)[];
  };
  title?: string;
  xName?: string;
  yName?: string;
};

const StackedBarChart: FC<StackedBarChartProps> = ({
  data,
  title,
  xName,
  yName,
}) => {
  const [show, setShow] = useState<boolean>(false);

  let option: EChartsOption = {
    color: [
      '#1776EB',
      '#A3E0F3',
      '#37A4D9',
      '#4DB9EE',
      '#07508C',
      '#5D99E2',
      '#EE2760',
      '#08D190',
      '#808694',
      '#D9D9D9',
    ],
    title: {
      text: title,
      left: 'center',
    },
    tooltip: {},
    legend: {
      bottom: 0,
    },
    xAxis: {
      type: 'value',
      name: xName,
      minInterval: 1,
    },
    yAxis: {
      type: 'category',
      name: yName,
      data: data.yAxis,
    },
    series: data.xAxis.map((xAxis) => ({
      name: xAxis.name,
      type: 'bar',
      stack: 'total',
      // label: {
      //   show: true,
      //   position: 'insideRight',
      // },
      emphasis: {
        focus: 'series',
      },
      data: xAxis.data,
    })),
  };

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 100);
  }, []);

  if (!show) {
    return (
      <div
        style={{
          width: '100%',
          height: 400,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        loading...
      </div>
    );
  }

  return (
    <EChartsReact
      style={{
        height: '100%',
        minHeight: 300,
      }}
      option={option}
    />
  );
};

export default StackedBarChart;
