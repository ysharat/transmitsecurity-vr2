import React, { createContext, useContext, useEffect, useState } from 'react';

const SDKContext = createContext();

const initializeSDK = async () => {
  try {
    console.log("SDK initializing ...");
    await window.tsPlatform.initialize({
      clientId: '246z720t5nnetdgp0xw9tbai6zf4cvtf',
      ido: {
        serverPath: `https://api.transmitsecurity.io/ido`,
        applicationId: "default_application"
      }
    });
    console.log("SDK initialized successfully!");
    return true; // Indicate successful initialization
  } catch (error) {
    console.error("Failed to initialize SDK:", error);
    return false; // Indicate failed initialization
  }
};

export const SDKProvider = ({ children }) => {
  const [sdkInitialized, setSdkInitialized] = useState(false);

  useEffect(() => {
    console.log("inside SDK provider");
    const initialize = async () => {
      const success = await initializeSDK();
      setSdkInitialized(success);
    };
    initialize();
  }, []);

  return (
    <SDKContext.Provider value={{ sdkInitialized }}>
      {children}
    </SDKContext.Provider>
  );
};

export const useSDK = () => {
  return useContext(SDKContext);
};
