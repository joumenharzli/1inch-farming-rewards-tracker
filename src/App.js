import React, { useEffect, useState } from "react";
import "./styles.css";

const pools = {
  "1INCH_ETH": "0x9070832CF729A5150BB26825c2927e7D343EabD9"
};

export default function App({ web3 }) {
  const [isWalletConnected, setWalletConnected] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedPool, setSelectedPool] = useState("1INCH_ETH");
  const [results, setResults] = useState({});

  useEffect(() => {
    async function getAccounts() {
      const accounts = await web3.eth.getAccounts();
      if (accounts) {
        setSelectedAccount(accounts[0]);
        setWalletConnected(true);
      } else {
        setSelectedAccount("");
        setWalletConnected(false);
      }
    }
    getAccounts();
  }, [web3]);

  useEffect(() => {
    async function getData() {
      const abi = await fetch(
        "abis/" + selectedPool + ".json"
      ).then((response) => response.json());
      const contract = new web3.eth.Contract(abi, pools[selectedPool]);
      const balance = await contract.methods.balanceOf(selectedAccount).call();
      const earned = await contract.methods.earned(selectedAccount).call();
      const rewardPerToken = await contract.methods.rewardPerToken().call();
      const lastUpdateTime = await contract.methods.lastUpdateTime().call();
      const rewardRate = await contract.methods.rewardRate().call();

      setResults({
        earned: toDecimal(earned),
        rewardPerToken: toDecimal(rewardPerToken),
        rewardRate: toDecimal(rewardRate),
        lastUpdateTime: toDate(lastUpdateTime).toUTCString(),
        balance: toDecimal(balance)
      });
    }

    if (selectedAccount && selectedPool) getData();
  }, [web3, selectedAccount, selectedPool]);

  function requestAccounts() {
    web3.eth.requestAccounts();
  }

  function toDecimal(ethNumber) {
    return ethNumber / 1.0e18;
  }

  function toDate(ethDate) {
    return new Date(ethDate * 1000);
  }

  return (
    <article>
      {isWalletConnected ? (
        <button onClick={requestAccounts}>{selectedAccount}</button>
      ) : (
        <button onClick={requestAccounts}>Connet wallet</button>
      )}
      <header>
        <img
          src="https://duneanalytics.com/projects/pages/1inch/1inch.svg"
          alt="inch logo"
        />
      </header>
      <section>
        <div class="field">
          <label>Holder: </label>
          <input type="text" value={selectedAccount} />
        </div>
        <div class="field">
          <label>Pool: </label>
          <select>
            {Object.keys(pools).map((name) => (
              <option value={pools[name]} key={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <hr />
        {isWalletConnected && selectedPool && (
          <div>
            <div class="field">
              <label>
                Balance: {results.balance} LP_{selectedPool}
              </label>
            </div>
            <div class="field">
              <label>Earned tokens: {results.earned} 1INCH</label>
            </div>
            <div class="field">
              <label>
                Reward Per Token: {results.rewardPerToken} 1INCH/Token
              </label>
            </div>
            <div class="field">
              <label>Reward Rate: {results.rewardRate * 100} %</label>
            </div>
            <div class="field">
              <label>Last update: {results.lastUpdateTime}</label>
            </div>
          </div>
        )}
      </section>
    </article>
  );
}
