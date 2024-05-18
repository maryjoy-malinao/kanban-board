import React, { useState } from 'react'
import {DndContext} from '@dnd-kit/core';
import {useDraggable, DragOverlay} from '@dnd-kit/core';
import {useDroppable} from '@dnd-kit/core';
import ClientPortal from '../ClientPortal';

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
    supports: ["doing"]
},
{
    id: "2",
    columnId: "doing",
    content:
    "Develop user registration functionality with OTP delivered on SMS after email confirmation and phone number confirmation",
    supports: ["done"]
},

{
    id: "5",
    columnId: "done",
    content: "Create UI kit documentation",
    supports: []
},
{
    id: "6",
    columnId: "done",
    content: "Dev meeting",
    supports: []
},
{
    id: "7",
    columnId: "done",
    content: "Deliver dashboard prototype",
    supports: []
},
{
    id: "8",
    columnId: "todo",
    content: "Optimize application performance",
    supports: ["doing"]
},
{
    id: "9",
    columnId: "todo",
    content: "Implement data validation",
    supports: ["doing"]
},

{
    id: "10",
    columnId: "todo",
    content: "Design database schema",
    supports: ["doing"]
},
{
    id: "11",
    columnId: "todo",
    content: "Integrate SSL web certificates into workflow",
    supports: ["doing"]
},

];

function ItemTask({task}) {
    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: task.id,
        data: {
           supports: task.supports
        }
      });


    return (<div ref={setNodeRef}  {...listeners} {...attributes} style={{border: '1px solid blue',marginTop: '50px', height: '50px', cursor: 'grab'}}>
                <div>
                    <span>{task.content}</span>
                </div>
            </div>)
}
//ColumnContainer
function ColumnContainer({column, tasks}){
    const { setNodeRef} = useDroppable({
        id: column.id,
        data: {
            type: column.id
        }
      });

    return (
        <div ref={setNodeRef} style={{width: '200px', height: '1000px', border: '1px solid black'}}>
            <h1>{column.title}</h1>
            
            
        {tasks.map((task) => (
            <ItemTask
                key={task.id}
                task={task}
            />         
         ))}
        </div>
    )
}



const Kanban = () => {
    const [columns, setColumns] = useState(defaultCols);
    const [tasks, setTasks] = useState(defaultTasks);
    const [activeTask, setActiveTask] = useState(null);

  return (
    <div style={{display: 'flex'}}>
        <DndContext id='sds' onDragStart={handleDragStart}  onDragEnd={handleDragEnd}>
            {columns.map((col) => (
                <ColumnContainer 
                    key={col.id}
                    column={col}
                    tasks={tasks.filter((task) =>  task.columnId === col.id)}
                />
            ))}


        <ClientPortal selector="#body">
            <DragOverlay>
                {activeTask && (
                    <ItemTask
                        task={activeTask}
                    />
                )}
            </DragOverlay>
        </ClientPortal>

        </DndContext>
    
    </div>
  )

  function handleDragStart(event) {
    const filter = tasks.filter((task)=> task.id === event.active.id)
    setActiveTask(...filter);
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over) return; // ignore drop if outside of column


    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;


    if (over && active.data.current.supports.includes(over.data.current.type)) {
        setTasks((tasks) => {
            const task =  tasks.filter(task => {
                if(task.id === activeId){
                    task.columnId = over.id
                    
                    switch(over.id){
                        case "todo" :
                            task.supports = ["doing"]
                        break;
                        case "doing" :
                            task.supports = ["done"]
                        break;
                        default:
                            task.supports = []
                        break;
                    }
                    
                }
                return task
            });
            return [...task]
    
          });
      }

    
  }
}

export default Kanban
