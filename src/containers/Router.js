import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from 'containers/home/Home';
import Game from 'containers/game/Game';
import NotFound from 'containers/notfound/NotFound';

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
          exact
          path='/game/:address'
          component={Game}
        />
        <Route
          component={NotFound}
        />
      </Switch>
    </BrowserRouter>
  )
}

export default Router;
