const { Task } = require('../../models');

const findTask = (condtions, options = {}) =>
  Task.findOne({
    where: condtions,
    ...options,
  });

const createTask = (task) => Task.create(task);

const findTasks = (condtions, options = {}) =>
  Task.findAll({
    where: condtions,
    ...options,
  });

const findMaxPositionTask = async () => {
  const maxPositionTask = await Task.findOne({
    where: { status: 'todo' },
    order: [['position', 'DESC']],
  });
  return maxPositionTask;
};

const updateTask = async (values, options = {}) => {
  await Task.update(values, options);
  const updatedTask = await Task.findOne({ where: options.where });
  return updatedTask;
};

module.exports = {
  findTask,
  createTask,
  findTasks,
  findMaxPositionTask,
  updateTask,
};
