import express, {
  Request,
  Response
} from 'express';
import {
  validator
} from "../validator/index";
import {
  enrollValidation
} from "../validator/enrollValidation";
const router = express.Router();
const {
  ForbiddenError
} = require('@casl/ability');
const {
  PrismaClient,
  Prisma
} = require('@prisma/client');
const prisma = new PrismaClient()

interface CustomRequest extends Request {
  ability ? : any
}
router.route("/:userId/courses")
  .get(async (req: CustomRequest, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (req.ability.can('read', 'CourseEnrollment')) {
      const CourseEnrollment = await prisma.CourseEnrollment.findMany({
        where: {
          userId
        },
      }).catch((error: string) => {
        res.send(error);
      })
      res.json(CourseEnrollment)
    }
  })
  .post(async (req: CustomRequest, res: Response) => {
    try {
      ForbiddenError.from(req.ability).throwUnlessCan('create', "CourseEnrollment");
      validator(req.body, enrollValidation, {}).then(async (response: any) => {

        const CourseEnrollment = await prisma.CourseEnrollment.create({
          data: {
            userId: parseInt(req.body.userId),
            courseId: parseInt(req.body.courseId),
            role: parseInt(req.body.role)
          },
        });
        res.json(CourseEnrollment)

      }).catch((error: any) => {
        res.status(412)
        res.send(error)
      });
    } catch (error: any) {
      console.log("*********Error occured")
      console.log(error)
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          res.status(409)
          res.send({
            error: 'Unique constraint failed on the fields: (`userId`,`courseId`)'
          });
        }
        if (error.code === 'P2003') {
          res.status(400)
          res.send({
            error: 'CourseEnrollment_fields: (`userId`,`courseId`)'
          });
        } else {
          res.send(error);
        }
      }
    }

  })
router.route("/:userId/courses/:courseId")
  .delete(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const courseId = parseInt(req.params.courseId);
    try {
      const course = await prisma.CourseEnrollment.delete({
        where: {
          userId_courseId: {
            userId,
            courseId,
          }
        },
      });
      res.send({
        message: "Course Droped successfully",
        courseId
      })
    } catch (error: any) {
      if (error instanceof ForbiddenError) {
        return res.status(403).send({
          status: 'forbidden',
          message: error.message
        });
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          res.status(410)
          res.send({
            error: 'Record to delete does not exist.'
          });
        }
      } else {
        res.send(error);
      }
    }
  })

module.exports = router;