
import { FormInput, SubmitBtn } from '../components';
import { Form, Link, redirect } from 'react-router-dom';
import { customFetch } from '../utils';
import { toast } from 'react-toastify';
//import { initializeSDK } from "./sdk";
import { useSDK } from './SDKProvider';
import { useState, useEffect } from "react";
import { loginUser } from "../features/user/userSlice";

export const action =
  (store) =>
  async ({ request }) =>{
  const formData = await request.formData();
  const data1 = Object.fromEntries(formData);
  console.log("data is:")
  console.log(data1)

  try {
    console.log("1. started login journey for register...:");
       
        
    const journeyResponse = await window.tsPlatform.ido.startJourney(
      "reset_password",
      {
        additionalParams: {username:data1.email},
      }
    );

    console.log("2. started login journey serverresp:");
    console.log(journeyResponse);

    if (journeyResponse.journeyStepId === "stepup_method_selection") 
		{
          console.log("##inside stepup...");
          const mfaSelection = prompt(
            "Select MFA method: 1. email_otp, 2. sms_otp"
          );
          let email_otp, sms_otp;

          switch (mfaSelection) {
            case "1":
              email_otp = "email_otp";
              break;
            case "2":
              sms_otp = "sms_otp";
              break;
            default:
              console.log("Invalid selection");
          }

          console.log("Selected method:");
         
          console.log(mfaSelection);
          console.log("####data")
          console.log(data1)
          console.log(email_otp);
          // let data = email_otp;

          // { username: "ysharat1@yopmail.com", "email":"ysharat1@yopmail.com" }
          const serverResp5 = await tsPlatform.ido.submitClientResponse(
            "email_otp"
          );
          console.log("5.2 serverResp5");
          console.log(serverResp5);
          console.log("5.3 end serverResp5");
          const passcode = prompt("Enter the OTP code:");
          console.log(passcode);

          const serverResp6 = await tsPlatform.ido.submitClientResponse(
            "client_input",
            {
              passcode: passcode,
            }
          );
          console.log("5.3 serverResp5");
          console.log(serverResp6);


          

          const serverResp7 = await tsPlatform.ido.submitClientResponse(
            "client_input",
            {}
          );
          console.log("5.4 serverResp5");
          console.log(serverResp7);
          
          let data= {
            password:'Sucess@1234',
            confirm_password:'Sucess@1234',
            username:'test1fn@yopmail.com'
          };
          const serverResp8 = await tsPlatform.ido.submitClientResponse(
            "client_input",
            {data}
          );
          console.log("8 serverResp5");
          console.log(serverResp8);

   
    
          
          if (serverResp8.type === "journey_success") {
            console.log("here inside 150...")
           let username = null;
           username = data1.email;

            //console.log("Login success:" + username);
            // isAuthenticated =true;
            //localStorage.setItem("isLoggedIn", "true");
            //localStorage.setItem("authtoken", accessToken);
            // loadWelcomePage(username);
			      //  return;
                  //const response = await customFetch.post("/auth/local", data);
                  const user = {
                    jwt: 'eyzerer',
                    user: {
                      username: username,
                      email: username
                    }
                  }
                store.dispatch(loginUser(user));
                toast.success("logged in successfully");
                return redirect("/");
          } else {
            // Handle login failure
            //console.error('Login failed:', serverResp.errorMessage);
            console.error("Login failed:");
			 return;
          }
         
        }

  // console.log(serverResp1);
  // if (serverResp1.type !== "journey_success") {
  //   throw new Error("Journey was not successful");
  // }

  // if (serverResp.type !== "journey_success") {
  //   throw new Error("Journey was not successful");
  // }


    // const response = await customFetch.post('/auth/local/register', data);

    // toast.success('account created successfully');
    // return redirect('/login');
  } catch (error) {
    const errorMessage =
      error?.response?.data?.error?.message ||
      'please double check your credentials';
    toast.error(errorMessage);
    console.log(error)
    return null;
  }
};

const Forgotpassword = () => {
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
        <h4 className='text-center text-3xl font-bold'>Forgot Password</h4>
        {/* <FormInput type='text' label='username' name='username' />
        <FormInput type='email' label='email' name='email' />
        <FormInput type='password' label='password' name='password' /> */}
         
         <FormInput type='text' label='Email' name='email' defaultValue="test1fn@yopmail.com"/>
        
        <div className='mt-4'>
          <SubmitBtn text='continue' />
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
export default Forgotpassword;

