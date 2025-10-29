import { Alchemy, Network, Utils } from "alchemy-sdk";
import { useEffect, useState } from "react";

import "./App.css";

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [transactionCount, setTransactionCount] = useState();
  const [gasPrice, setGasPrice] = useState();
  const [transactions, setTransactions] = useState();
  const [expandedTxs, setExpandedTxs] = useState({});
  const [block, setBlock] = useState([]);
  const [latestblock, setLatestBlock] = useState([]);

  function toggleTx(hash) {
    setExpandedTxs((prev) => ({
      ...prev,
      [hash]: !prev[hash],
    }));
  }
  useEffect(() => {
    async function getBlockNumber() {
      const number = await alchemy.core.getBlockNumber();
      setBlockNumber(number);
    }
    getBlockNumber();
  }, []);
  useEffect(() => {
    async function getGasFees() {
      const number = await alchemy.core.getGasPrice();
      setGasPrice(number);
    }
    getGasFees();
  }, [blockNumber]);

  useEffect(() => {
    async function getTransactions() {
      const block = await alchemy.core.getBlock(blockNumber);
      setLatestBlock(block);
      if (blockNumber !== undefined) {
        const blocksArray = [];
        for (let i = 0; i < 5; i++) {
          const blockPrev = await alchemy.core.getBlock(blockNumber - i);
          blocksArray.push(blockPrev);
        }
        setBlock(blocksArray);
        // setTransactionCount(block.transactions.length);
        // setTransactions(block.transactions);
      }
    }
    getTransactions();
  }, [blockNumber]); // Only runs when blockNumber updates

  return (
    <div>
      <div className="status-boxes">
        <div className="status-box block-number">
          Latest Block: {blockNumber}
        </div>
        {/* <div className="status-box transaction-count">
          Transaction Count: {transactionCount}
        </div> */}
        <div className="status-box gas-price">miner: {latestblock.miner}</div>
        <div className="status-box gas-price">
          Timestamp:{" "}
          {Math.floor((Date.now() - latestblock.timestamp * 1000) / 1000)} sec
          ago
        </div>
      </div>
      <div>
        <h3 className="blocks-header">Blocks:</h3>
        <ul className="blocks-list">
          {block?.map((tx) => (
            <li
              key={tx.hash}
              className="block-item"
              onMouseEnter={(e) =>
                e.currentTarget.classList.add("block-item-hover")
              }
              onMouseLeave={(e) =>
                e.currentTarget.classList.remove("block-item-hover")
              }
            >
              <p className="block-hash" onClick={() => toggleTx(tx.hash)}>
                Hash: {tx.hash}
              </p>
              {expandedTxs[tx.hash] && (
                <div className="block-details">
                  <div>
                    Timestamp: {new Date(tx.timestamp * 1000).toLocaleString()}
                  </div>
                  <div>Miner: {tx.miner}</div>
                  <div>Transactions: {tx.transactions.length}</div>
                  <div>Gas Limit: {tx.gasLimit.toString()}</div>
                  <div>Gas Used: {tx.gasUsed.toString()}</div>
                  <div>Nonce: {tx.nonce.toString()}</div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default App;
