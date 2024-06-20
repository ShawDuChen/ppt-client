import { cn } from '@/lib/utils';
import { FilmIcon } from 'lucide-react';
import { SlideMediaData } from 'pptx';

export default function SlideMedia({ data }: { data?: SlideMediaData }) {
  return (
    <div className={cn('relative')}>
      {data?.type === 'audio' ? (
        <audio src={data.path} className="h-12" controls />
      ) : data?.type === 'video' ? (
        <video
          src={data.path}
          className="h-72 w-full"
          controls
          autoPlay={false}
          loop={false}
          muted={false}
          poster={data.cover} // 要求使用base64字符串，否则pptx无法导出成功
        />
      ) : (
        <div className="p-4">
          <FilmIcon className="mx-auto" />
        </div>
      )}
    </div>
  );
}
