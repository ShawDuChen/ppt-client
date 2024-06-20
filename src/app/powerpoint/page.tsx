'use client';
import {
  SlideChartsData,
  SlideImageData,
  SlideItem,
  SlideMediaData,
  SlideTableData,
  SlideTextData,
} from 'pptx';
import EditorOperate from './components/editor-operate';
import Slide from './slide/slide';
import PptxGenJS from 'pptxgenjs';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function PowerpointPage() {
  const [slide, setSlide] = useState<SlideItem[]>([
    {
      id: 1,
      type: 'Charts',
      data: {
        type: 'bar',
        data: [
          {
            name: 'Actual Sales',
            labels: [
              'Jan',
              'Feb',
              'Mar',
              'Apr',
              'May',
              'Jun',
              'Jul',
              'Aug',
              'Sep',
              'Oct',
              'Nov',
              'Dec',
            ],
            values: [
              1500, 4600, 5156, 3167, 8510, 8009, 6006, 7855, 12102, 12789,
              10123, 15121,
            ],
          },
          {
            name: 'Projected Sales',
            labels: [
              'Jan',
              'Feb',
              'Mar',
              'Apr',
              'May',
              'Jun',
              'Jul',
              'Aug',
              'Sep',
              'Oct',
              'Nov',
              'Dec',
            ],
            values: [
              1000, 2600, 3456, 4567, 5010, 6009, 7006, 8855, 9102, 10789,
              11123, 12121,
            ],
          },
        ],
      },
    },
  ]);
  const create = () => {
    const pptx = new PptxGenJS();

    const sd = pptx.addSlide();

    slide.forEach((item, index) => {
      if (item.type === 'Text') {
        const data = item.data as SlideTextData;
        sd.addText(data.text || 'Default', {
          x: 0,
          y: index,
          w: '100%',
          h: 1,
          ...data.options,
        });
      }
      if (item.type === 'Image') {
        const data = item.data as SlideImageData;
        sd.addImage({
          path: data.path,
          x: 0,
          y: index,
          w: typeof data.w === 'string' ? data.w : `${data.w || 100}%`,
          h: typeof data.h === 'string' ? data.h : `${data.h || 100}%`,
        });
      }
      if (item.type === 'Media') {
        const data = item.data as SlideMediaData;
        sd.addMedia({
          x: 0,
          y: index,
          w: typeof data.w === 'string' ? data.w : `${data.w || 100}%`,
          h: 1,
          path: data.path,
          type: data.type,
        });
      }
      if (item.type === 'Table') {
        const data = item.data as SlideTableData;
        sd.addTable(data.rows || [], {
          x: 0,
          y: index,
          w:
            typeof data.options?.w === 'string'
              ? data.options.w
              : `${data.options?.w || 100}%`,
          h: (data.rows?.length || 1) / 3 || 1,
          ...data.options,
        });
      }
      if (item.type === 'Charts') {
        const data = item.data as SlideChartsData;
        sd.addChart(data.type, data.data, {
          x: 0,
          y: index,
          w: '100%',
          h: '100%',
          ...data.options,
        });
      }
    });

    pptx.writeFile({ fileName: `demo-${Date.now()}.pptx` });
  };

  return (
    <div className="container space-y-12 py-12">
      <Button onClick={create} disabled={!slide.length}>
        test
      </Button>
      <EditorOperate
        emit={(name) =>
          setSlide((prev) => [
            ...prev,
            {
              id: prev.length + 1,
              type: name,
              data: {
                text: 'Placeholder',
              },
            },
          ])
        }
      />
      <Slide
        slide={slide}
        remove={(id) => setSlide((prev) => prev.filter((f) => f.id !== id))}
      />
    </div>
  );
}
