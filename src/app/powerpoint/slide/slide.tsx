import SlideText from './slide-text';

export interface SlideItemData {}
export type SlideItemType =
  | 'Text'
  | 'Image'
  | 'Charts'
  | 'Media'
  | 'Table'
  | 'Shapes';

export interface SlideItem {
  id: number;
  type: SlideItemType;
  data: SlideItemData;
}

export interface SlideProps {
  type: SlideItemType;
  data?: SlideItemData;
}

export default function Slide({ type, data }: SlideProps) {
  return (
    <div className="ppt-slide">{type === 'Text' ? <SlideText /> : null}</div>
  );
}
