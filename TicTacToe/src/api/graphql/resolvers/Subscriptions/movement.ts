import { gameType } from '../../store/Game';

function movement() {
  return {
    subscribe(
      parent,
      { gameId }: { gameId: string },
      { pubsub, game }: { pubsub: any; game: { games: gameType[] } }
    ) {
      return pubsub.asyncIterator('movement' + gameId);
    },
  };
}

export default movement;
