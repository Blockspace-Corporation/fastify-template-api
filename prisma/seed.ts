import { PrismaClient } from "@prisma/client";
import * as bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from '../src/constants';
const prisma = new PrismaClient()
async function main(){
    const userData = {
        email: 'admin@gmail.com',
        firstName:'Admin',
        lastName: 'Admin',
        contactNo: '123456',
        address:    'Cebu City',
        username: 'admin',
        password: 'nexgen@admin',
    }
    bcrypt.hash(
      userData.password as string,
      BCRYPT_SALT_ROUNDS,
      async function (err, hash) {
        if (err) throw err;

        await prisma.user.create({
          data: {
            username: userData.username,
            password: hash,
            firstName: userData.firstName,
            lastName: userData.lastName,
            contactNo: userData.contactNo,
            address: userData.address,
            email: userData.email,
          },
        });
      }
    );
}

main().then(async()=>{
    await prisma.$disconnect()
})
.catch(async(e)=>{
    console.error(e);
    await prisma.$disconnect()
    process.exit(1);
})