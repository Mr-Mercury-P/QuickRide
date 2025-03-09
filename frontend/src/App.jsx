import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Bookings from './components/Bookings';
import Cars from './components/Cars';
import Home from './components/Home';
import Login from './components/Login';
import Navigation from './components/Navigation';
import Register from './components/Register';
import RentCar from './components/RentCar';
import RentMyCar from './components/RentMyCar';
import { AuthProvider } from './context/AuthContext';

const stripePromise = loadStripe("pk_test_51MOH8zSB0s2EMORR1S7r29neT4EL162r7P5EmVbS71UAcHp55KqfBGfT0b5JbJdHKUuLlhlcNtfvO7mLOLb9lmQW00OSfFmdcL");

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <Navigation/>
          <Routes>
            <Route path="/my-cars" element={<Bookings />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/rent-my-car" element={<RentMyCar/>} />
            <Route path='/rent-a-car' element={
              <Elements stripe={stripePromise}>
                <RentCar/>
              </Elements>
            }/>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
