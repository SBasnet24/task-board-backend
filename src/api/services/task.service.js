/* eslint-disable no-nested-ternary */
const NodeCache = require('node-cache');
const { Op } = require('sequelize');
const { taskRepository } = require('../repositories');

const cache = new NodeCache();

const createTask = async (text) => {
  const maxPositionTask = await taskRepository.findMaxPositionTask();
  const position = maxPositionTask ? maxPositionTask.position + 1 : 0;

  const task = await taskRepository.createTask({
    text,
    status: 'todo',
    position,
  });

  // Update the cache by removing the 'tasks' key
  cache.del('tasks');

  return task;
};

const getTasks = async () => {
  const cacheKey = 'tasks';
  let tasks = cache.get(cacheKey);

  if (!tasks) {
    tasks = await taskRepository.findTasks(
      {},
      {
        order: [['position', 'ASC']],
      }
    );
    cache.set(cacheKey, tasks);
  }

  return tasks;
};

const updateTaskPosition = async (task, position) => {
  const currentPos = task.position;
  const newPosition = parseInt(position, 10);

  if (newPosition === currentPos) {
    return task; // No change in position
  }

  const tasksToUpdate = await taskRepository.findTasks(
    {
      status: task.status,
      position: {
        [Op.between]: [Math.min(currentPos, newPosition), Math.max(currentPos, newPosition)],
      },
    },
    {
      order: [['position', 'ASC']],
    }
  );

  if (tasksToUpdate.length === 0) {
    // No tasks to update, just update the current task
    await task.update({ position: newPosition });
    return task;
  }

  const updatedTasks = [];
  const updatePromises = tasksToUpdate.map(async (taskToUpdate) => {
    const updatedPosition =
      taskToUpdate.position === currentPos
        ? newPosition
        : currentPos < newPosition
        ? taskToUpdate.position - 1
        : taskToUpdate.position + 1;
    const updatedTask = await taskToUpdate.update({ position: updatedPosition });
    updatedTasks.push(updatedTask);
  });

  await Promise.all(updatePromises);
  await task.update({ position: newPosition });

  cache.del('tasks');

  return task;
};

const updateTaskStatusAndPosition = async (task, newStatus, newPosition) => {
  const currentStatus = task.status;
  const currentPos = task.position;

  if (newStatus === currentStatus && newPosition === currentPos) {
    return task; // No change in status or position
  }

  const tasksToUpdate = await taskRepository.findTasks({
    [Op.and]: [
      { id: { [Op.ne]: task.id } },
      {
        [Op.or]: [
          { status: currentStatus, position: { [Op.lt]: currentPos } },
          { status: newStatus, position: { [Op.gte]: newPosition } },
        ],
      },
    ],
  });

  await Promise.all(
    tasksToUpdate.map(async (taskToUpdate) => {
      const { status, position } = taskToUpdate;
      if (status === currentStatus && position === currentPos) {
        taskToUpdate.position = newPosition;
      } else if (status === newStatus && position >= newPosition) {
        taskToUpdate.position += 1;
      } else if (status === currentStatus && position > currentPos && position <= newPosition) {
        taskToUpdate.position -= 1;
      }
      await taskToUpdate.save();
      return taskToUpdate;
    })
  );

  const updatedTask = await taskRepository.updateTask(
    { status: newStatus, position: newPosition },
    { where: { id: task.id } }
  );

  cache.del('tasks');

  return updatedTask;
};

const getTaskById = async (id) => {
  const task = await taskRepository.findTask({ id });
  return task;
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTaskPosition,
  updateTaskStatusAndPosition,
};
