import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import {
  loginHandler,
  registerUserHandler,
  registerHandler,
  readAllUsers,
} from '../../controllers/AuthControllers';
import {
  IUserLoginRequestBody,
  IUserLoginResponseError,
  IUserLoginResponseSuccessful,
  IUserRegisterRequestBody,
  IUserRegisterResponseError,
  IUserRegisterResponseSucessful,
} from '../../schemas/AuthSchemas';

const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post<{
    Querystring: IUserLoginRequestBody;
    Reply: IUserLoginResponseSuccessful | IUserLoginResponseError;
  }>('/login', loginHandler(fastify));

  fastify.post<{
    Querystring: IUserRegisterRequestBody;
    Reply: IUserRegisterResponseSucessful | IUserRegisterResponseError;
  }>('/createUser', registerUserHandler)
  
  fastify.post<{
    Querystring: IUserRegisterRequestBody;
    Reply: IUserRegisterResponseSucessful | IUserRegisterResponseError;
  }>('/register', registerHandler);

  fastify.get<{
    Querystring: FastifyRequest;
    Reply: FastifyReply
  }>('/', { onRequest: [fastify.authenticate] }, readAllUsers);
};

export default auth;
