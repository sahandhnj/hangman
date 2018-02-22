import * as React from 'react';
import { IGame } from '../models/Game';
import GameService from '../services/GameService';

import { GameView } from './GameView';
import { NewGame } from './NewGame';

export interface INewGameProps {
  gameService: any;
}

export class Index extends React.Component<INewGameProps, {}> {
  public state: {
    game: IGame;
    gameIsThere: boolean;
  };

  constructor(props: INewGameProps) {
    super(props);
    this.state = {
      game: {
        playername: ''
      },
      gameIsThere: false
    };
  }

  private handleSubmit = async (playername: string) => {
    await this.props.gameService.createGame({ playername });
    this.setState({
      game: this.props.gameService.game,
      gameIsThere: true
    });
  };

  private processLetter = async (letter: string) => {
    console.log(letter);
  }

  public render() {
    return (
      <div className="game">
        {this.state.gameIsThere && <GameView game={this.state.game} handleKeyPress={this.processLetter}  />}
        {!this.state.gameIsThere && <NewGame handleSubmit={this.handleSubmit} />}
      </div>
    );
  }
}
