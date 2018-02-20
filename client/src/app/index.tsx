import 'babel-polyfill';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter as Router, Link, Route } from 'react-router-dom';

import { Index } from './components/Index';

import GameService from './services/GameService';

const gameService = new GameService();

const renderIndex = (props: any) => {
  return <Index gameService={gameService} {...props} />;
};

ReactDOM.render(
  <Router>
    <div className="hangman-body">
      <Route path={'/'} render={renderIndex} />
    </div>
  </Router>,
  document.getElementById('app')
);
