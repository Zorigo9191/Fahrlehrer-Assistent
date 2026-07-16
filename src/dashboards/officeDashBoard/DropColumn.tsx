import { useDroppable } from "@dnd-kit/core";

type DropColumnProps = {
  id: string;
  children: React.ReactNode;
  className?: string;
};

export default function DropColumn({
  id,
  children,
  className = "",
}: DropColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`${className} ${isOver ? "ring-2 ring-blue-500" : ""}`}
    >
      {children}
    </div>
  );
}
