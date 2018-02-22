import * as React from 'react';
import { IGame } from '../models/Game';

export interface IGameViewProps {
  game: IGame;
  handleKeyPress: any;
  resetGame: any;
}

export class GameView extends React.Component<IGameViewProps, {}> {
  public state: {
    letter: string;
    chosenLetters?: [string];
  };

  constructor(props: IGameViewProps) {
    super(props);
    this.state = {
      letter: '',
      chosenLetters: [] as [string]
    };

    this.handleChange = this.handleChange.bind(this);
  }

  public async handleChange(event: any) {
    this.setState({ letter: event.target.value });
    let realLetter = event.target.value;

    if (!this.isLetter(realLetter)) {
      alert('Not a valid charachter');
      return this.cleanInput();
    }

    realLetter = realLetter.toUpperCase();
    if (this.state.chosenLetters.indexOf(realLetter) !== -1) {
      alert('You already picked this letter');
      return this.cleanInput();
    }

    await this.props.handleKeyPress(realLetter);
    this.addToChosens(realLetter);

    if (this.props.game.status === 1) {
      setTimeout(() => {
        alert('Yo Won');
        this.props.resetGame();
      }, 200);
    }

    if (this.props.game.status === 2) {
      setTimeout(() => {
        alert('Yo Lost');
        this.props.resetGame();
      }, 200);
    }

    return this.cleanInput();
  }

  public cleanInput() {
    this.setState({
      letter: ''
    });
  }

  private addToChosens(letter: string) {
    if (!this.state.chosenLetters) {
      this.setState({
        chosenLetters: [letter]
      });
    } else {
      this.state.chosenLetters.push(letter);
    }
  }

  private isLetter(letter: string) {
    return letter.length === 1 && letter.match(/[a-z]/i);
  }

  public render() {
    return (
      <div className="game">
        <span className="playername">Player Name: {this.props.game.playername}</span>
        <br />
        <span className="answers">Answers: {this.props.game.answers.join(' ')}</span>
        <br />
        <span className="mistakes">Number of mistakes: {this.props.game.mistakes}</span>
        <br />
        <label>
          Enter a letter:
          <input type="text" maxLength={1} value={this.state.letter} onChange={this.handleChange} />
        </label>
        <br />
        <span className="chosenLetters">Chosen Letters: {this.state.chosenLetters.join(' ')}</span>
      </div>
    );
  }
}
