import * as React from 'react';
import { IGame } from '../models/Game';

export interface IGameViewProps {
  game: IGame;
}

export class GameView extends React.Component<IGameViewProps, {}> {
  public render() {
    return (
      <div className="game">
        <span className="playername">Player Name: {this.props.game.playername}</span>
      </div>
    );
  }
}
