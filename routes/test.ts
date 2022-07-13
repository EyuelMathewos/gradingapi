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

  router.route("/:courseId/tests")
  .post(async (req: CustomRequest, res: Response) => {
    const courseId = parseInt(req.params.courseId);

      validator(req.body, createRule, {}).then(async (response: any) => {
          try{
            const Test = await prisma.Test.create({
              data: {
                courseId,
                updatedAt: new Date(),
                name: req.body.name,
                date: new Date()
              },
            }).catch((error: string) => {
              console.log(error)
              res.send(error);
            })
    
            res.json(Test) 
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

router.route("/tests/:testId")
  .get(async (req: Request, res: Response) => {
    const id = parseInt(req.params.TestId);
    const Testenrollment = await prisma.Test.findMany({
      where: {
        id
      },
    }).catch((error: Error) => {
      res.json(error)
    })
    res.json(Testenrollment);
  })

  .put(async (req: CustomRequest, res: Response) => {
    const id = parseInt(req.params.testId);
    try {
      ForbiddenError.from(req.ability).throwUnlessCan('update', "Test");
      validator(req.body, updateRule, {}).then(async (response: any) => {
        const test = await prisma.Test.update({
          where: {
            id
          },
          data: {
            name: req.body.name,
            updatedAt: new Date()
          },
        });
        res.json(test)
      }).catch((error: Error) => {
        res.status(412)
        res.send(error)
      });

    } catch (error: any) {
      if (error instanceof ForbiddenError) {
        return res.status(403).send({
          status: 'forbidden',
          message: error.message
        });
      } else {
        res.send(error);
      }
    }
  })
  .delete(async (req: Request, res: Response) => {
    const id = parseInt(req.params.TestId);
    const Test = await prisma.Test.delete({
      where: {
        id
      },
    }).catch((error: Error) => {
      res.json(error)
    });
    res.json(Test)
  })


module.exports = router;