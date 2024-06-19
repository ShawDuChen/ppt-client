import { cn } from '@/lib/utils';
import { FileAudioIcon, VideoIcon } from 'lucide-react';
import { SlideMediaData } from 'pptx';

export default function SlideMedia({ data }: { data?: SlideMediaData }) {
  return (
    <div className={cn('relative')}>
      {data?.type === 'audio' ? (
        <audio src={data.path} className="h-12" controls />
      ) : (
        <div className="p-4">
          <FileAudioIcon className="mx-auto" />
        </div>
      )}
      {data?.type === 'video' ? (
        <video
          src={data.path}
          className="h-12"
          controls
          autoPlay={false}
          loop={false}
          muted={false}
        />
      ) : (
        <div className="p-4">
          <VideoIcon className="mx-auto" />
        </div>
      )}
    </div>
  );
}
