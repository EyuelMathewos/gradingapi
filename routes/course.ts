import express, { Request, Response } from 'express';
import { validator } from "../validator/index";
import { courseValidation } from "../validator/courseValidation";

const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { ForbiddenError } = require('@casl/ability');

const prisma = new PrismaClient()

interface CustomRequest extends Request {
  ability ? : any
}

router.route("/")
  .get(async (req: CustomRequest, res: Response) => {
    if (req.ability.can('read', 'Course')) {
      const items = await prisma.Course.findMany({}).catch((error: string) => {
        res.send(error);
      })
      res.json(items);
    } else {
      try {
        ForbiddenError.from(req.ability).throwUnlessCan('read', "Course");
      } catch (error: any) {
        return res.status(403).send({
          status: 'forbidden',
          message: error.message
        });
      }
    }
  })


  .post(async (req: CustomRequest, res: Response) => {
    if (req.ability.can('create', 'Course')) {
      validator(req.body, courseValidation, {}).then(async (response: any) => {
        const Course = await prisma.Course.create({
          data: {
            name: req.body.name,
            courseDetails: req.body.courseDetails
          },
        }).catch((error: string) => {
          res.send(error);
        })

        res.json(
          {
            message: "Course created successfully",
            data: Course
          })

      });
    } else {
      try {
        ForbiddenError.from(req.ability).throwUnlessCan('create', "Course");
      } catch (error: any) {
        return res.status(403).send({
          status: 'forbidden',
          message: error.message
        });
      }
    }


  })
router.route("/:courseId")
  .get(async (req: Request, res: Response) => {
    const courseId = parseInt(req.params.courseId);
    const courseenrollment = await prisma.Course.findMany({
      where: {
        courseId
      },
    }).catch((error: Error) => {
      res.json(error)
    })
    res.json(courseenrollment);
  })

  .put(async (req: CustomRequest, res: Response) => {
    const id = parseInt(req.params.id);
    try {
      ForbiddenError.from(req.ability).throwUnlessCan('update', "Course");
      validator(req.body, courseValidation, {}).then(async (response: any) => {
        const course = await prisma.Course.update({
          where: {
            id
          },
          data: {
            name: req.body.name,
            courseDetails: req.body.courseDetails
          },
        });
        res.json(course)
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
    const courseId = parseInt(req.params.courseId);
    const course = await prisma.Course.delete({
      where: {
        courseId,
      },
    }).catch((error: Error) => {
      res.json(error)
    });
    res.json(course)
  })


module.exports = router;