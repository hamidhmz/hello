import { gameType } from '../../store/Game';
import { userType } from '../../store/User';

function firstPlayer(
  parent: gameType,
  args: any,
  { user }: { user: { users: userType[] } }
) {
  return user.users.find((eachUser) => {
    return eachUser.id === parent.firstPlayer;
  });
}

function secondPlayer(
  parent: gameType,
  args: any,
  { user }: { user: { users: userType[] } }
) {
  return user.users.find((eachUser) => {
    return eachUser.id === parent.secondPlayer;
  });
}

export { firstPlayer, secondPlayer };
