'use client';
import { SlideImageData, SlideItem, SlideTextData } from 'pptx';
import EditorOperate from './components/editor-operate';
import Slide from './slide/slide';
import PptxGenJS from 'pptxgenjs';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function PowerpointPage() {
  const [slide, setSlide] = useState<SlideItem[]>([
    {
      id: 1,
      type: 'Media',
      data: {
        type: 'audio',
        path: 'http://localhost:3001/medias/song.mp3',
      },
    },
  ]);
  const create = () => {
    const pptx = new PptxGenJS();

    const sd = pptx.addSlide();

    // slide.forEach((item, index) => {
    //   if (item.type === 'Text') {
    //     const data = item.data as SlideTextData;
    //     sd.addText(data.text || 'Default', {
    //       x: 0,
    //       y: index,
    //       w: '100%',
    //       h: 1,
    //       ...data.options,
    //     });
    //   }
    //   if (item.type === 'Image') {
    //     const data = item.data as SlideImageData;
    //     sd.addImage({
    //       path: data.path,
    //       x: 0,
    //       y: index,
    //       w: typeof data.w === 'string' ? data.w : `${data.w || 100}%`,
    //       h: typeof data.h === 'string' ? data.h : `${data.h || 100}%`,
    //     });
    //   }
    // });

    sd.addMedia({
      type: 'audio',
      path: 'http://localhost:3001/medias/song.mp3',
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
