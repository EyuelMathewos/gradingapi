import express, {
  Request,
  Response
} from 'express';
import bcrypt from 'bcryptjs';
import {
  validator
} from "../validator/index";
import {
  createRule,
  updateRule,
  loginValidation
} from "../validator/userValidation";
const router = express.Router();
const jwt = require('jsonwebtoken');
const {
  PrismaClient,
  Prisma
} = require('@prisma/client');
const {
  accessibleBy
} = require('@casl/prisma');
const {
  permittedFieldsOf
} = require('@casl/ability/extra');
const {
  ForbiddenError
} = require('@casl/ability');


const prisma = new PrismaClient();
const {
  getUser,
  generateHash
} = require("../service/auth");
const {
  selectedFields
} = require("../service/selectFields")

interface CustomRequest extends Request {
  ability ? : any
}
const ALL_FIELDS = ["email", "name"];
const options = {
  fieldsFrom: (rule: {
    fields ? : JSON | any;
  }) => rule.fields || ALL_FIELDS
};



router.route("/")
  .get(async (req: CustomRequest, res: Response) => {
    try {
      ForbiddenError.from(req.ability).throwUnlessCan('read', "user");
      const fields = permittedFieldsOf(req.ability, 'read', "user", options);
      const User = await prisma.User.findMany({
        where: accessibleBy(req.ability).User,
        select: selectedFields(fields)
      });
      res.json(User);
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


  .post(async (req: CustomRequest, res: Response) => {
    try {
      ForbiddenError.from(req.ability).throwUnlessCan('create', "user");
      const role: number = parseInt(req.body.role)
      validator(req.body, createRule, {}).then(async (response: any) => {
        const valdationStatus: boolean = response.status;
        if (valdationStatus) {
          const hash = await generateHash(req.body.password);
          const User = await prisma.User.create({
            data: {
              email: req.body.email,
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              password: hash,
              social: req.body.social,
              role: role
            },
          });
          res.status(201).json({
            message: "user created successfully",
            data: User
          });
        }
      }).catch((error: any) => {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            res.status(409)
            res.send({
              error: 'There is a unique constraint violation, a new user cannot be created with this email'
            });
          }
        } else {
          res.status(412)
          res.send(error)
        }
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
  .delete(async (req: CustomRequest, res: Response) => {
    const email = req.body.email;
    try {
      ForbiddenError.from(req.ability).throwUnlessCan('delete', "user");
      const User = await prisma.User.delete({
        where: {
          email
        },
      })
      res.json({
        message: `user successfully deleted`,
        id: User.id
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

router.route("/login")
  .post(async (req: CustomRequest, res: Response) => {
    try {
      ForbiddenError.from(req.ability).throwUnlessCan('create', "user");
      validator(req.body, loginValidation, {}).then(async (response: any) => {
        const valdationStatus: boolean = response.status;
        if (valdationStatus) {
          const User = await getUser(req.body.email);
          const isPass = User?.password != null ? bcrypt.compareSync(req.body.password, User.password) : false;
          if (isPass) {
            const accesstokens = {
              clientId: User.id,
              role: User.role
            };
            const encrypt = jwt.sign(accesstokens, process.env.SECRET, {
              expiresIn: '1h'
            });
            res.json({
              clientId: User.id,
              token: encrypt
            });
          } else {
            res.status(401);
            res.json({
              message: "Incorrect Password or Account Name"
            })
          }
        }
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

router.route("/:id")
  .get(async (req: CustomRequest, res: Response) => {
    const id = parseInt(req.params.id);
    try {
      ForbiddenError.from(req.ability).throwUnlessCan('read', "user");
      const User = await prisma.User.findMany({
        where: {
          id,
        },
        // include: { tokens: true },
      }).catch((error: string) => {
        res.json(error)
      })
      res.json(User);
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

  .put(async (req: CustomRequest, res: Response) => {
    const id = parseInt(req.params.id);
    try {
      ForbiddenError.from(req.ability).throwUnlessCan('update', "user");
      validator(req.body, updateRule, {}).then(async (response: any) => {
        const valdationStatus: boolean = response.status;
        if (valdationStatus) {
          const User = await prisma.User.update({
            where: {
              id
            },
            data: {
              email: req.body.email,
              firstName: req.body.firstName,
              lastName: req.body.lastName
            },
          })
          res.status(201).json({
            message: 'user updated successfully',
            data: User
          })
        }
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

  .delete(async (req: CustomRequest, res: Response) => {
    const id = parseInt(req.params.id);
    try {
      ForbiddenError.from(req.ability).throwUnlessCan('delete', "User");
      const User = await prisma.User.delete({
        where: {
          id
        }
      });
      res.json({
        message: 'user deleted successfully',
        id
      })
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

module.exports = router;