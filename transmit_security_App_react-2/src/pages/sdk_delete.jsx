// sdk.js
export const initializeSDK = async () => {
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
  