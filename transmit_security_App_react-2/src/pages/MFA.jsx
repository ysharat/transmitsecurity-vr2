import React, { useState } from 'react';

const MFA = () => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [showPasscodeEntry, setShowPasscodeEntry] = useState(false);
  const [passcode, setPasscode] = useState('');

  const handleMethodClick = (method) => {
    setSelectedMethod(method);
  };

  const handleContinue = () => {
    setShowPasscodeEntry(true);
  };

  const handlePasscodeChange = (e) => {
    setPasscode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { passcode };
    try {
      const serverResp2 = await tsPlatform.ido.submitClientResponse('client_input', { data });
      alert('Passcode submitted successfully!');
    } catch (error) {
      alert('Error submitting passcode');
    }
  };

  const handleCancel = () => {
    setSelectedMethod('');
    setShowPasscodeEntry(false);
    setPasscode('');
  };

  return (
    <div className="max-w-md mx-auto p-6 border border-gray-300 rounded-lg bg-gray-50">
      <h1 className="text-2xl font-bold text-center mb-6">Multi-Factor Authentication</h1>
      {!showPasscodeEntry ? (
        <div className="space-y-4">
          <button
            type="button"
            className={`btn stepup-method w-full ${selectedMethod === 'email' ? 'stepup-method-selected' : ''}`}
            onClick={() => handleMethodClick('email')}
          >
            <i className="bi bi-inbox method-icon"></i>
            <span className="method-text">Get a code to your email</span>
          </button>
          <button
            type="button"
            className={`btn stepup-method w-full ${selectedMethod === 'sms' ? 'stepup-method-selected' : ''}`}
            onClick={() => handleMethodClick('sms')}
          >
            <i className="bi bi-phone method-icon"></i>
            <span className="method-text">Get a code via SMS</span>
          </button>
          <button
            type="button"
            className={`btn stepup-method w-full ${selectedMethod === 'passkey' ? 'stepup-method-selected' : ''}`}
            onClick={() => handleMethodClick('passkey')}
          >
            <i className="bi bi-key method-icon"></i>
            <span className="method-text">Use a passkey</span>
          </button>
          {selectedMethod && (
            <button
              type="button"
              onClick={handleContinue}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
            >
              Continue
            </button>
          )}
          <button
            type="button"
            onClick={handleCancel}
            className="p-2 bg-red-500 text-white rounded hover:bg-red-600 w-full"
          >
            Cancel
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Enter 6-digit passcode:</label>
            <input
              type="text"
              value={passcode}
              onChange={handlePasscodeChange}
              maxLength={6}
              className="p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex justify-between space-x-2">
            <button type="submit" className="flex-1 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Submit
            </button>
            <button type="button" onClick={handleCancel} className="flex-1 p-2 bg-red-500 text-white rounded hover:bg-red-600">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MFA;
