import EditorOperate from './components/editor-operate';
import Slide, { SlideItem } from './slide/slide';

export default function PowerpointPage() {
  const slides: SlideItem[] = [
    {
      id: 1,
      type: 'Text',
      data: {},
    },
  ];
  return (
    <div className="container space-y-12 py-12">
      <EditorOperate />
      {slides.map((item) => (
        <div key={item.id} className="rounded-md border p-4">
          <Slide type={item.type} data={item.data} />
        </div>
      ))}
    </div>
  );
}
