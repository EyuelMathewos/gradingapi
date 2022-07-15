import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const roles = require("./data/roles")
const users = require("./data/users")
const testdb = require("./data/test")
const permissions = require("./data/permissions")
const eroll = require("./data/enrollment")
const courses = require("./data/courses")

async function main() {

  await prisma.roles.createMany({
    data: roles
  })

  await prisma.permissions.createMany({
    data: permissions
  })

  await prisma.user.createMany({
    data: users
  })

  
  await prisma.course.createMany({
    data: courses
  })
  
  await prisma.courseEnrollment.createMany({
    data: eroll
  })

  await prisma.test.createMany({
    data: testdb
  })
  
}

main().catch((error: Error) => {
  console.error(error)
  process.exit(1)
}).finally(async () => {
  await prisma.$disconnect()
})