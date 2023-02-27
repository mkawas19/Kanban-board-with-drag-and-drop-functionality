import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./KanbanBoard.css";

const initialData = {
  tasks: {
    "task-1": { id: "task-1", content: "Do laundry" },
    "task-2": { id: "task-2", content: "Buy groceries" },
    "task-3": { id: "task-3", content: "Clean bathroom" },
    "task-4": { id: "task-4", content: "Walk the dog" }
  },
  columns: [
    {
      id: "column-1",
      title: "To Do",
      taskIds: ["task-1", "task-2"]
    },
    {
      id: "column-2",
      title: "In Progress",
      taskIds: []
    },
    {
      id: "column-3",
      title: "Done",
      taskIds: ["task-3", "task-4"]
    }
  ],
  columnOrder: ["column-1", "column-2", "column-3"]
};

const KanbanBoard = () => {
  const [data, setData] = useState(initialData);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColumn = data.columns.find(
      (column) => column.id === source.droppableId
    );
    const destinationColumn = data.columns.find(
      (column) => column.id === destination.droppableId
    );

    if (!sourceColumn || !destinationColumn) {
      return;
    }

    const newSourceTaskIds = Array.from(sourceColumn.taskIds);
    newSourceTaskIds.splice(source.index, 1);

    const newDestinationTaskIds = Array.from(destinationColumn.taskIds);
    newDestinationTaskIds.splice(destination.index, 0, draggableId);

    const newSourceColumn = {
      ...sourceColumn,
      taskIds: newSourceTaskIds
    };

    const newDestinationColumn = {
      ...destinationColumn,
      taskIds: newDestinationTaskIds
    };

    const newColumns = Array.from(data.columns);
    const sourceColumnIndex = newColumns.indexOf(sourceColumn);
    const destinationColumnIndex = newColumns.indexOf(destinationColumn);

    newColumns[sourceColumnIndex] = newSourceColumn;
    newColumns[destinationColumnIndex] = newDestinationColumn;

    const newData = {
      ...data,
      columns: newColumns
    };

    setData(newData);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {data.columnOrder.map((columnId) => {
        const column = data.columns.find((col) => col.id === columnId);
        const tasks = column ? column.taskIds.map((taskId) => data.tasks[taskId]) : [];

        return (
          <div className="kanban-column" key={columnId}>
            <h3 className="kanban-column-title">{column.title}</h3>
            <Droppable droppableId={column.id}>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        className="kanban-card"
                      >
                        {task.content}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      );
    })}
  </DragDropContext>
  );
  };
  
  export default KanbanBoard;