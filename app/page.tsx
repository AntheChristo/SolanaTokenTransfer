'use client';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js'; // Import the necessary Solana SDK components

function Home() {
    const [walletAddress, setWalletAddress] = useState(null);
    const [solBalance, setSolBalance] = useState(0); // State for Sol balance
    const [recipientAddress, setRecipientAddress] = useState(''); // State for recipient address input
    const [amountToSend, setAmountToSend] = useState(''); // State for amount to send input
    const [adapter, setAdapter] = useState(null); // State for storing the wallet adapter instance

    // Logic for connecting to the Phantom wallet
      const connectWallet = async () => {
        if (!adapter) {
            const newAdapter = new PhantomWalletAdapter();
            try {
                await newAdapter.connect();
                setAdapter(newAdapter); // Store the adapter instance in state
                const publicKey = newAdapter.publicKey;
                console.log('Wallet connected:', publicKey);
                setWalletAddress(publicKey ? publicKey.toString() : null);
            } catch (error) {
                console.error('Error connecting to the Phantom Wallet:', error);
            }
        }
    };
    // Logic for disconnecting from the wallet
    const disconnectWallet = () => {
        setWalletAddress(null);
        setSolBalance(0); // Reset balance on disconnect    
    };

    // Function to format the wallet address
    const formatAddress = (address) => {
        return address ? `${address.substring(0, 3)}...${address.substring(address.length - 3)}` : '';
    };

    // Function to fetch Sol balance
    const fetchSolBalance = async (walletAddress) => {
        try {
            const connection = new Connection('https://api.devnet.solana.com'); // Example connection to Solana Mainnet, adjust as needed
            console.log('Fetching balance for wallet:', walletAddress);
            const publicKey = new PublicKey(walletAddress);
            const balance = await connection.getBalance(publicKey);
            console.log('Fetched balance:', balance);
            setSolBalance(balance / 10 ** 9); // Convert lamports to SOL
        } catch (error) {
            console.error('Error fetching Sol balance:', error);
        }
    };
// Function to handle sending SOL
const handleSendSol = async () => {
    // Ensure there's a wallet address and the adapter is available and connected
    if (!walletAddress || !adapter || !adapter.connected) {
        console.error('Please connect your wallet first.');
        return;
    }

    try {
        // No need to reconnect the adapter; it should already be connected and stored in state

        const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
        const recipientPublicKey = new PublicKey(recipientAddress); // Convert the recipient address to a PublicKey
        const senderPublicKey = new PublicKey(walletAddress); // Convert the sender (wallet) address to a PublicKey
        const amountLamports = Number(amountToSend) * 10 ** 9; // Convert SOL to lamports for the transaction amount

        // Create a new transaction
        let transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: senderPublicKey,
                toPubkey: recipientPublicKey,
                lamports: amountLamports,
            })
        );

        // Set transaction's fee payer and recent blockhash
        transaction.feePayer = senderPublicKey;
        let {blockhash} = await connection.getRecentBlockhash();
        transaction.recentBlockhash = blockhash;

        // Sign the transaction using the Phantom Wallet adapter
        const signedTransaction = await adapter.signTransaction(transaction);

        // Send the signed transaction to the Solana blockchain
        const signature = await connection.sendRawTransaction(signedTransaction.serialize());

        console.log('Transaction successful with signature:', signature);

        // Optionally, confirm the transaction
        await connection.confirmTransaction(signature, 'confirmed');

        console.log('Transaction confirmed');
    } catch (error) {
        console.error('Error during the transaction:', error);
    }
};
    useEffect(() => {
        if (walletAddress) {
            fetchSolBalance(walletAddress);
        }
    }, [walletAddress]);

    return (
        <>
            <Head>
                <title>Transfer Solana Tokens</title>
                <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap" rel="stylesheet" />
            </Head>
            <div className="bg-gray-900 text-gray-300 min-h-screen flex flex-col items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-8">Transfer Solana Tokens</h1>
                </div>

                <div className="bg-black p-6 rounded-lg shadow-lg text-white max-w-md w-full">
                    <div className="mb-4">
                        <div className="mb-2">Balance: <span className="font-bold">{solBalance} SOL</span></div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="amount" className="block mb-2">Amount (in SOL) to send:</label>
                        <input id="amount" type="text" placeholder="0.01" className="w-full p-2 rounded bg-gray-700 text-white" value={amountToSend} onChange={(e) => setAmountToSend(e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="recipient" className="block mb-2">Send SOL to:</label>
                        <input id="recipient" type="text" placeholder="Recipient address" className="w-full p-2 rounded bg-gray-700 text-white" value={recipientAddress} onChange={(e) => setRecipientAddress(e.target.value)} />
                    </div>
                    <div className="text-center mt-4">
                        <button onClick={handleSendSol} className="bg-black text-white font-bold py-2 px-4 w-full rounded border-2 border-gray-500 hover:bg-gray-700 transition duration-200">Send</button>
                    </div>
                </div>

                {walletAddress && (
                    <div className="absolute top-0 right-0 m-4 flex items-center">
                        <div className="bg-black p-2 rounded border-2 border-gray-500 text-sm flex items-center">
                            <img src="/phantom-logo.svg" alt="Phantom Logo" width={24} height={24} />
                            <span className="ml-2">{formatAddress(walletAddress)}</span>
                        </div>
                        <button onClick={disconnectWallet} className="ml-2 bg-black text-white font-bold py-2 px-4 rounded border-2 border-gray-500 transition duration-200">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" width="24" height="24">
                                <path fillRule="evenodd" clipRule="evenodd" d="M5 2h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm4 9V8l-5 4 5 4v-3h6v-2H9z"></path>
                            </svg>
                        </button>
                    </div>
                )}

                {!walletAddress && (
                    <div className="absolute top-0 right-0 m-4">
                        <button onClick={connectWallet} className="bg-black text-white font-bold py-2 px-4 rounded border-2 border-gray-500 hover:bg-gray-700 transition duration-200">
                            Connect Wallet
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

export default Home;
