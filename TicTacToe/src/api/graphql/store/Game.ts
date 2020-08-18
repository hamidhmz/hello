type Cell = 'EMPTY' | 'X' | 'O';
type signType = 'X' | 'O';
type Status = 'OPEN' | 'PLAYING' | 'EXITED';
type winnerType = 'X' | 'O' | 'DRAW';
type boardType = [[Cell, Cell, Cell], [Cell, Cell, Cell], [Cell, Cell, Cell]];

type gameType = {
  id: string;
  firstPlayer: string;
  secondPlayer: string;
  firstPlayerSign: 'X';
  secondPlayerSign: 'O';
  turn: signType;
  winner: winnerType;
  board: boardType;
  status: Status;
};

const games: gameType[] = [];

export { games, gameType, signType, boardType, Cell };
