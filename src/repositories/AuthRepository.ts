import prisma from '../db';
import User from '../models/users';
import * as bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from '../constants';

export default class AuthRepository {
  static getUserByUsername = async (username: string) => {
    const targetUser = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    if (!targetUser) {
      throw 'getUserByUsername: User not found';
    }

    return targetUser;
  };
  static registerUser = async (userData: User) => {
    try{
      const newUser = await prisma.user.create({
        data: {
          username: userData.username,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          contactNo: userData.contactNo,
          address: userData.address,
        },
      });
      return newUser;
    }catch(error){
      throw String(error || 'Unknown error occurred.');
    }
  }
  static viewUser = async()=>{
    try {
      const allLabels = await prisma.user.findMany({})

      return allLabels;
    } catch (error) {
      throw String(error || 'Unknown error occurred.');
    }
  }
  static createUser = async (userData: User) => {
    try {
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
              email: userData.email,
              contactNo: userData.contactNo,
              address: userData.address,
            },
          });
        }
      );
    } catch (error) {
      throw String(error || 'Unknown error occurred.');
    }
  };
}
