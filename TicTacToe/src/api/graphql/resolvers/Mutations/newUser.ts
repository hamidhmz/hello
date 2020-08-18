import { userType } from '../../store/User';

function newUser(
  parent,
  args,
  { user }: { user: { uuidPack: any; users: userType[] } }
) {
  user.uuidPack();
  const { users } = user;

  const newUserL: userType = {
    id: String(users.length + 1),
    userToken: user.uuidPack(),
  };

  user.users.push(newUserL);

  return newUserL;
}

export default newUser;
