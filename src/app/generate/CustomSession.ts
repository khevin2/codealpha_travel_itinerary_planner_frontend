export type CustomSession = {
  user: {
    email: string;
    username: string;
    token: string;
  };
  expires: string;
};