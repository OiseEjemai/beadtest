import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import TransactionList from './TransactionList';
import OtherPage from './OtherPage';
import AirtimePurchase from './AirtimePurchase';
import TVSubscription from './TVSubscription';
import LightPayment from './LightPayment';
import DataBundleForm from './components/DataBundleForm';
import More from './More';
import SendTon from './SendTon';
import Receive from './components/Receive';
import LoadingAnimation from './LoadingAnimation';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <LoadingAnimation>
              <Home />
            </LoadingAnimation>
          } 
        />
        <Route path="/other" element={<OtherPage />} />
        <Route path='/buy-data' element={<DataBundleForm isOpen={true} onClose={() => {}} />} />
        <Route path='/more' element={<More />} />
        <Route path='/transactions' element={<TransactionList />} />
        <Route path='/send' element={<SendTon />} />
        <Route path='/light-bill' element={<LightPayment/>} />
        <Route path='/airtime' element={<AirtimePurchase/>} />
        <Route path='/tv-subscribe' element={<TVSubscription/>} />
        <Route path='/receive' element={<Receive />} />
      </Routes>
    </Router>
  );
};

export default App;
