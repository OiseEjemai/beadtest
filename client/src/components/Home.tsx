import '../index.css'
import React, { useEffect, useState } from 'react';
import TVSubscriptionForm from './TvSubscriptionForm';
import { TonWalletProvider } from '../TonWalletProvider';
import ElectricityForm from './ElectricityForm';
import axios from 'axios';
import MoreModal from '../MoreModal';
import DataBundleForm from './DataBundleForm';
import AirtModal from '../Modal';
import TransactionList from '../TransactionList';
import Modal from 'react-modal';
import TonWeb from 'tonweb';
import feather from 'feather-icons';
import { TonConnectButton, useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';

const tonweb = new TonWeb(new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC'));

const Home: React.FC = () => {
  const [deposit, setDeposit] = useState('');

  const [tonConnectUI, setOptions] = useTonConnectUI();
  const [isLightModalOpen, setIsLightModalOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isSecondModalOpen, setSecondModalOpen] = useState(false);
  const [isAirtimeFormOpen, setIsAirtimeFormOpen] = useState(false);
  const [isMoreModalOpen, setMoreModalOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const address = useTonAddress(); // Hook to get the user's friendly address
  const [userBalance, setUserBalance] = useState(null);
  const [usdBalance, setUsdBalance] = useState(null);
  const userFriendlyAddress = useTonAddress();

  useEffect(() => {
    feather.replace();
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL}/balance`);
        setDeposit(response.data.balance);
      } catch (error) {
        console.error('Error fetching balance', error);
      }
    };
    fetchBalance();
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      if (address) {
        try {
          const balanceResult = await tonweb.provider.getBalance(address);
          const tonBalance = tonweb.utils.fromNano(balanceResult);
          setBalance(tonBalance);

          // Fetch TON to USD exchange rate
          const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd');
          const exchangeRate = response.data['the-open-network'].usd;
          setUsdBalance(tonBalance * exchangeRate);
        } catch (error) {
          console.error('Failed to fetch balance or exchange rate:', error);
        }
      }
    };

    fetchBalance();
  }, [address]);

  return (
    <div>
      <div className="bg-gray-800 min-h-screen flex flex-col text-white">
        {/* Main Section */}
        <section className="container mx-auto px-4 py-6 flex-grow">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-2xl font-semibold text-white">Balance:</h1>
            <TonConnectButton className='pt-4' />
          </div>

          {/* Menu Control */}
          <div className='place-content-center grid'>
          <ul className="grid grid-cols-3 sm:grid-cols-6 gap-4 mb-12 justify-center">
            <li key="Send" className="flex flex-col items-center">
              <a href="/send" className="text-center text-gray-500 hover:text-gray-700 transition">
                <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full shadow-md mb-2">
                  <img src="/send.svg" alt="" />
                </div>
                <span className="text-xs sm:text-base">Send TON</span>
              </a>
            </li>
            <li key="Receive" className="flex flex-col items-center">
              <a href="/receive" className="text-center text-gray-500 hover:text-gray-700 transition">
                <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full shadow-md mb-2">
                  <img src="/dollar-sign.svg" alt="" />
                </div>
                <span className="text-xs sm:text-base">Receive TON</span>
              </a>
            </li>
            <li key="Buy Airtime" className="flex flex-col items-center">
              <a href="/airtime" className="text-center text-gray-500 hover:text-gray-700 transition">
                <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full shadow-md mb-2">
                  <img src="/smartphone.svg" alt="" />
                </div>
                <span className="text-xs sm:text-base">Buy Airtime</span>
              </a>
            </li>
            {/* <li key="Electricity Bill" className="flex flex-col items-center">
              <a href="/light-bill" className="text-center text-gray-500 hover:text-gray-700 transition">
                <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full shadow-md mb-2">
                  <img src="/zap.svg" alt="" />
                </div>
                <span className="text-xs sm:text-base">Electricity Bill</span>
              </a>
            </li> */}
            <li key="TV Subscription" className="flex flex-col items-center">
              <a href="/buy-data" className="text-center text-gray-500 hover:text-gray-700 transition">
                <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full shadow-md mb-2">
                  <img src="/wifi.svg" alt="" />
                </div>
                <span className="text-xs sm:text-base">Buy Data</span>
              </a>
            </li>
            <li key="More" className="flex flex-col items-center">
              <a href="/more" className="text-center text-gray-500 hover:text-gray-700 transition">
                <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full shadow-md mb-2">
                  <img src="/more-horizontal.svg" alt="" />
                </div>
                <span className="text-xs sm:text-base">Pay Bills</span>
              </a>
            </li>
          </ul>
          </div>

          {/* Transactions */}
          <div className='flex flex-col items-center justify-center flex-wrap'>
            <div className="bg-gray-700 p-4 shadow-md rounded-lg w-full max-w-lg md:max-w-2xl lg:max-w-4xl">
              <div className="flex justify-between items-center py-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Dollars</h3>
                  {address ? (
                    <>
                      <p className="text-white mt-2">{balance !== null ? `${balance} TON` : 'Fetching balance...'}</p>
                    </>
                  ) : (
                    <p className="text-white mt-2">Connecting to wallet...</p>
                  )}
                </div>
                <div className="text-right">
                  {address ? (
                    <>
                      <h3 className="text-lg font-semibold text-white">{usdBalance !== null ? `$${usdBalance.toFixed(2)}` : 'Fetching USD balance...'}</h3>
                    </>
                  ) : (
                    <p className="text-gray-500 mt-2">Connecting to wallet...</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col gap-1 p-2 font-sans text-base font-normal text-white">
              <a href="/transactions" className="text-initial">
                <div role="button"
                  className="flex items-center p-3 leading-tight transition-all w-full rounded-lg outline-none text-start bg-gray-700 hover:bg-gray-200 hover:bg-opacity-80 hover:text-gray-900 focus:bg-gray-50 focus:bg-opacity-80 focus:text-gray-900 active:bg-gray-50 active:bg-opacity-80 active:text-gray-900">
                  <i data-feather="list" className="text-white m-4 text-2xl"></i>
                  Transaction History
                </div>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
