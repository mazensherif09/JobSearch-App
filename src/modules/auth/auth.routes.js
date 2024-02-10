import express from 'express';

import { checkEmail } from '../../middleware/user/checkEmail.js';
import { signUp, signin, changePassword } from './auth.controller.js';
import {validation} from '../../middleware/global-middleware/validation.js'
import {  signInSchemaValidation, signUpSchemaValidation, changePasswordVal } from './auth.validation.js';
import { protectedRoutes } from '../../middleware/global-middleware/protectedRoutes.js';

const authRouter = express.Router();

/*(1)-------- Sign Up ---------------*/
authRouter.post('/signup', validation(signUpSchemaValidation) ,checkEmail ,signUp)
/*(2)-------- Sign In ---------------*/
authRouter.post('/signin',validation(signInSchemaValidation) ,signin)
/*(7)-------- Sign In ---------------*/
authRouter.patch('/changePassword', protectedRoutes, validation(changePasswordVal) , changePassword)


export default authRouter;