import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from 'containers/home/Home';
import Game from 'containers/game/Game';
import Private from 'containers/private/Private';

const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route
          exact
          path='/'
          component={Home}
        />
        <Route
          path='/game/:id'
          component={Game}
        />
        <Route
          exact
          path='/private-game'
          component={Private}
        />
      </Switch>
    </BrowserRouter>
  )
}

export default Router;
