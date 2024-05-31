import { PrismaClient } from '@prisma/client'

// create a Prisma client
const prismaClientSingleton = () => {
  return new PrismaClient()
}

// `globalThis` is a keyword in different js environments, used as a standard way to define the global `this` object, or the 'global object'. Unlike `window` or `self` it's guranteed to work in window/non-window contexts. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis#description

// `declare` tells typescript compiler that this object will exist when the app runs and has this type, but don't trans-compile it into the javscript bundle.

// declare the type of the prisma object on the globalThis object
declare const globalThis: {
  prisma: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

// attach the Prisma object to the globalThis object, if it does not exist already
// `??` - Nullish Coalescing - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing
const db = globalThis.prisma ?? prismaClientSingleton()

export default db

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db