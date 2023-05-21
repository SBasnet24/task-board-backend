const express = require('express');
const { taskController } = require('../controller');
const { taskValidator } = require('../validators');

const router = express.Router();

router
  .route('/')
  .post(taskValidator.createTaskValidator, taskController.createTask)
  .get(taskController.getTasks);

router.put(
  '/:id/move',
  taskValidator.moveTaskPositionValidator,
  taskController.moveTaskOnSameBoard
);

router.put(
  '/:id/move-to-board',
  taskValidator.moveTaskAndStatusValidator,
  taskController.moveTaskOnDiffBoard
);

module.exports = router;
