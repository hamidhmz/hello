import { gameType } from '../../store/Game';
import { userType } from '../../store/User';

function join() {
  return {
    subscribe(
      parent,
      { userId },
      {
        pubsub,
        game,
        user,
      }: {
        pubsub: any;
        game: { games: gameType[] };
        user: { uuidPack: any; users: userType[] };
      }
    ) {
      const myUser = user.users.find((eachUser) => {
        return eachUser.id === userId;
      });

      if (!myUser) {
        throw new Error("user doesn't exists");
      }

      const { games } = game;
      const duplicateJoin = games.findIndex((eachGame) => {
        return (
          myUser.id === eachGame.firstPlayer ||
          myUser.id === eachGame.secondPlayer
        );
      });

      if (duplicateJoin !== -1) {
        return pubsub.asyncIterator('join' + games[duplicateJoin].id);
      }

      const yourGameIndex = games.findIndex((eachGame) => {
        return eachGame.status === 'OPEN' && myUser.id !== eachGame.firstPlayer;
      });

      if (yourGameIndex !== -1) {
        games[yourGameIndex].status = 'PLAYING';
        games[yourGameIndex].secondPlayer = userId;
        setImmediate(() => {
          pubsub.publish('join' + games[yourGameIndex].id, {
            // join can be any name
            join: games[yourGameIndex],
          });
        });
        return pubsub.asyncIterator('join' + games[yourGameIndex].id);
      }

      const yourGame: gameType = {
        id: String(games.length + 1),
        firstPlayer: userId,
        secondPlayer: null,
        firstPlayerSign: 'X',
        secondPlayerSign: 'O',
        turn: 'X',
        winner: undefined,
        board: [
          ['EMPTY', 'EMPTY', 'EMPTY'],
          ['EMPTY', 'EMPTY', 'EMPTY'],
          ['EMPTY', 'EMPTY', 'EMPTY'],
        ],
        status: 'OPEN',
      };
      games.push(yourGame);
      return pubsub.asyncIterator('join' + yourGame.id);
    },
  };
}

export default join;
