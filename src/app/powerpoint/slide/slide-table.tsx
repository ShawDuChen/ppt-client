import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SlideTableData } from 'pptx';

export default function SlideTables({ data }: { data?: SlideTableData }) {
  const columns = data?.rows?.length ? data?.rows?.[0] : [];
  const rows = data?.rows?.length ? data?.rows?.slice(1) : [];

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            {columns?.map((col, index) => (
              <TableHead key={index}>{col as string}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows?.map((row, index) => (
            <TableRow key={index}>
              {row?.map((cell, cindex) => (
                <TableCell key={cindex}>{cell as string}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
