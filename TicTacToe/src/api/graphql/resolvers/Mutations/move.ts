import { boardType, gameType, signType, Cell } from '../../store/Game';
import { userType } from '../../store/User';

function move(
  parent,
  {
    gameId,
    userToken,
    cellIndex,
  }: {
    gameId: string;
    userToken: string;
    cellIndex: { arrayNumber: number; cellNumber: number };
  },
  {
    game,
    user,
    pubsub,
  }: { game: { games: gameType[] }; user: { users: userType[] }; pubsub: any }
) {
  let myUserSignInGame: signType;

  const myUserIndex = user.users.findIndex((eachUser) => {
    return eachUser.userToken === userToken;
  });

  if (myUserIndex === -1) {
    throw new Error('wrong user token');
  }

  const myGameIndex = game.games.findIndex((eachGame) => {
    return eachGame.id === String(gameId);
  });
  if (myGameIndex === -1) {
    throw new Error('wrong game id');
  }

  const myGameContent = game.games[myGameIndex];

  if (myGameContent.status !== 'PLAYING') {
    throw new Error(`game hasn't started yet or doesn't exists`);
  }

  if (myGameContent.firstPlayer === user.users[myUserIndex].id) {
    myUserSignInGame = myGameContent.firstPlayerSign;
  } else {
    myUserSignInGame = myGameContent.secondPlayerSign;
  }

  if (myGameContent.turn !== myUserSignInGame) {
    throw new Error('this is not this player turn');
  }

  if (
    cellIndex.cellNumber > 2 ||
    cellIndex.arrayNumber > 2 ||
    cellIndex.cellNumber < 0 ||
    cellIndex.arrayNumber < 0
  ) {
    throw new Error('cell number out of range');
  }

  if (
    myGameContent.board[cellIndex.arrayNumber][cellIndex.cellNumber] !== 'EMPTY'
  ) {
    throw new Error('occupied cell, pic another');
  }
  myGameContent.board[cellIndex.arrayNumber][
    cellIndex.cellNumber
  ] = myUserSignInGame;

  if (myUserSignInGame === 'O') {
    myGameContent.turn = 'X';
  } else {
    myGameContent.turn = 'O';
  }

  const gameIsEnded = checkForGameEnd(myGameContent);

  if (gameIsEnded) {
    myGameContent.status = 'EXITED';
  }

  pubsub.publish('join' + myGameContent.id, {
    // join can be any name
    join: myGameContent,
  });

  return myGameContent;
}

function checkForGameEnd(myGame: gameType) {
  const myBoard = myGame.board;
  if (conditionMakerWithWinner(myBoard, 'O')) {
    myGame.winner = 'O';
    return true;
  } else if (conditionMakerWithWinner(myBoard, 'X')) {
    myGame.winner = 'X';
    return true;
  }

  const gameIsEnded = conditionMakerWithoutWinner(myBoard);

  if (gameIsEnded) {
    myGame.winner = 'DRAW';
    return true;
  }
  return false;
}

function conditionMakerWithWinner(board: boardType, sign: signType) {
  return (
    (board[0][0] === board[0][1] &&
      board[0][1] === board[0][2] &&
      board[0][0] === sign) ||
    (board[0][0] === board[1][1] &&
      board[1][1] === board[2][2] &&
      board[0][0] === sign) ||
    (board[0][0] === board[1][0] &&
      board[1][0] === board[2][0] &&
      board[0][0] === sign) ||
    (board[0][1] === board[1][1] &&
      board[1][1] === board[2][1] &&
      board[0][1] === sign) ||
    (board[0][2] === board[1][2] &&
      board[1][2] === board[2][2] &&
      board[0][2] === sign) ||
    (board[1][0] === board[1][1] &&
      board[1][1] === board[1][2] &&
      board[1][0] === sign) ||
    (board[2][0] === board[2][1] &&
      board[2][1] === board[2][2] &&
      board[0][0] === sign)
  );
}

function conditionMakerWithoutWinner(board: boardType) {
  let emptyVal: Cell;
  for (const array of board) {
    emptyVal = array.find((cell) => {
      return cell === 'EMPTY';
    });

    if (emptyVal === 'EMPTY') {
      break;
    }
  }

  return emptyVal !== 'EMPTY';
}

export default move;
