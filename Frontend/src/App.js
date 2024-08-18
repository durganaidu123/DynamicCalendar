import React from 'react';
import Calendar from '../src/pages/Calendar';
import { registerLicense } from '@syncfusion/ej2-base';

// Registering Syncfusion license key
const licenseKey = process.env.REACT_APP_SYNCFUSION_LICENSE;
registerLicense(licenseKey);

function App() {
   return (
      <div className="App">
         <Calendar />
      </div>
   );
}

export default App;
