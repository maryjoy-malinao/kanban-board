import React, { useState } from 'react'
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const TaskCard = ({task}) => {
    const [mouseIsOver, setMouseIsOver] = useState(false);
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
      } = useSortable({
        id: task.id,
        data: {
          type: "Task",
          task,
        }
      });


      const style = {
        transition,
        transform: CSS.Transform.toString(transform),
      };


      if (isDragging) {
        return (
          <div
            ref={setNodeRef}
            style={style}
            className="box-dragging"
          />
        );
      }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="box-task-item"
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
    >
      <p className="box-task-item-title">
        {task.content}
      </p>

    </div>
  )
}

export default TaskCard
