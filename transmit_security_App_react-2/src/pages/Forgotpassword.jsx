// Forgotpassword.jsx
import { FormInput } from '../components';
import { Form, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSDK } from './SDKProvider';
import { useState, useEffect } from "react";
import { loginUser } from "../features/user/userSlice";

export const action = (store) => async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  console.log("data is:", data);

  try {
    const { newPassword, confirmPassword, email } = data;
    if (newPassword !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    // Submit the new password
    const serverResp = await tsPlatform.ido.submitClientResponse('client_input', {
      data: {
        password: newPassword,
        confirm_password: confirmPassword,
        username: email
      }
    });

    if (serverResp.type === "journey_success") {
      const user = {
        jwt: 'eyzerer', // You should replace this with the actual JWT token
        user: {
          username: email,
          email: email
        }
      };
      store.dispatch(loginUser(user));
      toast.success("Password reset successfully and logged in");
      return redirect('/');
    } else {
      throw new Error("Failed to reset password");
    }
  } catch (error) {
    toast.error(error.message || "Error resetting password");
    return null;
  }
};

const Forgotpassword = () => {
  const { sdkInitialized } = useSDK();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [showMfaOptions, setShowMfaOptions] = useState(false);
  const [showPasscodeEntry, setShowPasscodeEntry] = useState(false);
  const [showNewPasswordForm, setShowNewPasswordForm] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!sdkInitialized) {
      console.log("SDK not initialized");
    }
  }, [sdkInitialized]);

  const handleContinue = async () => {
    try {
      console.log("email:", email); // This should print the email
      const journeyResponse = await window.tsPlatform.ido.startJourney(
        "reset_password",
        { additionalParams: { username: email } }
      );

      console.log("Journey response:", journeyResponse);

      const serverResp21 = await tsPlatform.ido.submitClientResponse("client_input", {});
      console.log("21 serverResp5", serverResp21);

      if (serverResp21.journeyStepId === "stepup_method_selection") {
        setShowMfaOptions(true);
      } else {
        toast.error('No stepup methods available');
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.error?.message || 'Error starting the reset password journey';
      toast.error(errorMessage);
    }
  };

  const handleMethodClick = async (method) => {
    setSelectedMethod(method);
    setShowPasscodeEntry(true);

    const serverResp5 = await tsPlatform.ido.submitClientResponse(method);
    console.log("5.2 serverResp5", serverResp5);
  };

  const handlePasscodeChange = (e) => {
    setPasscode(e.target.value);
  };

  const handlePasscodeContinue = async () => {
    const data = { passcode };
    try {
      console.log("summiting passcode...")
      const serverResp2 = await tsPlatform.ido.submitClientResponse('client_input', { data });
      console.log('Passcode submitted successfully!', serverResp2);
      if (serverResp2.type === "journey_success") {
        setShowNewPasswordForm(true);
        setShowPasscodeEntry(false);
      } else {
        toast.error('Error submitting passcode');
      }
    } catch (error) {
      toast.error('Error submitting passcode');
    }
  };

  const handleCancel = () => {
    setSelectedMethod('');
    setShowMfaOptions(false);
    setShowPasscodeEntry(false);
    setShowNewPasswordForm(false);
    setPasscode('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleNewPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      const { newPassword, confirmPassword } = data;

      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const serverResp = await tsPlatform.ido.submitClientResponse('client_input', {
        data: {
          password: newPassword,
          confirm_password: confirmPassword,
          username: email
        }
      });

      if (serverResp.type === "journey_success") {
        const user = {
          jwt: 'eyzerer', // Replace this with the actual JWT token
          user: {
            username: email,
            email: email
          }
        };
        store.dispatch(loginUser(user));
        toast.success("Password reset successfully and logged in");
        navigate('/');
      } else {
        toast.error("Failed to reset password");
      }
    } catch (error) {
      toast.error(error.message || "Error resetting password");
    }
  };

  if (!sdkInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <section className='h-screen grid place-items-center'>
      <script src="https://platform-websdk.transmitsecurity.io/platform-websdk/latest/ts-platform-websdk.js"></script>
      <Form method='POST' className='card w-96 p-8 bg-base-100 shadow-lg flex flex-col gap-y-4'>
        <h4 className='text-center text-3xl font-bold'>Forgot Password</h4>
        {!showMfaOptions && !showPasscodeEntry && !showNewPasswordForm && (
          <>
            <FormInput
              type='text'
              label='Email'
              name='email'
              value={email} // Pass the email state as value
              onChange={(e) => setEmail(e.target.value)} // Update state on change
            />
            <div className='mt-4'>
              <button type="button" onClick={handleContinue} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full">
                Continue
              </button>
            </div>
          </>
        )}
        {showMfaOptions && !showPasscodeEntry && !showNewPasswordForm && (
          <div className="space-y-4">
            <button
              type="button"
              className={`btn stepup-method w-full ${selectedMethod === 'email' ? 'stepup-method-selected' : ''}`}
              onClick={() => handleMethodClick('email_otp')}
            >
              <i className="bi bi-inbox method-icon"></i>
              <span className="method-text">Get a code to your email</span>
            </button>
            <button
              type="button"
              className={`btn stepup-method w-full ${selectedMethod === 'sms' ? 'stepup-method-selected' : ''}`}
              onClick={() => handleMethodClick('sms_otp')}
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
            <button
              type="button"
              onClick={handleCancel}
              className="p-2 bg-red-500 text-white rounded hover:bg-red-600 w-full"
            >
              Cancel
            </button>
          </div>
        )}
        {showPasscodeEntry && !showNewPasswordForm && (
          <div className="space-y-4">
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
              <button onClick={handlePasscodeContinue} className="flex-1 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Continue
              </button>
              <button onClick={handleCancel} className="flex-1 p-2 bg-red-500 text-white rounded hover:bg-red-600">
                Cancel
              </button>
            </div>
          </div>
        )}
        {showNewPasswordForm && (
          <form onSubmit={handleNewPasswordSubmit} className="space-y-4">
            <FormInput
              type='password'
              label='New Password'
              name='newPassword'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <FormInput
              type='password'
              label='Confirm Password'
              name='confirmPassword'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="flex justify-between space-x-2">
              <button type="submit" className="flex-1 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Reset Password
              </button>
              <button type="button" onClick={handleCancel} className="flex-1 p-2 bg-red-500 text-white rounded hover:bg-red-600">
                Cancel
              </button>
            </div>
          </form>
        )}
        <p className='text-center'>
          Already a member?
          <Link to='/login' className='ml-2 link link-hover link-primary capitalize'>
            login
          </Link>
        </p>
      </Form>
    </section>
  );
};

export default Forgotpassword;
