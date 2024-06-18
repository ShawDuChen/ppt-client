import pptxgen from 'pptxgenjs';

export default function App() {
  const create = () => {
    // 1. Create a new Presentation
    const pres = new pptxgen();

    // 2. Add a Slide
    const slide = pres.addSlide();

    // 3. Add one or more objects (Tables, Shapes, Images, Text and Media) to the Slide
    const textboxText = 'Hello World from PptxGenJS!';
    const textboxOpts = { x: 1, y: 1, color: '363636' };
    slide.addText(textboxText, textboxOpts);

    const slide2 = pres.addSlide();
    slide2.addText('Hello World from PptxGenJS!', {
      x: 1,
      y: 1,
      color: 'ff0000',
      underline: {
        color: 'f00f01',
      },
      fontSize: 24,
      bold: true,
    });
    slide2.addText('This is next paragraph1', { x: 1, y: 2, color: 'ff0000' });
    slide2.addText('This is next paragraph1', { x: 1, y: 3, color: 'ffff00' });
    slide2.addText('This is next paragraph1', { x: 1, y: 4, color: 'ff00ff' });
    slide2.addText('This is next paragraph1', { x: 1, y: 5, color: 'ff0f0f' });
    // 4. Save the Presentation
    pres.writeFile();
  };

  return (
    <section>
      <button onClick={create}>create</button>
    </section>
  );
}
