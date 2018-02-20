import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client/ApolloClient';
import { HttpLink } from 'apollo-link-http';
import gql from 'graphql-tag';
import { getAllQuery, newGameMutationVariables } from '../api';
import { IGame } from '../models/game';

export default class GameService {
  public game: IGame;
  public update = async () => {
    const data = await this.apiClient.query({
      query: gql`
        query game {
          id
          answers
          playername
          status
          mistakes
        }
      `
    });

    if (data.data) {
      this.game = data.data as IGame;
    }
  };

  public createGame = async (game: IGame) => {
    const variables: newGameMutationVariables = {
      playername: game.playername
    };

    const data = await this.apiClient.mutate({
      mutation: gql`
        mutation newGame($playername: String!) {
          createGame(playername: $playername) {
            id
            playername
            answers
          }
        }
      `,
      variables
    });

    if (data.data) {
        this.game = data.data.createGame as IGame;        
    }
  };
  private apiClient: ApolloClient<NormalizedCacheObject>;

  constructor() {
    this.apiClient = new ApolloClient({
      cache: new InMemoryCache(),
      link: new HttpLink({ uri: 'http://localhost:8080/api' })
    });
  }
}
