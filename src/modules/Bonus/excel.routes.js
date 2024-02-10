import express from 'express';
import { createExel } from './excel.controller.js';
import { protectedRoutes } from '../../middleware/global-middleware/protectedRoutes.js';

const bonusRouter = express.Router();

/*(1)-------- Sign Up ---------------*/
bonusRouter.get('/' , protectedRoutes , createExel)

export default bonusRouter;