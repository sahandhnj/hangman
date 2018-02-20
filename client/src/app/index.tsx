import 'babel-polyfill';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter as Router, Link, Route } from 'react-router-dom';


import { GameView } from './components/gameView';
import GameService from './services/game';
  
const gameService = new GameService();
  
const renderGameView = (props: any) => {
    return <GameView game={gameService.game} {...props} />;
};

const renderIndex = (props: any) => {
    return <div><h1>hangman</h1></div>;
};
  
gameService.createGame({playername: "sahand"}).then(() => {
    ReactDOM.render(
      <Router>
          <div className="hangman-body">
            <Route path={'/'} render={renderIndex} />
            <Route path={'/new'} render={renderGameView} />
          </div>
      </Router>,
      document.getElementById('app')
    );
  });