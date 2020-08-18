import { v4 as uuidPack } from 'uuid';

type userType = {
  id: string;
  userToken: string;
};

const users: userType[] = [];

export { users, userType, uuidPack };
