import RootChain from '@omisego/omg-js-rootchain';
import ChildChain from '@omisego/omg-js-childchain';
import Web3 from 'web3';

import config from './config';

let web3;
if (window.ethereum) {
  web3 = new Web3(window.ethereum);
  window.ethereum.enable()
    .catch(e => console.warn(e));
} else if (window.web3) {
  web3 = new Web3(window.web3.currentProvider);
}

export default {
  web3,
  rootChain: new RootChain(web3, config.PLASMA_CONTRACT_ADDRESS),
  childChain: new ChildChain(config.WATCHER_URL)
};