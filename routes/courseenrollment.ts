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
    try {
      const userId = parseInt(req.params.userId);
      ForbiddenError.from(req.ability).throwUnlessCan('create', "CourseEnrollment");
      const CourseEnrollment = await prisma.CourseEnrollment.findMany({
        where: {
          userId
        },
      }).catch((error: string) => {
        res.send(error);
      })
      res.json({
        message: `List of course with a student Id: ${userId} Enrolled`, 
        data: CourseEnrollment
      });
    } catch(error: any){
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
  .post(async (req: CustomRequest, res: Response) => {
    try {
      ForbiddenError.from(req.ability).throwUnlessCan('create', "CourseEnrollment");
      validator(req.body, enrollValidation, {}).then(async (response: any) => {
        const valdationStatus: boolean = response.status;
        if (valdationStatus) {
          const CourseEnrollment = await prisma.CourseEnrollment.create({
            data: {
              userId: parseInt(req.body.userId),
              courseId: parseInt(req.body.courseId),
              role: parseInt(req.body.role)
            },
          });
          res.json({
            message: `student with id ${req.body.userId} successfully enrolled for a course`,
            data: CourseEnrollment
          })
        }
      }).catch((error: any) => {
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
        } else {
          res.send(error);
        }

      });
    } catch (error: any) {
      res.send(error);
    }

  })
router.route("/:userId/courses/:courseId")
  .delete(async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const courseId = parseInt(req.params.courseId);
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
      });
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