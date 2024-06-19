import Image from 'next/image';
import { Molecule } from 'openchemlib/minimal.js';

const Placeholder = ({
  size,
  content = 'No data available',
}: {
  size: number;
  content?: string;
}) => (
  <div
    style={{ width: size / 2, height: size / 2 }}
    className="flex h-full w-full items-center justify-center rounded-lg bg-gray-100 text-gray-400"
  >
    {content}
  </div>
);

export const ChemicalImage = async ({
  smiles,
  size = 500,
}: {
  smiles?: string;
  size?: number;
}) => {
  if (!smiles) {
    return <Placeholder size={size} />;
  }
  try {
    const molecule = Molecule.fromSmiles(smiles);
    const svg = molecule.toSVG(1000, 1000, 'chemical-image', {
      autoCrop: true,
      suppressChiralText: true,
      suppressESR: true,
      suppressCIPParity: true,
      noImplicitAtomLabelColors: true,
    });

    const src = `data:image/svg+xml;base64,${btoa(svg)}`;

    return <Image src={src} width={size} height={size} alt="Chemical-Image" />;
  } catch {
    return <Placeholder size={size} content="chemical structure error" />;
  }
};
