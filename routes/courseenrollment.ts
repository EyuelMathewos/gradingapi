import express, { Request, Response } from 'express';
import { validator } from "../validator/index";
import { orderValidation } from "../validator/orderValidation";
const router = express.Router();
const { ForbiddenError } = require('@casl/ability');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

interface CustomRequest extends Request {
  ability ? : any
}

router.route("/")
  .get(async (req: CustomRequest, res: Response) => {
    if (req.ability.can('read', 'CourseEnrollment')) {
      const orders = await prisma.CourseEnrollment.findMany({
        include: {
          item: true
        },
      }).catch((error: string) => {
        res.send(error);
      })
      res.json(orders);
    }else {
      try {
        ForbiddenError.from(req.ability).throwUnlessCan('read', "CourseEnrollment");
      } catch (error: any) {
        return res.status(403).send({
          status: 'forbidden',
          message: error.message
        });
      }
    }
  })


  .post( async (req: CustomRequest, res: Response) => {
    if (req.ability.can('create', 'CourseEnrollment')) {
      validator(req.body, orderValidation, {}).then(async (response: any) => {
       
          const CourseEnrollment = await prisma.CourseEnrollment.create({
            data: {
              itemId: parseInt(req.body.itemId),
              itemAmount: parseInt(req.body.itemAmount),
              customerId: parseInt(req.body.customerId)
            },
          }).catch((error: string) => {
            res.send(error);
          })
          res.json(CourseEnrollment)
        
      });
    }else {
      try {
        ForbiddenError.from(req.ability).throwUnlessCan('create', "CourseEnrollment");
      } catch (error: any) {
        return res.status(403).send({
          status: 'forbidden',
          message: error.message
        });
      }
    }
  })

router.route("/customerorder/:id")
  .get(async (req: CustomRequest, res: Response) => {
    const {
      id
    } = req.params;
    if (req.ability.can('read', 'CourseEnrollment')) {
      const users = await prisma.user.findMany({
        where: {
          id,
        },
        include: {
          orders: true
        },
      }).catch((error: string) => {
        res.send(error);
      })
      res.json(users);
    } else {
      const CourseEnrollment = await prisma.CourseEnrollment.create({
        data: {
          itemId: parseInt(req.body.itemId),
          itemAmount: parseInt(req.body.itemAmount),
          customerId: parseInt(req.body.customerId)
        },
      }).catch((error: string) => {
        res.send(error);
      })
      res.json(CourseEnrollment)
    }

  })

module.exports = router;