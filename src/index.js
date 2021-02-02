import React, { StrictMode } from "react";
import ReactDOM from "react-dom";

import App from "./App";

const rootElement = document.getElementById("root");

const Web3 = require("web3");

if (!window.ethereum) {
  ReactDOM.render(<div>Please install a web3 wallet</div>, rootElement);
} else {
  const web3 = new Web3(window.ethereum);

  renderApp(web3);
}
function renderApp(web3) {
  web3.eth.net.getId().then((id) => {
    console.log("networkid:", id);
    if (id !== 1)
      ReactDOM.render(<div>Please switch to main net</div>, rootElement);
    else
      ReactDOM.render(
        <StrictMode>
          <App web3={web3} />
        </StrictMode>,
        rootElement
      );
  });
}
