import { Task } from '@prisma/client'
import { Response, Request, NextFunction } from 'express'
import { ParsedToken } from '../../../typings/token'
import { db } from '../../db'
import { ParamsWithId } from '../../interfaces/ParamsWithId'
import { TaskInput } from './tasks.schemas'

export async function findAll(
  req: Request,
  res: Response<Task[]>,
  next: NextFunction
) {
  try {
    const tasks = await db.task.findMany()
    res.json(tasks)
  } catch (error) {
    next(error)
  }
}

export async function createOne(
  req: Request<{}, Task, TaskInput>,
  res: Response<Task>,
  next: NextFunction
) {
  try {
    const user: ParsedToken = req.user

    const taskData = {
      ...req.body,
      userId: user.userId,
    }

    const task = await db.task.create({
      data: taskData,
    })
    res.status(201).json(task)
  } catch (error) {
    next(error)
  }
}

export async function findOne(
  req: Request<ParamsWithId, Task, {}>,
  res: Response<Task>,
  next: NextFunction
) {
  try {
    const user: ParsedToken = req.user

    const task = await db.task.findUnique({
      where: {
        id: req.params.id,
      },
    })
    if (!task || task.userId !== user.userId) {
      res.status(404)
      throw new Error('Task not found.')
    }

    res.json(task)
  } catch (error) {
    next(error)
  }
}

export async function updateOne(
  req: Request<ParamsWithId, Task, TaskInput>,
  res: Response<Task>,
  next: NextFunction
) {
  try {
    const user: ParsedToken = req.user

    const task = await db.task.findUnique({
      where: {
        id: req.params.id,
      },
    })
    if (!task || task.userId !== user.userId) {
      res.status(404)
      throw new Error('Task not found.')
    }

    const newTask = await db.task.update({
      where: { id: req.params.id },
      data: { ...req.body, userId: user.userId },
    })

    res.json(newTask)
  } catch (error) {
    next(error)
  }
}
