import { Router } from 'express';
import * as AuthControllers from './auth.controllers';

const router = Router();


router.post('/register', AuthControllers.register);


export default router;