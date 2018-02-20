import * as React from 'react';
import * as showdown from 'showdown';
import { IGame } from '../models/game'

export interface IGameViewProps {
    game: IGame
}

export class GameView extends React.Component {
public state: IGameViewProps;
    
  constructor(props: IGameViewProps) {
        
    super(props);
    this.state = {
        game: props.game
    }
  }

  public render() {
    return (
      <div className="game">
        <span className="playername">Player Name: {this.state.game.playername}</span>
      </div>
    );
  }
}
