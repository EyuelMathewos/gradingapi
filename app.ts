import express, { Request, Response, NextFunction } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
const app = express();
const path = require('path');
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const enrolRouter = require("./routes/courseenrollment");
const courseRouter = require("./routes/course");
const testRouter = require("./routes/test");
const testResCourse = require("./routes/testResultsCourse")
const testResUser = require("./routes/testResultsUser")
const rolesRouter = require("./routes/roles");
const permissionRouter = require("./routes/permissions");
const defineAbilitiesFor = require('./accesscontrol/accesscontrol');
const { getUserRoles, anonymousAbility, verifyToken } = require("./service/auth")
const { interpolate } = require('./service/interpolate');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
interface CustomRequest extends Request {
  ability ? : any
}

async function myLogger(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader != 'undefined') {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      const verifydecoded = await verifyToken( bearerToken );
      res.setHeader("token", bearerToken);
      const user = { id: verifydecoded.clientId };
      const usersPermissions = await getUserRoles(verifydecoded.clientId);
      const replacedIdAttribute = interpolate(JSON.stringify(usersPermissions), {user});

      if (usersPermissions != null) {
        const userAbility = defineAbilitiesFor(replacedIdAttribute);
        req.ability = userAbility;
      }
    } else {
      const ANONYMOUS_ABILITY = await anonymousAbility();
      const anonymousPermissions = defineAbilitiesFor( ANONYMOUS_ABILITY );
      req.ability = anonymousPermissions;
    }
  } catch (error) {
      if(error instanceof JsonWebTokenError){
        next(res.status(401).send(error));
      }else{
        res.send(error)
      }
  }
  next()
}

app.use(myLogger)

app.use('/', indexRouter);
app.use('/users', usersRouter, enrolRouter, testResUser);
app.use('/courses', courseRouter, testRouter, testResCourse);
app.use('/roles', rolesRouter);
app.use('/permissions', permissionRouter);


module.exports = app;