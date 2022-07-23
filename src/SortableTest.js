import React, {useState} from 'react';
import {DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,} from '@dnd-kit/core';
import {arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy,} from '@dnd-kit/sortable';

import SortableItem from './SortableItem.jsx';
import Container from './Container.js';

function SortableTest() {
  const [items, setItems] = useState({
    "P1": ['MC1', 'MC2'],
    "MC1": ['A1', 'A2', 'A3'],
    "MC2": ['B1', 'B2', 'B3']});

  const [itemInfo, setItemInfo] = useState({
    "MC1": {"Name":"Vehicle"},
    "MC2": {"Name":"House"},
    "A1": {"Name":"Gas"},
    "A2": {"Name":"Maintenance"},
    "A3": {"Name":"Licensing"},
    "B1": {"Name":"Utilities"},
    "B2": {"Name":"Property Taxes"},
    "B3": {"Name":"Repairs"}
  })

  const [idTypes] = useState( {
    "P1": {"type":"page", "container":""},
    "MC1": {"type":"masterCategory", "container":"page"},
    "MC2": {"type":"masterCategory", "container":"page"},
    "A1": {"type":"category", "container":"masterCategory"},
    "A2": {"type":"category", "container":"masterCategory"},
    "A3": {"type":"category", "container":"masterCategory"},
    "B1": {"type":"category", "container":"masterCategory"},
    "B2": {"type":"category", "container":"masterCategory"},
    "B3": {"type":"category", "container":"masterCategory"},
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const myStyle = {
    minHeight: "150px"
  };

  return (
    <DndContext sensors={sensors} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
    <Container id={'master'} items={items['P1']} key={'P1'}>
      {items['P1'].map((mc) => {
        return(
          <SortableItem key={mc} id={mc}>
            <Container id={mc} items={items[mc]} key={mc}>
              <div>
                This is a category id {mc} with name of {itemInfo[mc].Name}
                {items[mc].map((category) => {
                    return (
                      <SortableItem key={category} id={category}>
                        My id is {category} and my name is {itemInfo[category].Name}
                      </SortableItem>
                    );
                  })}
              </div>
            </Container>
          </SortableItem>
        );
      })}
    </Container>
    </DndContext>
  );

  function findContainer(id, items) {
    return Object.keys(items).find((key) => items[key].includes(id));
  }

  function handleDragOver({ active, over }) {
    if( over == null ) { return }
    const id = active.id;
    const overId = over.id;
    // Find the containers
    const activeContainer = findContainer(id, items);
    const overContainer = findContainer(overId, items);

    //Do nothing if haven't moved out of current container
    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    //If we're dragging to a new container and it matches the old container's
    //type, then move the item to a new container.

    if (
      idTypes[id]
      && idTypes[overContainer]
      && idTypes[id].container === idTypes[overContainer].type
    ) {
      setItems((prev) => {
        const activeItems = prev[activeContainer];
        const overItems = prev[overContainer];

        // Find the indexes for the items
        const activeIndex = activeItems.indexOf(id);
        const overIndex = overItems.indexOf(overId);

        let newIndex;

        const isBelowLastItem = over && overIndex === overItems.length - 1;

        const modifier = isBelowLastItem ? 1 : 0;

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;

        return {
          ...prev,
          [activeContainer]: [
            ...prev[activeContainer].filter((item) => item !== active.id)
          ],
          [overContainer]: [
            ...prev[overContainer].slice(0, newIndex),
            items[activeContainer][activeIndex],
            ...prev[overContainer].slice(newIndex, prev[overContainer].length)
          ]
        };
      });

      return;
    }

    //If you are moving to a new container and it's empty,
    //then move the item into the new empty array.
    if (
      idTypes[id]
      && idTypes[overId]
      && idTypes[id].container === idTypes[overId].type
      && !items[overId].length
    ) {
      setItems((prev) => {
        return {
          ...prev,
          [activeContainer]: [
            ...prev[activeContainer].filter((item) => item !== active.id)
          ],
          [overId]: [active.id]
        };
      });

      return;
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if( over == null ) { return }
    const { id } = active;
    const { id: overId } = over;

    const activeContainer = findContainer(id, items);
    const overContainer = findContainer(overId, items);

    //Only move if it's within the same container, HandleDragOver should have handled the moves between containers
    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }

    const activeIndex = items[activeContainer].indexOf(active.id);
    const overIndex = items[overContainer].indexOf(overId);

    if (activeIndex !== overIndex) {
      setItems((items) => ({
        ...items,
        [overContainer]: arrayMove(items[overContainer], activeIndex, overIndex)
      }));
    }
  }
}

export default SortableTest;
