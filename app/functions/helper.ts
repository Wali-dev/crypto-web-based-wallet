import { Keypair } from "@solana/web3.js";
import { generateMnemonic, mnemonicToSeed } from "bip39"
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import { Wallet, HDNodeWallet } from "ethers";
import bs58 from "bs58";

export function generateMnemonicFunction() {
    return generateMnemonic();
}

export function storeSeed(seed: string) {
    const encoded = bs58.encode(Buffer.from(seed, "utf-8"));
    localStorage.setItem("seed", encoded);
}

export function getSeed() {
    const encoded = localStorage.getItem("seed");

    if (!encoded) return null;

    try {
        return Buffer.from(bs58.decode(encoded)).toString("utf-8");
    } catch {
        return null;
    }
}

export function deleteSeed() {
    localStorage.removeItem('seed')
}

export async function solanaKeyCreation(seed: string, index: number) {
    try {
        const mnemonicSeed = await mnemonicToSeed(seed);

        const path = `m/44'/501'/${index}'/0'`;
        const derivedSeed = derivePath(
            path,
            mnemonicSeed.toString("hex")
        ).key;

        const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;

        return Keypair.fromSecretKey(secret);
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function ethKyeCreation(seed: string, index: number) {

    try {
        const mnemonicSeed = await mnemonicToSeed(seed);
        const path = `m/44'/60'/${index}'/0'`;
        const hdNode = HDNodeWallet.fromSeed(mnemonicSeed);
        const child = hdNode.derivePath(path);
        const privateKey = child.privateKey;
        const wallet = new Wallet(privateKey);

        return wallet;
    } catch (error) {
        console.error(error)
    }

}

export async function checkSolBalanceCall(address: string) {
    try {
        const res: any = await fetch("https://solana-mainnet.g.alchemy.com/v2/vdjNanR3Ad6ejtrSgfWu6", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: "getBalance",
                params: [
                    `${address}`
                ],
            }),
        });
        return res.json()
    } catch (error) {
        console.error(error)
    }
}

export async function checkEthBalanceCall(address: string) {
    try {
        const res = await fetch(
            "https://eth-mainnet.g.alchemy.com/v2/vdjNanR3Ad6ejtrSgfWu6",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: 1,
                    jsonrpc: "2.0",
                    method: "eth_getBalance",
                    params: [address, "latest"],
                }),
            }
        );

        return res.json()
    } catch (error) {
        console.error(error)
    }
}