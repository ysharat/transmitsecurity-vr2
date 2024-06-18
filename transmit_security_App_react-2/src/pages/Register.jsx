import { FormInput, SubmitBtn } from '../components';
import { Form, Link, redirect } from 'react-router-dom';
import { customFetch } from '../utils';
import { toast } from 'react-toastify';
//import { initializeSDK } from "./sdk";
import { useSDK } from './SDKProvider';
import { useState, useEffect } from "react";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    console.log("1. started login journey for register...:");
       
        
    const journeyResponse = await window.tsPlatform.ido.startJourney(
      "register",
      {
        additionalParams: {},
      }
    );
    console.log("2. started login journey serverresp:");
    console.log(journeyResponse);
    const serverResp1 =
    await window.tsPlatform.ido.submitClientResponse(
      "client_input",
      { data }
    );
  console.log("Register Submit response:");
  console.log(serverResp1);
  if (serverResp1.type !== "journey_success") {
    throw new Error("Journey was not successful");
  }

  // if (serverResp.type !== "journey_success") {
  //   throw new Error("Journey was not successful");
  // }


    // const response = await customFetch.post('/auth/local/register', data);

    toast.success('account created successfully');
    return redirect('/login');
  } catch (error) {
    const errorMessage =
      error?.response?.data?.error?.message ||
      'please double check your credentials';
    toast.error(errorMessage);
    console.log(error)
    return null;
  }
};

const Register = () => {
  // useEffect(() => {
  //   const isInitialized = localStorage.getItem("isinitializeSDK") === "true";
  //   if (!isInitialized) {
  //     initializeSDK();
  //     localStorage.setItem("isinitializeSDK", "true");
  //   }
  // }, []);

  const { sdkInitialized } = useSDK();

  useEffect(() => {
    if (!sdkInitialized) {
      console.log("SDK not initialized");
    }
  }, [sdkInitialized]);

  if (!sdkInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <section className='h-screen grid place-items-center'>
       <script src="https://platform-websdk.transmitsecurity.io/platform-websdk/latest/ts-platform-websdk.js" ></script>
      <Form
        method='POST'
        className='card w-96 p-8 bg-base-100 shadow-lg flex flex-col gap-y-4'
      >
        <h4 className='text-center text-3xl font-bold'>Register</h4>
        {/* <FormInput type='text' label='username' name='username' />
        <FormInput type='email' label='email' name='email' />
        <FormInput type='password' label='password' name='password' /> */}
         <FormInput type='text' label='First Name' name='first_name' defaultValue="test1fn"/>
         <FormInput type='text' label='Last Name' name='last_name' defaultValue="test1ln" />
         <FormInput type='text' label='Email' name='email' defaultValue="test1fn@yopmail.com"/>
         <FormInput type='text' label='street_address' name='street_address' defaultValue="test" />
         <FormInput type='text' label='city' name='city' defaultValue="brampton"/>
         <FormInput type='text' label='state' name='state' defaultValue="On"/>
         <FormInput type='text' label='country' name='country' defaultValue="canda"/>
         <FormInput type='password' label='Password' name='password' defaultValue="Welcome@123" />
        
        <div className='mt-4'>
          <SubmitBtn text='register' />
        </div>
        <p className='text-center'>
          Already a member?
          <Link
            to='/login'
            className='ml-2 link link-hover link-primary capitalize'
          >
            login
          </Link>
        </p>
      </Form>
    </section>
  );
};
export default Register;
