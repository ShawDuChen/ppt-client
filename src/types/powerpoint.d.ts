declare module 'pptx' {
  import PptxGenJS from 'pptxgenjs';

  export interface SlideTextData {
    text?: string;
    options?: PptxGenJS.TextPropsOptions;
  }

  export interface SlideImageData extends PptxGenJS.ImageProps {}

  export interface SlideChartsData {}

  export interface SlideMediaData {}

  export interface SlideShapesData {}

  export interface SlideTableData {}

  export type SlideItemType =
    | 'Text'
    | 'Image'
    | 'Charts'
    | 'Media'
    | 'Table'
    | 'Shapes';

  export type SlideData =
    | SlideTextData
    | SlideImageData
    | SlideChartsData
    | SlideMediaData
    | SlideShapesData
    | SlideTableData;

  export interface SlideItem {
    id: number;
    type: SlideItemType;
    data: SlideData;
  }

  export interface SlideItemProps {
    type: SlideItemType;
    data: SlideData;
    className?: string;
    onChange?: () => void;
    close?: React.ReactNode;
  }

  export interface SlideProps {
    slide?: SlideItem[];
    remove?: (index: number) => void;
  }
}
