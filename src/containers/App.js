import React, { useState, useEffect } from 'react';

import Loading from 'containers/loading/Loading';
import Router from 'containers/Router';

const App = () => {
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    // TODO: app boot checking, check metamask installed?
    setTimeout(() => {
      setLoading(false)
    }, 1000);
  }, []);

  return loading
    ? <Loading />
    : <Router />
}

export default App;
