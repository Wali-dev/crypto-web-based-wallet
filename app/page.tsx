"use client";

import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { deleteSeed, ethKyeCreation, generateMnemonicFunction, getSeed, solanaKeyCreation, storeSeed, checkSolBalanceCall, checkEthBalanceCall } from "./functions/helper";
import { Copy, ChevronDown, ChevronUp, Wallet, EyeIcon, EyeClosed } from "lucide-react";

export default function Home() {
  const [mnemonic, setMnemonic] = useState("");
  const [indexSol, setIndexSol] = useState(0);
  const [indexEth, setIndexEth] = useState(0);

  const [solWallet, setSolwallet] = useState<PublicKey[]>([]);
  const [ethWallet, setEthwallet] = useState<string[]>([]);


  const [showSol, setShowSol] = useState(false);
  const [showEth, setShowEth] = useState(false);

  const [showSeed, setShowSeed] = useState(false);


  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const checkSolBalance = async (address: string) => {
    try {
      const res = await checkSolBalanceCall(address);

      const balance = res.result.value / 1_000_000_000;

      alert(`SOL Balance: ${balance} SOL`);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch SOL balance");
    }
  };

  const checkEthBalance = async (address: string) => {
    try {
      const res = await checkEthBalanceCall(address);

      const balanceWei = BigInt(res.result);
      const balanceEth = Number(balanceWei) / 1e18;

      alert(`ETH Balance: ${balanceEth} ETH`);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch ETH balance");
    }
  };
  const toggleSeedVisibility = () => {
    setShowSeed(!showSeed)
  }

  const generateSeed = () => {
    const result = generateMnemonicFunction();
    setMnemonic(result);
    storeSeed(result);
  };

  useEffect(() => {
    manageSeed()
  }, [])

  const manageSeed = () => {
    const seed = getSeed()
    console.log(seed)
    if (seed) {
      setMnemonic(seed)
    }
    else generateSeed()

  }

  const resetSeed = () => {
    deleteSeed()
    setMnemonic("")
  }

  async function solanaSeed() {
    const keypair = await solanaKeyCreation(mnemonic, indexSol);
    if (keypair?.publicKey) {
      setSolwallet([...solWallet, keypair.publicKey])
    }
    setIndexSol(indexSol + 1)
  }

  async function ethSeed() {
    const keypair = await ethKyeCreation(mnemonic, indexEth);
    if (keypair?.address) {
      setEthwallet([...ethWallet, keypair.address])

    }
    setIndexEth(indexEth + 1)
  }

  return (
    <div className="mx-auto my-10">
      <div className="mx-10 mt-8 rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
        <h2 className="text-2xl font-bold mb-6">Wallet Generator</h2>

        <div className="flex flex-wrap gap-3 mb-6">
          <button
            type="button"
            onClick={generateSeed}
            className="rounded-lg bg-black px-5 py-2.5 text-white font-medium hover:bg-gray-800 transition"
          >
            Generate Seed
          </button>

          <button
            onClick={resetSeed}
            className="rounded-lg border border-red-300 px-5 py-2.5 text-red-600 font-medium hover:bg-red-50 transition"
          >
            Delete Seed
          </button>
        </div>

        <div className="rounded-xl border p-4 mb-6">
          <div className="flex align-middle justify-between">
            <div className="text-sm font-medium text-gray-500 mb-4">
              Recovery Phrase
            </div>
            <div className="hover:cursor-pointer" onClick={toggleSeedVisibility}>
              {showSeed ? <EyeIcon color="white"></EyeIcon> : <EyeClosed color="white"></EyeClosed>}
            </div>
          </div>

          <div className="rounded-xl border p-4 mb-6">



            {!mnemonic ? (
              <p className="text-sm">No seed generated yet</p>
            ) : showSeed ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {mnemonic.split(" ").map((word, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-lg border  px-3 py-2"
                  >
                    <span className="text-xs font-semibold  w-5">
                      {index + 1}.
                    </span>
                    <span className="font-mono text-sm">{word}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {mnemonic.split(" ").map((word, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-lg border  px-3 py-2"
                  >
                    <span className="text-xs font-semibold text-gray-400 w-5">
                      {index + 1}.
                    </span>
                    <span className="font-mono text-sm">
                      {"*".repeat(word.length)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={solanaSeed}
            className="rounded-lg bg-purple-600 px-5 py-2.5 text-white font-medium hover:bg-purple-700 transition"
          >
            Generate Solana Wallet
          </button>

          <button
            onClick={ethSeed}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-white font-medium hover:bg-blue-700 transition"
          >
            Generate Ethereum Wallet
          </button>
        </div>
      </div>

      <div className="mx-10 flex flex-col gap-4">
        <div className="border rounded-lg">
          <button
            className="w-full flex items-center justify-between p-3 font-medium"
            onClick={() => setShowSol(!showSol)}
          >
            <span>Solana Addresses ({solWallet.length})</span>
            {showSol ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {showSol && (
            <div className="border-t">
              {solWallet.map((w, i) => {
                const address = w.toBase58();

                return (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 p-3 border-b last:border-b-0"
                  >
                    <span className="flex-1 truncate">{address}</span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => checkSolBalance(address)}
                        className="flex items-center gap-1 px-3 py-1 text-sm border rounded hover:bg-gray-100"
                      >
                        <Wallet size={14} />
                        Balance
                      </button>

                      <button
                        onClick={() => copyToClipboard(address)}
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="border rounded-lg">
          <button
            className="w-full flex items-center justify-between p-3 font-medium"
            onClick={() => setShowEth(!showEth)}
          >
            <span>Ethereum Addresses ({ethWallet.length})</span>
            {showEth ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {showEth && (
            <div className="border-t">
              {ethWallet.map((address, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 p-3 border-b last:border-b-0"
                >
                  <span className="flex-1 truncate">{address}</span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => checkEthBalance(address)}
                      className="flex items-center gap-1 px-3 py-1 text-sm border rounded hover:bg-gray-100"
                    >
                      <Wallet size={14} />
                      Balance
                    </button>

                    <button
                      onClick={() => copyToClipboard(address)}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
