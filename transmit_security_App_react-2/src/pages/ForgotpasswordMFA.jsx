import { FormInput, SubmitBtn } from '../components';
import { Form, Link, redirect, useNavigate } from 'react-router-dom';
import { customFetch } from '../utils';
import { toast } from 'react-toastify';
import { useSDK } from './SDKProvider';
import { useState, useEffect } from "react";
import { loginUser } from "../features/user/userSlice";

export const action = (store) => async ({ request }) => {
  const formData = await request.formData();
  const data1 = Object.fromEntries(formData);
  console.log("data is:");
  console.log(data1);

  try {
    console.log("1. started login journey for register...:");
    const journeyResponse = await window.tsPlatform.ido.startJourney(
      "reset_password",
      { additionalParams: { username: data1.email } }
    );

    console.log("2. started login journey serverresp:");
    console.log(journeyResponse);

    if (journeyResponse.journeyStepId === "stepup_method_selection") {
      console.log("##inside stepup...");
      return { journeyResponse, data1 };
    }

    // Handle other steps if any
  } catch (error) {
    const errorMessage =
      error?.response?.data?.error?.message ||
      'please double check your credentials';
    toast.error(errorMessage);
    console.log(error);
    return null;
  }
};

const Forgotpassword = () => {
  const { sdkInitialized } = useSDK();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [showMfaOptions, setShowMfaOptions] = useState(false);
  const [showPasscodeEntry, setShowPasscodeEntry] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!sdkInitialized) {
      console.log("SDK not initialized");
    }
  }, [sdkInitialized]);

  const handleContinue = async () => {
    setShowMfaOptions(true);
  };

  const handleMethodClick = async (method) => {
    setSelectedMethod(method);
    setShowPasscodeEntry(true);

    const serverResp5 = await tsPlatform.ido.submitClientResponse(method);
    console.log("5.2 serverResp5");
    console.log(serverResp5);
  };

  const handlePasscodeChange = (e) => {
    setPasscode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { passcode };
    try {
      const serverResp2 = await tsPlatform.ido.submitClientResponse('client_input', { data });
      console.log('Passcode submitted successfully!', serverResp2);
      if (serverResp2.type === "journey_success") {
        const data = {
          password: 'Welcome@123',
          confirm_password: 'Welcome@123',
          username: email
        };
        const serverResp8 = await tsPlatform.ido.submitClientResponse(
          "client_input",
          { data }
        );
        console.log("8 serverResp5");
        console.log(serverResp8);
        if (serverResp8.type === "journey_success") {
          let username = email;
          const user = {
            jwt: 'eyzerer',
            user: {
              username: username,
              email: username
            }
          }
          store.dispatch(loginUser(user));
          toast.success("logged in successfully");
          navigate('/');
        } else {
          console.error("Login failed:");
        }
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
    setPasscode('');
  };

  if (!sdkInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <section className='h-screen grid place-items-center'>
      <script src="https://platform-websdk.transmitsecurity.io/platform-websdk/latest/ts-platform-websdk.js"></script>
      <Form method='POST' className='card w-96 p-8 bg-base-100 shadow-lg flex flex-col gap-y-4'>
        <h4 className='text-center text-3xl font-bold'>Forgot Password</h4>
        {!showMfaOptions && !showPasscodeEntry && (
          <>
            <FormInput type='text' label='Email' name='email' defaultValue="test1fn@yopmail.com" onChange={(e) => setEmail(e.target.value)} />
            <div className='mt-4'>
              <button type="button" onClick={handleContinue} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full">
                Continue
              </button>
            </div>
          </>
        )}
        {showMfaOptions && !showPasscodeEntry && (
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
        {showPasscodeEntry && (
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
