'use client';
import {
  BarChartIcon,
  BaselineIcon,
  ImageMinusIcon,
  ShapesIcon,
  TableIcon,
  Tally1,
  VideoIcon,
} from 'lucide-react';
import { SlideItemType } from 'pptx';
import { Fragment } from 'react';

export default function EditorOperate(props: {
  emit?: (name: SlideItemType) => void;
}) {
  const types: Array<{ name: SlideItemType; icon: JSX.Element }> = [
    {
      name: 'Text',
      icon: <BaselineIcon />,
    },
    {
      name: 'Image',
      icon: <ImageMinusIcon />,
    },
    {
      name: 'Charts',
      icon: <BarChartIcon />,
    },
    {
      name: 'Media',
      icon: <VideoIcon />,
    },
    {
      name: 'Table',
      icon: <TableIcon />,
    },
    {
      name: 'Shapes',
      icon: <ShapesIcon />,
    },
  ];

  return (
    <div className="flex justify-center gap-x-4 rounded-md border p-4 text-primary">
      {types.map((item, index) => (
        <Fragment key={item.name}>
          <div
            className="flex flex-1 cursor-pointer items-center gap-x-2"
            onClick={() => props.emit?.(item.name)}
          >
            {item.icon}
            <span>{item.name}</span>
          </div>
          {index !== types.length - 1 && <Tally1 className="flex-1" />}
        </Fragment>
      ))}
    </div>
  );
}
