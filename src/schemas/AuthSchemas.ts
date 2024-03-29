export interface IUserLoginRequestBody {
  username: string;
  password: string;
}
export interface IUserLoginResponseSuccessful {
  accessToken: string;
}
export interface IUserLoginResponseError {
  status: number;
  message: string;
}

export interface IUserRegisterRequestBody {
  id?: number;
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNo: string;
  address: string;
}
export interface IUserID {
  id: number;
}
export interface IUserRegisterResponseSucessful {
  message: string;
}
export interface IUserRegisterResponseError {
  status: number;
  message: string;
}
