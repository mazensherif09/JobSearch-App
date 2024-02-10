import express from 'express';

import { 
deleteAccount, 
forgetPassword, 
getAccountsForRecoveryEmail, 
getProfileDataForAnotherUser,
getUserAccountData, otp, updateAccount 
} from './user.controller.js';

import { forgetPasswordVal, otpVal, paramsEmailVal, paramsIdVal, updateAccVal } from './user.validation.js';
import { validation } from '../../middleware/global-middleware/validation.js';
import { conflictingUser } from '../../middleware/user/conflictingUser.js';
import { protectedRoutes } from '../../middleware/global-middleware/protectedRoutes.js';

const userRouter = express.Router({ mergeParams: true });

userRouter
.route('/')
/*(5)-------- Get user account data  ---------------*/
.get( protectedRoutes , getUserAccountData)

/*(3)-------- update account ---------------*/
userRouter.put('/updateAccount', 
protectedRoutes, validation(updateAccVal), conflictingUser, updateAccount)

/*(4)-------- Delete account ---------------*/
userRouter.delete('/deleteAccount', protectedRoutes, deleteAccount)

/*(8)-------- Forget password ---------------*/
userRouter.post('/forgetPassword', validation(forgetPasswordVal), forgetPassword)

/*(9)-------- Get all accounts associated to a specific recovery Email ---------------*/
userRouter.get('/accounts/:recoveryEmail', validation(paramsEmailVal), getAccountsForRecoveryEmail)

/*()-------- enterOtp ---------------*/
userRouter.post('/enterOtp', validation(otpVal), otp)

/*(6)-------- Get profile data for another user  ---------------*/
userRouter.get('/:id', validation(paramsIdVal), protectedRoutes, getProfileDataForAnotherUser)






export default userRouter;