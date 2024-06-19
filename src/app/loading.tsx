import Spinner from '@/components/spinner';

export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-64px)] items-center justify-center">
      <Spinner />
    </div>
  );
}
