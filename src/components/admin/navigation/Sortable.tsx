import { ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface RenderArgs { handle: ReactNode; isDragging: boolean; }

const Sortable = ({ id, children }: { id: string; children: (a: RenderArgs) => ReactNode }) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1, zIndex: isDragging ? 30 : undefined };
  const handle = (
    <button ref={setActivatorNodeRef} {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing touch-none p-1 text-muted-foreground hover:text-foreground" aria-label="Drag to reorder">
      <GripVertical className="h-4 w-4" />
    </button>
  );
  return <div ref={setNodeRef} style={style}>{children({ handle, isDragging })}</div>;
};

export default Sortable;