import Empty from '@/components/empty';
import { SlideChartsData } from 'pptx';
import SlideLineChart from './slide-charts/slide-line-chart';
import SlideBarChart from './slide-charts/slide-bar-chart';

export default function SlideCharts({ data }: { data?: SlideChartsData }) {
  const { type, data: chartData } = data ?? {};
  return (
    <div>
      {type === 'line' && <SlideLineChart chartData={chartData} />}
      {type === 'bar' && <SlideBarChart chartData={chartData} />}
      {!type && <Empty />}
    </div>
  );
}
