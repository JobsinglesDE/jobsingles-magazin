import type { ReactNode } from 'react';

interface PolaroidCardProps {
  rotation?: 'left' | 'right' | 'slight';
  tape?: 'center' | 'left' | 'right';
  children: ReactNode;
  className?: string;
}

const rotations = {
  left: 'polaroid-1',
  right: 'polaroid-2',
  slight: 'polaroid-3',
};

export function PolaroidCard({
  rotation = 'slight',
  tape = 'center',
  children,
  className = '',
}: PolaroidCardProps) {
  return (
    <div
      className={`relative bg-white rounded-sm p-3 pb-12 ambient-shadow transition-transform hover:scale-105 ${rotations[rotation]} ${className}`}
    >
      <div className={`tape tape-${tape}`} />
      <div className="rounded-sm overflow-hidden">{children}</div>
    </div>
  );
}
