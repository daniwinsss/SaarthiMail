import { Sparkles } from 'lucide-react';
import { cn } from '../utils/cn';

/** The "✨ AI …" pill used across the wireframes (4a header, 5a, 7a). */
const AIBadge = ({ children = 'AI', className }) => (
  <span className={cn('ai-badge shadow-sm shadow-primary/20', className)}>
    <Sparkles size={11} fill="currentColor" />
    <span>{children}</span>
  </span>
);

export default AIBadge;
