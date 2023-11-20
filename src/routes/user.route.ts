import { Router } from 'express';
import * as UserRegisterSchema from '../../schemas/user-register.schema.json';

import { UserDetail, UserList, UserRegister } from '~/handlers/user.handler';
import { validateKey } from '~/middlewares/basic-auth';
import { validateBody } from '~/middlewares/validation';

const userRoute: Router = Router();

userRoute.get('/', validateKey, UserList);
userRoute.get('/:id', validateKey, UserDetail);
userRoute.post('/register', validateKey, validateBody(UserRegisterSchema), UserRegister);
// userRoute.put('/update/:id', validateKey, UserUpdate);

export default userRoute;
