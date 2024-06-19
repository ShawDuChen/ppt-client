/* eslint-disable @next/next/no-img-element */
import { cn } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';
import { SlideImageData } from 'pptx';

export default function SlideImage({ data }: { data?: SlideImageData }) {
  return (
    <div className={cn('relative')}>
      {data?.path ? (
        <img
          src={data.path}
          alt="slide image"
          style={{
            width: `${data.w || 100}%`,
            height: `${data.h || 100}%`,
          }}
        />
      ) : (
        <div className="py-4">
          <ImageIcon size={20} className="mx-auto" />
        </div>
      )}
    </div>
  );
}
