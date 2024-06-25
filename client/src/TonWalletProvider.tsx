import React, { createContext, useContext, ReactNode } from 'react';
import { TonConnectUIProvider, TonConnectUIProviderProps, useTonConnectUI } from '@tonconnect/ui-react';

// Define the type for the context
interface TonWalletContextType {
  connector: TonConnectUIProviderProps;
}

// Create the context
const TonWalletContext = createContext<TonWalletContextType | null>(null);

// Define the provider component
export const TonWalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize the connector
  const connectorProps: TonConnectUIProviderProps = {
    manifestUrl: 'http://localhost:5173/ton-connect.manifest.json', // Update with your actual manifest URL
  };

  // Pass the connector to the context value
  const contextValue: TonWalletContextType = { connector: connectorProps };

  return (
    <TonWalletContext.Provider value={contextValue}>
      <TonConnectUIProvider {...connectorProps}>
        {children}
      </TonConnectUIProvider>
    </TonWalletContext.Provider>
  );
};

// Custom hook to use the Ton wallet context
export const useTonWallet = () => {
  const context = useContext(TonWalletContext);
  if (!context) {
    throw new Error('useTonWallet must be used within a TonWalletProvider');
  }
  return context.connector;
};
