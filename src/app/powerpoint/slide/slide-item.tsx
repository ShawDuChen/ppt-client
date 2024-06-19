import { SlideImageData, SlideItemProps, SlideTextData } from 'pptx';
import SlideText from './slide-text';
import SlideImage from './slide-image';
import SlideCharts from './slide-charts';
import SlideMedia from './slide-media';
import SlideTables from './slide-table';
import SlideShapes from './slide-shapes';
import { cn } from '@/lib/utils';

export default function SlideItem({
  type,
  data,
  className,
  onChange,
  close,
}: SlideItemProps) {
  return (
    <div className="relative">
      <div
        className={cn('ppt-slide cursor-pointer border', className)}
        onClick={() => onChange?.()}
      >
        {type === 'Text' && <SlideText data={data as SlideTextData} />}
        {type === 'Image' && <SlideImage data={data as SlideImageData} />}
        {type === 'Charts' && <SlideCharts data={data} />}
        {type === 'Media' && <SlideMedia data={data} />}
        {type === 'Table' && <SlideTables data={data} />}
        {type === 'Shapes' && <SlideShapes data={data} />}
      </div>
      {close}
    </div>
  );
}
