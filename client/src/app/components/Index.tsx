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
    await this.props.gameService.play(letter, this.state.game.id)
    this.setState({
      game: this.props.gameService.game,
    });
  }

  private resetGame = () =>{
    this.setState({
      gameIsThere: false
    });
  }

  public render() {
    return (
      <div className="game">
        {this.state.gameIsThere && <GameView game={this.state.game} handleKeyPress={this.processLetter} resetGame={this.resetGame} />}
        {!this.state.gameIsThere && <NewGame handleSubmit={this.handleSubmit} />}
      </div>
    );
  }
}
