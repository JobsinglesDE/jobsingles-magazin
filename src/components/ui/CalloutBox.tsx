import type { ReactNode } from 'react';
import { AnimatedGradientBorder } from './AnimatedGradientBorder';

interface CalloutBoxProps {
  question: string;
  children: ReactNode;
}

export function CalloutBox({ question, children }: CalloutBoxProps) {
  return (
    <AnimatedGradientBorder borderRadius={16} borderWidth={2} className="my-8">
      <div className="p-6">
        <p className="font-bold text-foreground mb-2">{question}</p>
        <div className="text-foreground/70 text-sm leading-relaxed">{children}</div>
      </div>
    </AnimatedGradientBorder>
  );
}
