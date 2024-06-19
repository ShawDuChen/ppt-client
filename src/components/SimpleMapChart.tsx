'use client';

import ReactEChartsCore from 'echarts-for-react/lib/core';
import { MapChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { FC } from 'react';

import mapJson from '@/assets/world.json';
import Empty from './empty';
import { countryNameMap } from '@/types/constants';

// Register the required components
echarts.use([
  TitleComponent,
  TooltipComponent,
  MapChart,
  CanvasRenderer,
  VisualMapComponent,
]);

echarts.registerMap('world', mapJson as any);

interface SimpleMapChartProps {
  data: {
    name: string;
    value: number;
  }[];
  tooltipFormatter?: (params: any) => string;
}

const SimpleMapChart: FC<SimpleMapChartProps> = ({
  data,
  tooltipFormatter,
}) => {
  if (data.length === 0) {
    return <Empty />;
  }

  const [min, max] = data.reduce(
    (acc, cur) => {
      if (cur.value < acc[0]) {
        acc[0] = cur.value;
      }
      if (cur.value > acc[1]) {
        acc[1] = cur.value;
      }
      return acc;
    },
    [Infinity, -Infinity],
  );

  return (
    <ReactEChartsCore
      style={{ height: 500 }}
      echarts={echarts}
      option={{
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: tooltipFormatter,
        },
        visualMap: {
          min: min,
          max: max === min ? max + 1 : max,
          text: [`Max: ${max === min ? max + 1 : max}`, `Min: ${min}`],
          realtime: false,
          calculable: true,
          // inRange: {
          //   color: ['#79B8B8', '#467B7B'],
          // },
        },
        series: [
          {
            name: '国家/地区分布',
            type: 'map',
            map: 'world',
            label: {
              // show: true,
            },
            data: data,
            // 自定义名称映射
            nameMap: countryNameMap,
            itemStyle: {
              ariaColor: '#eee',
              borderColor: '#ccc',
            },
            emphasis: {
              label: null,
              itemStyle: {
                areaColor: '#87BBD9',
              },
            },
          },
        ],
      }}
      notMerge={true}
      lazyUpdate={true}
    />
  );
};

export default SimpleMapChart;
