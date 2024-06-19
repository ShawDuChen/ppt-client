import * as React from 'react';

import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoHeight?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autoHeight, ...props }, ref) => {
    const innerRef = React.useRef<HTMLTextAreaElement>(null);

    React.useEffect(() => {
      const textarea = innerRef.current;
      if (textarea && autoHeight) {
        adjustTextareaHeight(textarea);
        const observer = new MutationObserver(() => {
          adjustTextareaHeight(textarea);
        });
        observer.observe(textarea, {
          attributes: true,
          childList: true,
        });
        return () => {
          observer.disconnect();
        };
      }
    }, [autoHeight]);

    React.useImperativeHandle(ref, () => innerRef.current!, []);

    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={innerRef}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };

function adjustTextareaHeight(textarea: HTMLTextAreaElement) {
  let hiddenTextArea = document.getElementById('textarea-height-calc');
  if (!hiddenTextArea) {
    hiddenTextArea = document.createElement('textarea');
    document.body.appendChild(hiddenTextArea);
    hiddenTextArea.id = 'textarea-height-calc';
  }
  const style = window.getComputedStyle(textarea);
  hiddenTextArea.setAttribute('rows', '1');
  hiddenTextArea.style.position = 'absolute';
  hiddenTextArea.style.top = '-9999px';
  hiddenTextArea.style.left = '-9999px';
  hiddenTextArea.style.width = style.width;
  hiddenTextArea.style.padding = style.padding;
  hiddenTextArea.style.fontSize = style.fontSize;
  hiddenTextArea.style.lineHeight = style.lineHeight;
  hiddenTextArea.style.fontFamily = style.fontFamily;
  hiddenTextArea.style.border = 'none';
  hiddenTextArea.style.whiteSpace = 'pre-wrap';
  hiddenTextArea.textContent = textarea.value;
  // Note: border width is not included in scrollHeight
  // This only works if the box-sizing is set to border-box
  // TODO: handle other box-sizing cases
  const borderWidth =
    parseInt(style.borderTopWidth) + parseInt(style.borderBottomWidth);
  textarea.style.height = hiddenTextArea.scrollHeight + borderWidth + 'px';
}
