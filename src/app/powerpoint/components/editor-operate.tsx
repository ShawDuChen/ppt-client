import {
  BarChartIcon,
  BaselineIcon,
  ImageMinusIcon,
  ShapesIcon,
  TableIcon,
  Tally1,
  VideoIcon,
} from 'lucide-react';

export default function EditorOperate() {
  return (
    <div className="flex justify-center gap-x-4 rounded-md border p-4 text-primary">
      <div className="flex flex-1 cursor-pointer items-center gap-x-2">
        <BaselineIcon />
        <span>Text</span>
      </div>
      <Tally1 className="flex-1" />
      <div className="flex flex-1 cursor-pointer items-center gap-x-2">
        <ImageMinusIcon />
        <span>Image</span>
      </div>
      <Tally1 className="flex-1" />
      <div className="flex flex-1 cursor-pointer items-center gap-x-2">
        <BarChartIcon />
        <span>Charts</span>
      </div>
      <Tally1 className="flex-1" />
      <div className="flex flex-1 cursor-pointer items-center gap-x-2">
        <VideoIcon />
        <span>Media</span>
      </div>
      <Tally1 className="flex-1" />
      <div className="flex flex-1 cursor-pointer items-center gap-x-2">
        <TableIcon />
        <span>Table</span>
      </div>
      <Tally1 className="flex-1" />
      <div className="flex flex-1 cursor-pointer items-center gap-x-2">
        <ShapesIcon />
        <span>Shapes</span>
      </div>
    </div>
  );
}
