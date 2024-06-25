import { TonConnect } from '@tonconnect/ui-react';

const tonConnect = new TonConnect({
  manifestUrl: 'http://localhost:5173/ton-connect.manifest.json',
  buttonSelector: '#connect-button',
});

export default tonConnect;
