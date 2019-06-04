import React, { useState, useEffect } from 'react';

import network from 'util/network';
import Loading from 'containers/loading/Loading';
import NoMetaMask from 'containers/nometamask/NoMetaMask';
import Router from 'containers/Router';

const App = () => {
  const [ loading, setLoading ] = useState(true);
  const [ metaMask, setMetaMask ] = useState(false);

  useEffect(() => {
    if (!!network.web3) {
      setMetaMask(true);
    }
    setTimeout(() => {
      setLoading(false)
    }, 1000);
  }, []);

  if (!loading && metaMask) return <Router />;
  if (!loading && !metaMask) return <NoMetaMask />;
  return <Loading />;
}

export default App;
