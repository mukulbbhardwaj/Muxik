import React, { createContext, useState, useContext } from 'react';
import BackEndService from '../services/BackEndService'; // Update the path to your axios instance

const RegisterContext = createContext();

export function useRegisterContext() {
  return useContext(RegisterContext);
}

export function RegisterProvider({ children }) {
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null); 
  const [emailSentTo, setEmailSentTo] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const registerUser = async (userData) => {
    try {
      const response = await BackEndService.post('/register', userData);
      const user = response.data;
      setUserDetails(user);
      console.log('User registered:', user);
      setEmailSentTo(user?.otpStatus)
      console.log(user?.otpStatus)
      setError(null); 
      setErrorUserExists(false); 
    } catch (error) {
      console.error('Error registering user:', error?.response?.data?.message);
      setError(error?.response?.data?.message || 'An error occurred during registration. Please try again later.');

    }
  };

  const verifyUser = async (email, verificationCode) => {
    setVerifyLoading(true); 
    try {
      const queryParam = `?email=${email}&verificationCode=${verificationCode}`;
      const response = await BackEndService.post('/verify-register' + queryParam);
      console.log('Verification response:', response.data);

      if (response.data && response.data.isVerified) {
        console.log('User verified successfully');
        setUserDetails((prevUser) => ({
          ...prevUser,
          isVerified: true,
        }));
      } else {
        console.log('User verification failed');
        setError("User verification failed");
      }
    } catch (error) {
      console.error('Error verifying user:', error);
      setError(error?.data?.message || 'An error occurred during verifying user.');
    } finally {
      setVerifyLoading(false); 
    }
  };

  return (
    <RegisterContext.Provider
      value={{ userDetails, registerUser, verifyUser, error,  emailSentTo, verifyLoading }} 
    >
      {children}
    </RegisterContext.Provider>
  );
}
