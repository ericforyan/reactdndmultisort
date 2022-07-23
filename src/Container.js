import React from "react";
import {useDroppable} from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities";
import {SortableContext, useSortable, verticalListSortingStrategy} from "@dnd-kit/sortable";

const Container = ({ id, items, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isOver
  } = useSortable({ id });

  return (
    <SortableContext id={id} items={items} >
      <div ref={setNodeRef} {...attributes} {...listeners} >
        {children}
      </div>
    </SortableContext>
  );
}

export default Container;
