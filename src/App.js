import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './redux';
import SignInSignUpPage from './components/SignIn';
import Footer from './components/Footer';
import Trading from './components/TradingPage';
import Checkout from './components/PremiumPayment';
import NavB from './components/NavBar';
import MyScreenshots from './components/Screenshots';
import HomePage from './components/HomePage';
import Pricing from './components/Pricing';
import PleaseConfirmEmail from './components/ServicePage/emailConfirm';
import RequestResetPasswordPage from './components/ServicePage/askResetPassword';
import ResetPasswordPage from './components/ServicePage/resetPassword';
import ReferralPage from './components/UserMenu/ReferalProgram';
import ProfileSettings from './components/UserMenu/ProfileSettings';
import { resetMsg } from './redux/userActions';
import { Toast, Alert } from 'react-bootstrap';
import TermsOfService from './components/ServicePage/termsOfService';
import PrivacyPolicy from './components/ServicePage/privacyPolicy';
import VotingBlogPage from './components/Voting';
import ReactGA from 'react-ga';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

const MainApp = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.data.theme);
  const msg = useSelector((state) => state.user.msg);
  const isMobile = useSelector(state => state.user.isMobile);
  const [show, setShow] = useState(false);

  useEffect(() => {
    ReactGA.initialize('G-WC3KHWNHNL');
    ReactGA.pageview(location.pathname + location.search);
  }, [location]);

  useEffect(() => {
    if (msg) {
      setShow(true);
      const timer = setTimeout(() => {
        dispatch(resetMsg());
        setShow(false);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [msg, dispatch]);

  return (
    <>
      <NavB />
        {show && (
          <Toast style={{ zIndex: 9999, position: 'fixed', top: 0, left: '50%', transform: 'translate(-50%, 0)' }} onClose={() => setShow(false)} show={show} delay={7000} autohide>
            <Toast.Header>
              <strong className="mr-auto">Info:</strong>
            </Toast.Header>
            <Toast.Body><Alert variant='info'>{msg}</Alert></Toast.Body>
          </Toast>
        )}
      <div style={{ backgroundColor: theme === 'dark' ? 'rgb(37, 36, 36)' : 'rgb(237, 236, 236)', color: theme === 'dark' ? 'white' : 'black', minHeight: '100vh' }}>
        <Routes>
          <Route path="/login" element={<SignInSignUpPage />} />
          <Route path="/trading" element={<Trading />} />
          <Route path="/screenshots" element={<MyScreenshots />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/support" element={<ProfileSettings />} />
          <Route path="/profile_settings" element={<ProfileSettings />} />
          <Route path="/blog" element={<VotingBlogPage />} />
          <Route path="/billing_settings" element={<ProfileSettings />} />
          <Route path="/referal_program" element={<ReferralPage />} />
          <Route path="/terms_of_service" element={<TermsOfService />} />
          <Route path="/privacy_policy" element={<PrivacyPolicy />} />
          <Route path="/email_confirmation" element={<PleaseConfirmEmail />} />
          <Route path="/req_reset_password" element={<RequestResetPasswordPage />} />
          <Route path="/reset_password" element={<ResetPasswordPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
      {!isMobile && <Footer />}
    </>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <MainApp />
      </Router>
    </Provider>
  );
}

export default App;
