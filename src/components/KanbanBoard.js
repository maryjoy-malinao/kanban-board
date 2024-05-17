import React, { useMemo, useState } from 'react'
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import ColumnContainer from './ColumnContainer';
import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
  } from "@dnd-kit/core";
import ClientPortal from './ClientPortal';
import TaskCard from './TaskCard';


const defaultCols = [
    {
      id: "todo",
      title: "Todo",
    },
    {
      id: "doing",
      title: "Work in progress",
    },
    {
      id: "done",
      title: "Done",
    },
  ];


const defaultTasks= [
{
    id: "1",
    columnId: "todo",
    content: "List admin APIs for dashboard",
},
{
    id: "2",
    columnId: "todo",
    content:
    "Develop user registration functionality with OTP delivered on SMS after email confirmation and phone number confirmation",
},
{
    id: "3",
    columnId: "doing",
    content: "Conduct security testing",
},
{
    id: "4",
    columnId: "doing",
    content: "Analyze competitors",
},
{
    id: "5",
    columnId: "done",
    content: "Create UI kit documentation",
},
{
    id: "6",
    columnId: "done",
    content: "Dev meeting",
},
{
    id: "7",
    columnId: "done",
    content: "Deliver dashboard prototype",
},
{
    id: "8",
    columnId: "todo",
    content: "Optimize application performance",
},
{
    id: "9",
    columnId: "todo",
    content: "Implement data validation",
},
{
    id: "10",
    columnId: "todo",
    content: "Design database schema",
},
{
    id: "11",
    columnId: "todo",
    content: "Integrate SSL web certificates into workflow",
},
{
    id: "12",
    columnId: "doing",
    content: "Implement error logging and monitoring",
},
{
    id: "13",
    columnId: "doing",
    content: "Design and implement responsive UI",
},
];


const KanbanBoard = () => {
    const [columns, setColumns] = useState(defaultCols);
    const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

    const [tasks, setTasks] = useState(defaultTasks);

    const [activeColumn, setActiveColumn] = useState(null);

    const [activeTask, setActiveTask] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
          activationConstraint: {
            distance: 10,
          },
        })
      );
    

  return (
    
            
    <div className='container'>
        <DndContext
                sensors={sensors}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDragOver={onDragOver}
                id='dropContxt'
            >
       <div className='container-flex'>
            <div className='div-flex'>
                <SortableContext items={columnsId}>
                {columns.map((col) => (
                    <ColumnContainer 
                    key={col.id}
                    column={col}
                    tasks={tasks.filter((task) =>  task.columnId === col.id)}
                />
                ))}
                </SortableContext>
            </div>
       </div>
        <ClientPortal selector="#body">
            <DragOverlay>
                {activeColumn && (
                <ColumnContainer
                    column={activeColumn}
                    tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
                />
                )}
                {activeTask && (
                <TaskCard
                    task={activeTask}
                />
                )}
            </DragOverlay>
        </ClientPortal>
       </DndContext>
    </div>
    

  )

  function onDragStart(event) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }


  function onDragEnd(event) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

  

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event) {

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        console.log(tasks[activeIndex].columnId, '1');
        console.log(tasks[overIndex].columnId, '2');

        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          // Fix introduced after video recording
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });


    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;
        console.log("DROPPING TASK OVER COLUMN", { activeIndex });
        return arrayMove(tasks, activeIndex, activeIndex);
      });

 
    }
  }

}




export default KanbanBoard
