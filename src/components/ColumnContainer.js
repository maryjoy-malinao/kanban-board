import React, { useMemo } from 'react'
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from './TaskCard';

const ColumnContainer = ({column, tasks}) => {
    const tasksIds = useMemo(() => {
        return tasks.map((task) => task.id);
      }, [tasks]);



    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
      } = useSortable({ id: column.id, data: {  type: "Column",  column, }});

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
          ></div>
        );
      }
    

  return (
    <div
        ref={setNodeRef}
        style={style}
        className="box"
    >
        {/* Column title */}
        <div {...attributes} {...listeners} className="box-title">

            <div className="box-title-right">
                <div className="box-title-total"> 0 </div>
                {column.title}
            </div>
            <input type='checkbox' />
        </div>

        {/* Column task container */}
      <div className="box-task-card">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
            />
          ))}
        </SortableContext>
      </div>


    </div>
  )
}

export default ColumnContainer
