import React, { useState } from 'react'
import {arrayMove } from "@dnd-kit/sortable";
import ColumnContainer from './ColumnContainer';
import {
    DndContext,
    DragOverlay,
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

];


const KanbanBoard = () => {
    const [columns, setColumns] = useState(defaultCols);
    const [tasks, setTasks] = useState(defaultTasks);

    const [activeTask, setActiveTask] = useState(null);
    const [errorColor, setErrorColor] = useState('');

    const [grabColumnName, setGrabColumnName] =useState('');
    const [dropColumnName, setDropColumnName] = useState('');

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
                {columns.map((col) => (
                    <ColumnContainer 
                        key={col.id}
                        column={col}
                        tasks={tasks.filter((task) =>  task.columnId === col.id)}
                        className={errorColor}
                    />
                ))}
            </div>
       </div>
        <ClientPortal selector="#body">
            <DragOverlay>
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

  function handleProceedDrop(grabName, targetName,func){
    if(grabName === 'todo' && targetName === 'todo'){
        func()
    }else if(grabName === 'todo' && targetName === 'doing'){
        func()
    }else{
        console.log('cancelled');
    }

  }


  function handleSetTaskColumn( activeId, overId){
    setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;
        return arrayMove(tasks, activeIndex, activeIndex);
      });

  }

  
  function handleSetTask( activeId, overId){
    setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        

        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
  } 

  function onDragStart(event) {
    const { active } = event;

    const activeColumnId = active.data.current.task.columnId;

    setGrabColumnName(activeColumnId);
    console.log(event.active.data.current.task);
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }


  function onDragEnd(event) {

    setActiveTask(null);
  
    const { active, over } = event;
    if (!over) return;


    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

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
        const overColumnId = over.data.current.task.columnId;
        const func = () => handleSetTask(activeId, overId)


        handleProceedDrop(grabColumnName, overColumnId, func)
    }

    const isOverAColumn = over.data.current?.type === "Column";

    //this will only work if the column is empty and you drop some task

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {

        const overColumnId = over.id;

        const func = () => handleSetTaskColumn(activeId, overId)
        handleProceedDrop(grabColumnName, overColumnId, func)

    //   setTasks((tasks) => {
    //     const activeIndex = tasks.findIndex((t) => t.id === activeId);

    //     tasks[activeIndex].columnId = overId;
    //     return arrayMove(tasks, activeIndex, activeIndex);
    //   });

 
    }
  }

}




export default KanbanBoard
