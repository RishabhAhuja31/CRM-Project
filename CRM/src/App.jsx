import { Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn, SignInButton, UserButton } from '@clerk/clerk-react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Database';
import Segmentation from './pages/Segmentation';
import CampaignCreation from './pages/CampaignCreation';
import CampaignReport from './pages/CampaignReport';
import Help from './pages/Help';
import ChatBotButton from './pages/ChatBotButton';
import './index.css';  

function App() {
  return (
    <>
      <SignedOut>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
          <SignInButton />
        </div>
        {/* Or use <RedirectToSignIn /> to automatically redirect */}
        {/* <RedirectToSignIn /> */}
      </SignedOut>

      <SignedIn>
        <header style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
          <UserButton />
        </header>
        <div>
          <Navbar />
          <div style={{ marginLeft: '200px', padding: '2rem', minHeight: '100vh' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/segmentation" element={<Segmentation />} />
              <Route path="/campaign-creation" element={<CampaignCreation />} />
              <Route path="/campaign-report" element={<CampaignReport />} />
              <Route path="/help" element={<Help />} />
            </Routes>
          </div>
          <ChatBotButton />
        </div>
      </SignedIn>
    </>
  );
}

export default App;
