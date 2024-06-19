'use client';
import { SlideProps } from 'pptx';
import SlideItem from './slide-item';
import { useState } from 'react';
import { XCircleIcon } from 'lucide-react';

export default function Slide({ slide, remove }: SlideProps) {
  const [activeItemIndex, updateActiveItemIndex] = useState(-1);

  return (
    <div className="ppt-slide space-y-4">
      {slide?.map((slideItem, index) => (
        <SlideItem
          key={slideItem.id}
          type={slideItem.type}
          data={slideItem.data}
          className={
            activeItemIndex === index ? 'border-[4px] border-dashed' : ''
          }
          onChange={() =>
            updateActiveItemIndex((prev) => (prev === index ? -1 : index))
          }
          close={
            <XCircleIcon
              className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 cursor-pointer text-destructive"
              size={14}
              onClick={() => {
                activeItemIndex === index && updateActiveItemIndex(-1);
                remove?.(slideItem.id);
              }}
            />
          }
        />
      ))}
    </div>
  );
}
