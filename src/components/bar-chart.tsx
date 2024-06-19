'use client';

import { EChartsOption } from 'echarts';
import EChartsReact from 'echarts-for-react';
import { FC, useEffect, useState } from 'react';

type SimpleBarChartProps =
  | {
      data: {
        xAxis: (number | string)[];
        yAxis: number[];
      };
      title?: string;
      xName?: string;
      yName?: string;
      layout?: 'vertical';
    }
  | {
      data: {
        xAxis: number[];
        yAxis: (number | string)[];
      };
      title?: string;
      xName?: string;
      yName?: string;
      layout: 'horizontal';
    };

const SimpleBarChart: FC<SimpleBarChartProps> = ({
  data,
  title,
  xName,
  yName,
  layout = 'vertical',
}) => {
  const [show, setShow] = useState<boolean>(false);

  let option: EChartsOption;

  if (layout === 'horizontal') {
    option = {
      title: {
        text: title,
        left: 'center',
      },
      tooltip: {},
      xAxis: {
        type: 'value',
        name: xName,
        minInterval: 1,
      },
      yAxis: {
        type: 'category',
        data: data.yAxis,
        axisTick: {
          alignWithLabel: true,
        },
        name: yName,
      },

      series: [
        {
          name: xName,
          type: 'bar',
          data: data.xAxis,
          color: '#2F7AD6',
        },
      ],
    };
  } else {
    option = {
      title: {
        text: title,
        left: 'center',
      },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: data.xAxis,
        axisTick: {
          alignWithLabel: true,
        },
        name: xName,
      },
      yAxis: {
        type: 'value',
        name: yName,
        minInterval: 1,
      },
      series: [
        {
          name: yName,
          type: 'bar',
          data: data.yAxis,
          color: '#2F7AD6',
          barMaxWidth: 50,
        },
      ],
    };
  }

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

export default SimpleBarChart;
