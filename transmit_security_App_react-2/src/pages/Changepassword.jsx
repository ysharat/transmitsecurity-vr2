import { FormInput, SubmitBtn } from '../components';
import { Form, Link, redirect, useNavigate } from 'react-router-dom';
import { customFetch } from '../utils';
import { toast } from 'react-toastify';
import { loginUser } from '../features/user/userSlice';
import { useDispatch } from 'react-redux';

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    const journeyResponse = await tsPlatform.ido.startJourney("change_password", {
      additionalParams: {},
    });
    console.log(journeyResponse)


    //const response = await customFetch.post('/auth/local/register', data);
    toast.success('account created successfully');
    return redirect('/');
  } catch (error) {
    const errorMessage =
      error?.response?.data?.error?.message ||
      'please double check your credentials';
    toast.error(errorMessage);
    return null;
  }
};

const Changepassword = () => {
  return (
    <section className='h-screen grid place-items-center'>
      <Form
        method='post'
        className='card w-96  p-8 bg-base-100 shadow-lg flex flex-col gap-y-4'
      >
        <h4 className='text-center text-3xl font-bold'>Change Password</h4>
        {/* <FormInput type='email' label='email' name='identifier' defaultValue='ysharat@gmail.com'/> */}
        <FormInput type='password' label='old password' name='oldpassword' defaultValue='oldpassword'/>
        <FormInput type='password' label='New password' name='newpassword' defaultValue='Newpassword'/>
        <FormInput type='password' label='Confirm password' name='confirmpassword' defaultValue='Confirmpassword'/>
        <div className='mt-4'>
          <SubmitBtn text='Change Password' />
        </div>


    
      </Form>
    </section>
  );
}



export default Changepassword
