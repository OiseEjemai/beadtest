// import '../index.css'
// import Popup from '../Popup';
// import React, { useEffect, useRef, useState } from 'react';
// import TVSubscriptionForm from './TvSubscriptionForm';

// import { TonWalletProvider } from '../TonWalletProvider';
// import DataPopupModal from '../DataPopupModal';
// import WalletBalance from '../WalletBalance.tsx';
// import ElectricityForm from './ElectricityForm';
// import axios from 'axios';
// import MoreModal from '../MoreModal';
// import DataBundleForm from './DataBundleForm';
// import AirtModal from '../Modal';
// import TransactionList from '../TransactionList';
// import Modal from 'react-modal';


// Modal.setAppElement('#root'); // Bind modal to the root element for accessibility

// import { TonClient } from '@tonclient/core';
// import AirtimePurchaseForm from './AirtimePurchaseForm';

// import { TonConnectButton, useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
// // const providerUrl = 'https://testnet.toncenter.com/api/v2/jsonRPC'; // Replace with actual provider URL if needed



// const Homepage: React.FC = () => {
//   const [deposit, setDeposit] = useState('')

//   const [tonConnectUI, setOptions] = useTonConnectUI();
//   const [isLightModalOpen, setIsLightModalOpen] = useState(false);


//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isDataModalOpen, setIsDataModalOpen] = useState(false);
//   const [isSecondModalOpen, setSecondModalOpen] = useState(false);
//   const [isAirtimeFormOpen, setIsAirtimeFormOpen] = useState(false)
//   const [isMoreModalOpen, setMoreModalOpen] = useState(false);
//   const [walletAddress, setWalletAddress] = useState(null);
//   const [balance, setBalance] = useState(null);
//   const userFriendlyAddress = useTonAddress();
//   const [isPopupVisible, setIsPopupVisible] = useState(false);

//   const openPopup = () => {
//     setIsPopupVisible(true);
//   };

//   const closePopup = () => {
//     setIsPopupVisible(false);
//   };

//   const openDataModal = () => setIsDataModalOpen(true);
//   const closeDataModal = () => setIsDataModalOpen(false);
//   const openSecondModal = () => setSecondModalOpen(true);
//   const closeSecondModal = () => setSecondModalOpen(false);
//   const openLightModal = () => setIsLightModalOpen(true);
//   const closeLightModal = () => setIsLightModalOpen(false);
//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);
//   const openAirtimeModal = () => setIsAirtimeFormOpen(true);

//   const openMoreModal = () => setMoreModalOpen(true);
//   const closeMoreModal = () => setMoreModalOpen(false);


//   const closeAirtimeModal = () => setIsAirtimeFormOpen(false);
//   const [showNewDiv, setShowNewDiv] = useState<boolean>(false);
//   const fadeTextRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleAnimationEnd = () => {
//       if (fadeTextRef.current) {
//         fadeTextRef.current.remove();
//         setShowNewDiv(true);
//       }
//     };
  
//     const fadeTextElement = fadeTextRef.current;
//     fadeTextElement?.addEventListener('animationend', handleAnimationEnd);

//     return () => {
//       fadeTextElement?.removeEventListener('animationend', handleAnimationEnd);
//     };


//   }, []);

//   useEffect(() => {
//     const fetchBalance = async () => {
//         try {
//             const response = await axios.get('http://localhost:3000/api/balance');
//             setDeposit(response.data.balance);
//         } catch (error) {
//             console.error('Error fetching balance', error);
//         }
//     };
//     fetchBalance();
// }, []);

//   // useEffect(() => {
//   //   if (userFriendlyAddress) {
//   //     const fetchBalance = async () => {
//   //       try {
//   //         const tonweb = new TonWeb(new TonWeb.HttpProvider(providerUrl));
//   //         const balance = await tonweb.getBalance(userFriendlyAddress);
//   //         setBalance(balance);
//   //       } catch (error) {
//   //         console.error('Error fetching balance:', error);
//   //       }
//   //     };

//   //     fetchBalance();
//   //   }
//   // }, [userFriendlyAddress]);



//   return (
//     <div>
//       <div className='flex flex-row h-screen justify-center items-center' ref={fadeTextRef}>
//         <h1 className="fade-out p-4 text-center text-4xl">
//           Bead Pay
//         </h1>
//       </div>
//       {showNewDiv && (
<div>
<div className=' container mx-auto flex flex-col flex-wrap justify-center items-center pt-12' id="newDiv">
  <h1 className='text-lg'>Balance</h1>
  {/* <p className='text-5xl pt-4'><span className=' text-gray-500'>$</span>0.00</p> */}
  <WalletBalance />
  {userFriendlyAddress ? (
<div>
  <p>Your Wallet Address: {userFriendlyAddress}</p>
  <p>Your Wallet Balance: {balance !== null ? `${balance / 1e9} TON` : 'Loading...'}</p>
</div>
) : (
  <p>Please connect your Ton wallet</p>
)} */}
    <TonConnectButton className='pt-4' />
  </div>
//           <div className=' container mx-auto flex flex-row flex-wrap justify-around items-center pt-12'>
//             <div className='flex flex-col flex-wrap cursor-pointer items-center justify-center w-20 h-20 mx-auto bg-white rounded-full'>
//               <button data-modal-target="authentication-modal" data-modal-toggle="authentication-modal" onClick={openModal} className='text-black text-xs'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 h-10 w-8 mx-auto text-black">
//                 <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.288Z" />
//               </svg><p className='mb-4'>Send TON</p></button>
//             </div>
//             <div className='flex flex-col flex-wrap cursor-pointer items-center justify-center w-20 h-20 mx-auto bg-white rounded-full'>
//               <button className='text-black text-xs' onClick={openLightModal}>
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 h-12 w-8 mx-auto text-black">
//                   <path d="M11.983 1.907a.75.75 0 0 0-1.292-.657l-8.5 9.5A.75.75 0 0 0 2.75 12h6.572l-1.305 6.093a.75.75 0 0 0 1.292.657l8.5-9.5A.75.75 0 0 0 17.25 8h-6.572l1.305-6.093Z" />
//                 </svg> <p className="mb-4">Buy Light</p>
//               </button>

//             </div>
//             <div className="flex flex-col flex-wrap cursor-pointer items-center justify-center w-20 h-20 mx-auto bg-white rounded-full">
//               <button className='text-black text-xs' onClick={openAirtimeModal}>
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 h-12 w-8 mx-auto text-black">
//                   <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 15.352V16.5a1.5 1.5 0 0 1-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 0 1 2.43 8.326 13.019 13.019 0 0 1 2 5V3.5Z" clipRule="evenodd" />
//                 </svg> <p className='mb-3'>Recharge Airtime</p>
//               </button>
//             </div>
//             <div className="flex flex-col flex-wrap cursor-pointer items-center justify-center w-20 h-20 mx-auto bg-white rounded-full">
//               <button className='text-black text-xs' onClick={openPopup}>
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 h-12 w-8 mx-auto text-black">
//                   <path d="M4 5h12v7H4V5Z" />
//                   <path fillRule="evenodd" d="M1 3.5A1.5 1.5 0 0 1 2.5 2h15A1.5 1.5 0 0 1 19 3.5v10a1.5 1.5 0 0 1-1.5 1.5H12v1.5h3.25a.75.75 0 0 1 0 1.5H4.75a.75.75 0 0 1 0-1.5H8V15H2.5A1.5 1.5 0 0 1 1 13.5v-10Zm16.5 0h-15v10h15v-10Z" clipRule="evenodd" />
//                 </svg> <p className="mb-4">Subscription</p>
//               </button>
//             </div>
//             {/* <div className="flex flex-col flex-wrap cursor-pointer items-center justify-center w-20 h-20 mx-auto bg-white rounded-full">
//               <button className='text-black text-xs' onClick={openDataModal}>
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 h-12 w-8 mx-auto text-black">
//                   <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
//                 </svg>
//                 <p className="mb-4">Buy data</p>
//               </button>
//             </div> */}
//             <div className="flex flex-col flex-wrap cursor-pointer items-center justify-center w-20 h-20 mx-auto bg-white rounded-full">
//               <button className='text-black text-xs' onClick={openMoreModal}>
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 h-12 w-8 mx-auto text-black">
//                   <path fillRule="evenodd" d="M4.5 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" clipRule="evenodd" />
//                 </svg>

//                 <p className="mb-4">More</p>
//               </button>
//             </div>
//           </div>
//           <Popup isOpen={isModalOpen} onClose={closeModal} />
//           <AirtModal isOpen={isAirtimeFormOpen} onClose={closeAirtimeModal}>
//             <AirtimePurchaseForm onClose={closeAirtimeModal} />
//           </AirtModal>
//           <TonWalletProvider>
//             {isPopupVisible && <TVSubscriptionForm closePopup={closePopup} />}
//               <DataBundleForm isOpen={isDataModalOpen} onClose={closeDataModal}/>
//             <MoreModal isOpen={isMoreModalOpen} onClose={closeMoreModal} onItemClick={openSecondModal}>
//               <li className="py-4 flex items-center justify-between">
//                 <a href="#" className="text-black hover:underline">Buy data</a>
//                 <button className="px-4 py-2 bg-black text-white rounded hover:bg-gray-500 focus:outline-none focus:bg-gray-500" onClick={openDataModal}>Open</button>
//               </li>
//               <li className="py-4 flex items-center justify-between">
//                 <a href="#" className="text-black hover:underline">Deposit to your betting account</a>
//                 <button className="px-4 py-2 bg-black text-white rounded hover:bg-gray-500 focus:outline-none focus:bg-gray-500">Open</button>
//               </li>
//               {/* <li className="py-4 flex items-center justify-between">
//                 <a href="#" className="text-black hover:underline">Item 3</a>
//                 <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Action</button>
//               </li> */}
//             </MoreModal>
//             <ElectricityForm isOpen={isLightModalOpen} onClose={closeLightModal} />
//           </TonWalletProvider>
//           <TransactionList />
//         </div>
//       )}
//     </div>
//   );
// };
// export default Homepage

import React from 'react';

const Home = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold underline">
        Welcome to Bead Pay!
      </h1>
      <p>Your main content goes here.</p>
    </div>
  );
};

export default Home;
