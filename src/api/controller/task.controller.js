const Constants = require('../constants/constants');
const HTTP_STATUS_CODES = require('../constants/httpErrorCode');
const { taskService } = require('../services');
const APIError = require('../errors/apiError');
const API_ERROR_MSG = require('../errors/apiErrorMessage');

const createTask = async (req, res, next) => {
  const { text } = req.body;
  try {
    const task = await taskService.createTask(text);

    res.status(HTTP_STATUS_CODES.OK).json({
      type: Constants.success,
      task,
    });
  } catch (err) {
    next(err);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getTasks();

    res.status(HTTP_STATUS_CODES.OK).json({
      type: Constants.success,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

const moveTaskOnSameBoard = async (req, res, next) => {
  const { id } = req.params;
  const { position } = req.body;

  try {
    const task = await taskService.getTaskById(parseInt(id, 10));

    if (!task) {
      throw new APIError(HTTP_STATUS_CODES.NOT_FOUND, API_ERROR_MSG.TASK_NOT_FOUND);
    }

    const movedTask = await taskService.updateTaskPosition(task, position);
    res.status(HTTP_STATUS_CODES.OK).json({
      type: Constants.success,
      task: movedTask,
    });
  } catch (error) {
    next(error);
  }
};

const moveTaskOnDiffBoard = async (req, res, next) => {
  const { id } = req.params;
  const { status, position } = req.body;

  try {
    const task = await taskService.getTaskById(id);

    if (!task) {
      throw new APIError(HTTP_STATUS_CODES.NOT_FOUND, API_ERROR_MSG.TASK_NOT_FOUND);
    }

    const updatedTask = await taskService.updateTaskStatusAndPosition(task, status, position);

    res.status(HTTP_STATUS_CODES.OK).json({
      type: Constants.success,
      task: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  moveTaskOnSameBoard,
  moveTaskOnDiffBoard,
};
