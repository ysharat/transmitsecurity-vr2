import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FormInput, SubmitBtn } from '../components';
import { Form, Link, redirect, useNavigate } from 'react-router-dom';
import { customFetch } from '../utils';
import { toast } from 'react-toastify';
import { loginUser } from '../features/user/userSlice';
import { useDispatch } from 'react-redux';
import { useSDK } from "./SDKProvider";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phoneno: '',
    emailverified: '',
  });

// const Profile = () => {
//   const [profileData, setProfileData] = useState({
   
//     email: ''
//   });

  const [initialFetchDone, setInitialFetchDone] = useState(false); // State to track initial fetch

  useEffect(() => {
    // Fetch profile data only if initialFetchDone is false
    if (!initialFetchDone) {
      fetchProfileData();
      setInitialFetchDone(true); // Mark initial fetch as done
    }
  }, [initialFetchDone]); // Dependency array ensures useEffect runs only once

  
  const fetchProfileData = async () => {
    try {
      console.log("here inside 27.")
      // Retrieving and using the stored username

        const session_token = localStorage.getItem('session_token');
        // const serverResp2 = await tsPlatform.ido.submitClientResponse(
        //   "get_user_details",
        //   { session_token}
        // );
        const journeyResponse = await tsPlatform.ido.startJourney("get_user_details", {
          additionalParams: { session_token: session_token },
        });

        //const { email, name: { first_name, last_name }, cellphone, city, state } = journeyResponse.data.json_data.result;
       
         console.log(journeyResponse.data.json_data.result)
        // console.log(journeyResponse.data.json_data.result.email)

        const { email: { value, email_verified}, name: { first_name, last_name },phone_number } = journeyResponse.data.json_data.result;
        setProfileData({
          firstname: first_name,
          lastname: last_name,
          email: value, // Accessing the email value from the nested object
          phoneno: phone_number?.value, // Assuming this field is not retrieved in your current fetch logic
          emailverified: email_verified,
        });

        console.log(email)
        if (session_token) {
            console.log('Welcome back');
        } else {
            console.log('No session_token found.');
        }

     // const response = await axios.get('/api/profile'); // Replace with your API endpoint
      //setProfileData(response.data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleEditProfile = async () => {
    try {
      // Make a PATCH request to update the profile data
      await axios.patch('/api/profile', profileData); // Replace with your API endpoint
      // Optionally, you can fetch updated profile data after editing
      // fetchProfileData();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <section className='h-screen grid place-items-center'>
    <div>
      <h1 className='text-center text-3xl font-bold'>Profile</h1>
      <Form
        method='POST'
        className='card w-56 p-8 bg-base-100 shadow-lg flex flex-col gap-y-1'>
        {Object.entries(profileData).map(([key, value]) => (
          <div key={key}>
            <label className='label'htmlFor={key}>{key}</label>
            <input
              type="text"
              id={key}
              name={key}
              value={value}
               className='input input-bordered'
              onChange={handleInputChange}
            />
          </div>
        ))}
        
        {/* <button type="button"  onClick={handleEditProfile}>Edit Profile</button> */}

        <div className='mt-4'>
          <SubmitBtn onClick={handleEditProfile} text='Edit Profile' />
        </div>
      </Form>
    </div>
       </section>
  );
};

export default Profile;