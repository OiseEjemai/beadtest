// TransactionList.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import feather from 'feather-icons'


const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL}/transactions`);
        setTransactions(response.data);
      } catch (error) {
        console.error('Failed to fetch transactions', error);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    feather.replace();
  }, []);

  return (
    // <div className="container mx-auto p-4">
    //   <h2 className="text-2xl font-bold mb-4">Transaction List</h2>
    //   <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
    //     <table className="w-full text-sm text-left text-white dark:text-gray-400">
    //       <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
    //         <tr>
    //           <th scope="col" className="py-3 px-4 sm:px-6">Type</th>
    //           <th scope="col" className="py-3 px-4 sm:px-6">Provider / Address</th>
    //           <th scope="col" className="py-3 px-4 sm:px-6">Phone Number</th>
    //           <th scope="col" className="py-3 px-4 sm:px-6">Amount</th>
    //           <th scope="col" className="py-3 px-4 sm:px-6">Approved</th>
    //           <th scope="col" className="py-3 px-4 sm:px-6">Date</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {transactions.map((transaction) => (
    //           <tr key={transaction._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
    //             <td className="py-3 px-4 sm:px-6">{transaction.type}</td>
    //             <td className="py-3 px-4 sm:px-6">{transaction.provider}</td>
    //             <td className="py-3 px-4 sm:px-6">{transaction.phoneNumber}</td>
    //             <td className="py-3 px-4 sm:px-6">{transaction.amount}</td>
    //             <td className="py-3 px-4 sm:px-6">{transaction.success ? 'Yes' : 'No'}</td>
    //             <td className="py-3 px-4 sm:px-6">{new Date(transaction.createdAt).toLocaleString()}</td>
    //           </tr>
    //         ))}
    //       </tbody>
    //     </table>
    //   </div>
    // </div>
    <div>
<div className="w-screen">
  
<div className="mx-auto mt-8 max-w-screen-lg px-2">
  <div className="sm:flex sm:items-center sm:justify-between flex-col sm:flex-row">
  <a href="/">
  <i data-feather="arrow-left" className="text-white m-4"></i></a>
    <p className="flex-1 text-base font-bold text-white">Transaction History</p>
  </div>

  <div className="mt-6 overflow-hidden rounded-xl border shadow">
    <table className="min-w-full border-separate border-spacing-y-2 border-spacing-x-2">
      <thead className="hidden border-b lg:table-header-group">
        <tr className="">
          <td width="50%" className="whitespace-normal py-4 text-sm font-medium text-white sm:px-6">Invoice</td>

          <td className="whitespace-normal py-4 text-sm font-medium text-white sm:px-6">Date</td>

          <td className="whitespace-normal py-4 text-sm font-medium text-white sm:px-6">Amount</td>

          <td className="whitespace-normal py-4 text-sm font-medium text-white sm:px-6">Status</td>
        </tr>
      </thead>

      <tbody className="lg:border-gray-300">
      {transactions.map((transaction) => (
        <tr key={transaction._id}>
          <td width="50%" className="whitespace-no-wrap py-4 text-sm font-bold text-white sm:px-6">
            {transaction.type}
            <div className="mt-1 lg:hidden">
              <p className="font-normal text-white">{new Date(transaction.createdAt).toLocaleString()}</p>
            </div>
          </td>

          <td className="whitespace-no-wrap hidden py-4 text-sm font-normal text-white sm:px-6 lg:table-cell">07 February, 2022</td>

          <td className="whitespace-no-wrap py-4 px-6 text-right text-sm text-gray-600 lg:text-left">
            -₦{transaction.amount}
            <div className="flex mt-1 ml-auto w-fit items-center rounded-full bg-blue-600 py-2 px-3 text-left text-xs font-medium text-white lg:hidden">{transaction.success ? 'Successful' : 'Failed'}</div>
          </td>
        </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

</div>
    </div>
  
  );
};

export default TransactionList;
