'use client';

import { FC } from 'react';
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const colors = [
  '#2F7AD6',
  '#8884d8',
  '#82ca9d',
  '#217074',
  '#37745B',
  '#8B9D77',
  '#EDC5AB',
];

interface StackBarChartProps {
  data: Record<string, any>[];
  xDataKey: string;
  yDataKeys: string[];
}

const StackBarChart: FC<StackBarChartProps> = ({
  data,
  xDataKey,
  yDataKeys,
}) => {
  return (
    <ResponsiveContainer height={data.length * 100}>
      <BarChart data={data} layout="vertical">
        <XAxis type="number" />
        <YAxis type="category" dataKey={xDataKey} />
        <Tooltip />
        <Legend />
        {yDataKeys.map((yDataKey, index) => (
          <Bar
            barSize={30}
            key={index}
            dataKey={yDataKey}
            stackId="a"
            fill={colors[index % colors.length]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StackBarChart;
