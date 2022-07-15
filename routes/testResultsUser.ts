import express, { Request, Response } from 'express';
import { validator } from "../validator/index";
import { createRule, updateRule } from "../validator/testValidation";

const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { ForbiddenError } = require('@casl/ability');

const prisma = new PrismaClient()
 

interface CustomRequest extends Request {
  ability ? : any
}

router.route("/:userId/test-results")
  .get(async (req: Request, res: Response) => {
    const id = parseInt(req.params.userId);
    const Testenrollment = await prisma.TestResult.findMany({
      where: {
        id
      },
    }).catch((error: Error) => {
      res.json(error)
    })
    res.json(Testenrollment);
  })
  
  .post(async (req: CustomRequest, res: Response) => {
    const courseId = parseInt(req.params.courseId);

      validator(req.body, createRule, {}).then(async (response: any) => {
          try{
            const TestResult = await prisma.TestResult.create({
              data: {
                courseId,
                updatedAt: new Date(),
                name: req.body.name,
                date: new Date()
              },
            }).catch((error: string) => {
              res.send(error);
            })
    
            res.json(TestResult) 
          }  catch (error: any) {
            if (error instanceof ForbiddenError) {
              return res.status(403).send({
                status: 'forbidden',
                message: error.message
              });
            } else {
              res.send(error);
            }
          }

      }).catch((error: Error) => {
        res.status(412)
        res.send(error)
      });
  })


module.exports = router;