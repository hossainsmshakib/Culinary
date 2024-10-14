export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin?: boolean;
}

export interface UserCredentials {
  username: string;
  password: string;
}
