import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client/ApolloClient';
import { HttpLink } from 'apollo-link-http';
import gql from 'graphql-tag';
import { getAllQuery, newGameMutationVariables, newGameQueryVariables } from '../api';
import { IGame } from '../models/Game';

export default class GameService {
  public game: IGame = {
    playername: 'Sahand'
  };
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

  public play = async (letter: string, id: number) => {
    const variables: newGameQueryVariables = {
      id: id.toString(),
      letter: letter
    };


    const data: any = await this.apiClient.query({
      query: gql`
        query play ($id: String, $letter: String) {
          answer (id: $id, letter: $letter) {
            id
            answers
            playername
            status
            mistakes
          }
        }`
      ,
      variables
    });

    if (data.data) {
      this.game = data.data.answer as IGame;      
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
