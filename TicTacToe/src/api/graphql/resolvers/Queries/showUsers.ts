import { userType } from '../../store/User';

function showGames(
  parent: any,
  args: any,
  { user }: { user: { users: userType[] } }
) {
  return user.users;
}

export default showGames;
