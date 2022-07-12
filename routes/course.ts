import express, { Request, Response } from 'express';
import { validator } from "../validator/index";
import { itemValidation } from "../validator/itemValidation";

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
      validator(req.body, itemValidation, {}).then(async (response: any) => {
          const Course = await prisma.Course.create({
            data: {
              itemname: req.body.itemname,
              itemprice: parseInt(req.body.itemprice)
            },
          }).catch((error: string) => {
            res.send(error);
          })

          res.json(Course)
        
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

module.exports = router;