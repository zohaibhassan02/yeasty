import React, { ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";

interface DroppableContainerProps {
  id: string;
  children: ReactNode;
}

const DroppableContainer: React.FC<DroppableContainerProps> = ({ id, children }) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div ref={setNodeRef} style={{ padding: "16px", border: "1px solid #ccc", margin: "16px" }}>
      {children}
    </div>
  );
};

export default DroppableContainer;
