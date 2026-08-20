import { cn } from '../utils/cn';
import { priorityMeta } from '../utils/priority';

/** Urgent / Important / Later chip driven by the shared priority vocabulary. */
const PriorityTag = ({ priority, className }) => {
  const meta = priorityMeta(priority);
  return <span className={cn('tag', meta.tag, className)}>{meta.label}</span>;
};

export default PriorityTag;
