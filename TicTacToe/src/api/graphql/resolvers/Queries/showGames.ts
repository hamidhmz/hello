import { gameType } from '../../store/Game';

function showGames(
  parent: any,
  args: any,
  { game }: { game: { games: gameType[] } }
) {
  return game.games;
}

export default showGames;
