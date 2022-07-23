import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

const SortableItem = (props, children) => {
  const { attributes, listeners, setNodeRef, transform, transition, } = useSortable({id: props.id});
  const style = { transform: CSS.Transform.toString(transform), transition, };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      Hi I am a sortable item with id of {props.id}
    </div>
  );
}

export default SortableItem;
