import * as React from 'react';
import { IGame } from '../models/Game';

export class NewGame extends React.Component<{ handleSubmit: any }, {}> {
  public state: {
    playername: string;
  };

  constructor(props: { handleSubmit: any }) {
    super(props);
    this.state = {
      playername: ''
    };

    this.handleChange = this.handleChange.bind(this);
  }

  private handleChange(event: any) {
    this.setState({ playername: event.target.value });
  }

  public render() {
    return (
      <form onSubmit={() => this.props.handleSubmit(this.state.playername)}>
        <label>
          PlayerName:
          <input type="text" value={this.state.playername} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
