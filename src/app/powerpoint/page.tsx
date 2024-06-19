'use client';
import { SlideItem, SlideTextData } from 'pptx';
import EditorOperate from './components/editor-operate';
import Slide from './slide/slide';
import PptxGenJS from 'pptxgenjs';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function PowerpointPage() {
  const [slide, setSlide] = useState<SlideItem[]>([]);
  const create = () => {
    const pptx = new PptxGenJS();

    const sd = pptx.addSlide();

    slide
      .filter((item) => item.type === 'Text')
      .forEach((item, index) => {
        const data = item.data as SlideTextData;
        sd.addText(data.text || 'Default', {
          x: 0,
          y: index,
          w: '100%',
          h: 1,
          ...data.options,
        });
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
