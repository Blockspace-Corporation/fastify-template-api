import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import * as bcrypt from 'bcrypt';
import { add, getUnixTime } from 'date-fns';
import {
  IUserID,
  IUserLoginRequestBody,
  IUserRegisterRequestBody,
} from '../schemas/AuthSchemas';
import AuthRepository from '../repositories/AuthRepository';

export const loginHandler =
  (fastify: FastifyInstance) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    const requestBody = request.body as IUserLoginRequestBody;

    let targetUser: any;

    try {
      targetUser = await AuthRepository.getUserByUsername(requestBody.username);
    } catch (error) {
      console.error(`loginHandler: error trying to get user: ${error}`);
      return reply.badRequest('Invalid username or password.');
    }

    const isCorrectPassword = await bcrypt.compare(
      requestBody.password,
      targetUser.password
    );

    if (!isCorrectPassword) {
      return reply.badRequest('Invalid username or password.');
    }

    const tokenExpiryDateTime = add(new Date(), { hours: 2 });
    const userId = targetUser.id;

    const newAccessToken = fastify.jwt.sign({
      aud: userId,
      exp: getUnixTime(tokenExpiryDateTime),
    });

    return reply.send({
      accessToken: newAccessToken,
    });
  };
export const registerUserHandler = async(
  request: FastifyRequest,
  reply: FastifyReply
)=>{
  const requestBody = request.body as IUserRegisterRequestBody;
  if(
    !requestBody
  ){
    return reply.badRequest(
      `Invalid request body. Required fields: 'username', 'password', 'confirmPassword', 'firstName', 'lastName', 'email', 'contactNo', 'address'`
    );
  }
  const register = await AuthRepository.registerUser(requestBody);
  return reply.send(register);
}
export const registerHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const requestBody = request.body as IUserRegisterRequestBody;

  if (
    !requestBody ||
    !requestBody.username ||
    !requestBody.password ||
    !requestBody.confirmPassword ||
    !requestBody.firstName ||
    !requestBody.lastName ||
    !requestBody.email ||
    !requestBody.contactNo ||
    !requestBody.address ||
    !requestBody
  ) {
    return reply.badRequest(
      `Invalid request body. Required fields: 'username', 'password', 'confirmPassword', 'firstName', 'lastName', 'email', 'contactNo', 'address'`
    );
  }

  let existingUser: any;

  try {
    existingUser = await AuthRepository.getUserByUsername(requestBody.username);
  } catch {
    // pass
  }

  if (existingUser) {
    return reply.badRequest('Username is already taken.');
  }

  const isMatchingPassword =
    requestBody.password === requestBody.confirmPassword;

  if (!isMatchingPassword) {
    return reply.badRequest('Passwords do not match');
  }

  try {
    AuthRepository.createUser({
      username: requestBody.username,
      password: requestBody.password,
      firstName: requestBody.firstName,
      lastName: requestBody.lastName,
      email: requestBody.email,
      contactNo: requestBody.contactNo,
      address: requestBody.address,
    });
  } catch (error) {
    reply.internalServerError(String(error || 'Unknown error occurred.'));
  }

  return reply.send({
    message: 'Registration successful.',
  });
};

export const readAllUsers = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {

    const targetUsers = await AuthRepository.viewUser();

    return reply.send({
      labels: targetUsers,
    });
  } catch (error) {
    console.error(
      `readAllLabelsHandler: error trying to read labels: ${error}`
    );
    reply.internalServerError(String(error || 'Unknown error occurred.'));
  }
};

export const updateUserHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const query = request.body as IUserRegisterRequestBody;
    const targetUser = await AuthRepository.updateUser(query);
    return reply.send(targetUser);

  } catch (error) {
    console.error(`updateLabelHandler: error trying to update label: ${error}`);
    reply.internalServerError(String(error || 'Unknown error occurred.'));
  }
};
export const readOneUserHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const requestParams = request.params as IUserRegisterRequestBody;
    requestParams.id = Number(requestParams.id);
    if (!requestParams || !requestParams.id) {
      return reply.badRequest("Missing 'id' parameter in URI 'auth/:id'");
    }

    const targetUser = await AuthRepository.getUserById(requestParams.id);

    if (!targetUser) {
      return reply.notFound('User not found.');
    }

    return reply.send ({
      data: targetUser,
    })
  } catch (error) {
    console.error(`readOneLabelHandler: error trying to read user: ${error}`);
    reply.internalServerError(String(error || 'Unknown error occurred.'));
  }
};

export const deleteUserHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const requestParams = request.params as IUserID;
    requestParams.id = Number(requestParams.id);
    if (!requestParams || !requestParams.id) {
      return reply.badRequest(
        "Missing or invalid request body. Required fields: 'id'"
      );
    }

    await AuthRepository.deleteUser(requestParams.id);

    return reply.send({
      message: 'Label has been removed successfully.',
    });

  } catch (error) {
    console.error(`deleteLabelHandler: error trying to update label: ${error}`);
    reply.internalServerError(JSON.stringify(error));
  }
};

