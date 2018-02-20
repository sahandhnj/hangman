export interface getAllQuery {
  gameList: Array<{
    __typename: 'Game';
    playername: string | null;
    answers: [string] | null;
    id: string | null;
  } | null> | null;
}

export interface newGameMutationVariables {
  playername: string;
}

export interface newGameMutation {
  createGame: {
    __typename: 'Game';
    playername: string | null;
    answers: [string] | null;
    id: string | null;
  } | null;
}
