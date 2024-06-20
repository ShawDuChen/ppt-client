'use client';
import {
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
      type: 'Table',
      data: {
        rows: [
          ['Cell0', 'Cell1', 'Cell2', 'Cell3', 'Cell4'],
          ['Data-0-0', 'Data-0-1', 'Data-0-2', 'Data-0-3', 'Data-0-4'],
          ['Data-1-0', 'Data-1-1', 'Data-1-2', 'Data-1-3', 'Data-1-4'],
          ['Data-2-0', 'Data-2-1', 'Data-2-2', 'Data-2-3', 'Data-2-4'],
          ['Data-3-0', 'Data-3-1', 'Data-3-2', 'Data-3-3', 'Data-3-4'],
          ['Data-4-0', 'Data-4-1', 'Data-4-2', 'Data-4-3', 'Data-4-4'],
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
