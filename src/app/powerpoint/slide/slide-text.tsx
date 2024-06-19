import { cn } from '@/lib/utils';
import { SlideTextData } from 'pptx';

/**
 * 文本类型暂时只支持以下设置
    align: 'left',
    bold: true,
    wrap: true,
    charSpacing: 1,
    color: 'ff0000',
    fill: {
      color: '0000ff'
    },
    fontFace: 'Arial',
    fontSize: 32,
    hyperlink: {
      url: 'https://www.baidu.com/',
      tooltip: 'this is a tooltip'
    },
    italic: true,
    underline: {
      color: '00ff00'
    },
    line: {
      width: 2,
      color: 'A9A9A9',
    }
 */

export default function SlideText({ data }: { data: SlideTextData }) {
  const { text, options } = data;
  return (
    <div
      className={cn('relative')}
      style={{
        textAlign: options?.align || 'left',
        fontWeight: options?.bold ? 'bold' : 'normal',
        whiteSpace: options?.wrap ? 'wrap' : 'normal',
        letterSpacing: options?.charSpacing || 'normal',
        color: options?.color ? `#${options.color}` : 'black',
        backgroundColor: options?.fill
          ? `#${options.fill.color}`
          : 'transparent',
        fontFamily: options?.fontFace || 'sans-serif',
        fontSize: options?.fontSize || 16,
        fontStyle: options?.italic ? 'italic' : 'normal',
        textDecoration: options?.underline ? 'underline' : 'none',
        textDecorationStyle: 'solid',
        textDecorationColor: options?.underline?.color
          ? `#${options.underline.color}`
          : 'transparent',
        border: options?.line
          ? `solid #${options.line.color || '000'} ${options.line.width || 1}px`
          : 'none',
      }}
    >
      {options?.hyperlink ? (
        <a
          href={options.hyperlink.url}
          title={options.hyperlink.tooltip}
          target="_blank"
        >
          {text}
        </a>
      ) : (
        text
      )}
    </div>
  );
}
