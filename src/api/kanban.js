/* eslint-disable no-unsafe-optional-chaining */
import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const URL = endpoints.kanban.root;

const options = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetBoard() {
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, options);

  const memoizedValue = useMemo(
    () => ({
      board: data?.board,
      boardLoading: isLoading,
      boardError: error,
      boardValidating: isValidating,
      boardEmpty: !isLoading && !data?.board?.columns?.length,
    }),
    [data?.board, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createColumn(columnData) {
  /**
   * Work on server
   */
  const data = { columnData };
  const newData = await axiosInstance.post(endpoints.kanban.createColumn, data, {
    params: { endpoint: 'create-column' },
  });

  const { newColumn } = newData.data;

  // await axios.post(endpoints.kanban, data, { params: { endpoint: 'create-column' } });

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentData) => {
      const { board } = currentData;

      const columns = [...board.columns, newColumn];

      return {
        ...currentData,
        board: {
          ...board,
          columns,
        },
      };
    },
    false
  );
  // mutate(
  //   URL,
  //   (currentData) => {
  //     const { board } = currentData;

  //     const columns = {
  //       ...board.columns,
  //       // add new column in board.columns
  //       [columnData.id]: columnData,
  //     };

  //     // add new column in board.ordered
  //     const ordered = [...board.ordered, columnData.id];

  //     return {
  //       ...currentData,
  //       board: {
  //         ...board,
  //         columns,
  //         ordered,
  //       },
  //     };
  //   },
  //   false
  // );
}

// ----------------------------------------------------------------------

export async function updateColumn(columnId, columnName) {
  /**
   * Work on server
   */
  // const data = { columnId, columnName };
  await axiosInstance.patch(endpoints.kanban.updateColumn, { columnId, newColumnName: columnName });

  /**
   * Work in local
   */
  mutate(endpoints.kanban.root);
  // mutate(
  //   URL,
  //   (currentData) => {
  //     const { board } = currentData;

  //     // current column
  //     const column = board.columns[columnId];

  //     const columns = {
  //       ...board.columns,
  //       // update column in board.columns
  //       [column.id]: {
  //         ...column,
  //         name: columnName,
  //       },
  //     };

  //     return {
  //       ...currentData,
  //       board: {
  //         ...board,
  //         columns,
  //       },
  //     };
  //   },
  //   false
  // );
}

// ----------------------------------------------------------------------

export async function moveColumn(newOrdered, ordered) {
  /**
   * Work on server
   */

  const newColumnsOrdered = ordered.map((order, index) => ({
    ...order,
    position: index,
  }));

  mutate(
    URL,
    (currentData) => {
      const { board } = currentData;
      return {
        ...currentData,
        board: {
          ...board,
          columns: newColumnsOrdered,
        },
      };
    },
    false
  );

  await axiosInstance.patch(endpoints.kanban.moveColumn, {
    newPosition: newOrdered.newPosition,
    columnId: newOrdered.columnToBeMove.id,
  });
}

// ----------------------------------------------------------------------

export async function clearColumn(columnId) {
  /**
   * Work on server
   */

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentData) => {
      const { board } = currentData;

      return {
        ...currentData,
        board: {
          ...board,
          columns: board.columns.map((item, index) =>
            item.id === columnId ? { ...item, task: [] } : item
          ),
        },
      };
    },
    false
  );

  await axiosInstance.patch(endpoints.kanban.clearColumn, { columnId });
}

// ----------------------------------------------------------------------

export async function deleteColumn(columnId) {
  /**
   * Work on server
   */
  // const data = { columnId };
  await axiosInstance.delete(endpoints.kanban.deleteColumn, { params: { columnId } });

  mutate(endpoints.kanban.root);

  /**
   * Work in local
   */
  // mutate(
  //   URL,
  //   (currentData) => {
  //     const { board } = currentData;

  //     const { columns } = board;

  //     const updatedColumns = columns.filter((item) => item?.id !== columnId);

  //     return {
  //       ...currentData,
  //       board: {
  //         ...board,
  //         columns: updatedColumns,
  //       },
  //     };
  //   },
  //   false
  // );
}

// ----------------------------------------------------------------------

export async function createTask(columnId, taskData) {
  /**
   * Work on server
   */
  const data = { columnId, title: taskData.name };

  await axiosInstance.post(endpoints.kanban.task.create, data);

  mutate(endpoints.kanban.root);

  /**
   * Work in local
   */
  // mutate(
  //   URL,
  //   (currentData) => {
  //     const { board } = currentData;

  //     // current column
  //     const column = board.columns[columnId];

  //     const columns = {
  //       ...board.columns,
  //       [columnId]: {
  //         ...column,
  //         // add task in column
  //         taskIds: [...column.taskIds, taskData.id],
  //       },
  //     };

  //     // add task in board.tasks
  //     const tasks = {
  //       ...board.tasks,
  //       [taskData.id]: taskData,
  //     };

  //     return {
  //       ...currentData,
  //       board: {
  //         ...board,
  //         columns,
  //         tasks,
  //       },
  //     };
  //   },
  //   false
  // );
}

// ----------------------------------------------------------------------

export async function updateTask(taskData) {
  /**
   * Work on server
   */
  // const data = { taskData };
  // await axios.post(endpoints.kanban, data, { params: { endpoint: 'update-task' } });

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentData) => {
      const { board } = currentData;

      const tasks = {
        ...board.tasks,
        // add task in board.tasks
        [taskData.id]: taskData,
      };

      return {
        ...currentData,
        board: {
          ...board,
          tasks,
        },
      };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function moveTask(updateColumns) {
  /**
   * Work in local
   */

  if (updateColumns?.type === 'differentColumn') {
    // Fix the order
    // Source Column
    const newSourceColumn = updateColumns.sourceColumn.tasks.map((item, index) => ({
      ...item,
      position: index,
      columnId: updateColumns.sourceColumn.id,
    }));
    // Destination Column
    const newDestinationColumn = updateColumns.destinationColumn.tasks.map((item, index) => ({
      ...item,
      position: index,
      columnId: updateColumns.destinationColumn.id,
    }));

    const allTasks = [...newSourceColumn, ...newDestinationColumn];

    mutate(
      URL,
      (currentData) => {
        const { board } = currentData;

        return {
          ...currentData,
          board: {
            ...board,
            columns: board.columns.map((column) => {
              if (column.id === updateColumns.sourceColumn.id) {
                return {
                  ...column,
                  task: newSourceColumn,
                };
              }
              if (column.id === updateColumns.destinationColumn.id) {
                return {
                  ...column,
                  task: newDestinationColumn,
                };
              }
              return column;
            }),
          },
        };
      },
      false
    );

    await axiosInstance.patch(endpoints.kanban.task.moveTask, {
      allTasks,
      type: 'differentColumn',
    });

    return;
  }

  mutate(
    URL,
    (currentData) => {
      const { board } = currentData;

      // update board.columns
      return {
        ...currentData,
        board: {
          ...board,
          columns: board.columns.map((column) =>
            column.id === updateColumns.columnId ? { ...column, task: updateColumns.tasks } : column
          ),
        },
      };
    },
    false
  );

  /**
   * Work on server
   */
  // const data = { updateColumns };
  await axiosInstance.patch(endpoints.kanban.task.moveTask, updateColumns);
}

// ----------------------------------------------------------------------

export async function deleteTask(columnId, taskId) {
  /**
   * Work on server
   */
  // const data = { columnId, taskId };
  // await axios.post(endpoints.kanban, data, { params: { endpoint: 'delete-task' } });

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentData) => {
      const { board } = currentData;

      const { tasks } = board;

      // current column
      const column = board.columns[columnId];

      const columns = {
        ...board.columns,
        [column.id]: {
          ...column,
          // delete tasks in column
          taskIds: column.taskIds.filter((id) => id !== taskId),
        },
      };

      // delete tasks in board.tasks
      delete tasks[taskId];

      return {
        ...currentData,
        board: {
          ...board,
          columns,
          tasks,
        },
      };
    },
    false
  );
}
