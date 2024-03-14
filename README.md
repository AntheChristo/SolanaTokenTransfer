# SolanaTokenTransfer
This project is a simple web application built with React that allows users to connect their Phantom Wallet and transfer Solana (SOL) tokens to another account. 
It demonstrates the integration with the Solana blockchain using the `@solana/web3.js` library and interacts with Phantom Wallet through the `@solana/wallet-adapter-wallets`. 
This app runs on the Solana Devnet, making it a great tool for testing and learning about Solana blockchain transactions.

## Features

- Connect to the Phantom Wallet directly from the web interface.
- Display the connected wallet's SOL balance.
- Send SOL to another Solana account by specifying the recipient's address and the amount to send.
- Update the wallet's SOL balance upon successful transactions.

## Technology Stack

- **React**: For building the user interface.
- **Next.js**: Used for server-side rendering and generating static websites.
- **Solana Web3.js**: For interacting with the Solana blockchain.
- **Phantom Wallet Adapter**: For wallet connection and transaction signing.

## Running the Project

1. **Clone the Repository**

git clone <https://github.com/AntheChristo/SolanaTokenTransfer.git>

2. **Install Dependencies**

Navigate to the project directory and install the required dependencies:

cd solana-token-transfer-app
npm install

3. **Run the Development Server**

npm run dev

This will start the development server on http://localhost:3000.

## Usage

- Open the application in your web browser.
- Click on the "Connect Wallet" button to connect your Phantom Wallet.
- Once connected, your SOL balance will be displayed.
- To send SOL, enter the recipient's address and the amount of SOL you want to send in the respective fields, then click the "Send" button.
- Confirm the transaction in your Phantom Wallet.

## Contributing

Contributions are welcome! Please feel free to submit a pull request with any improvements, bug fixes, or additional features.

## License

This project is open-sourced under the MIT License. See the LICENSE file for more information.







