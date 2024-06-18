import { FormInput, SubmitBtn } from "../components";
import { Form, Link, redirect, useNavigate } from "react-router-dom";
import { customFetch } from "../utils";
import { useSDK } from "./SDKProvider";
import { toast } from "react-toastify";
import { loginUser } from "../features/user/userSlice";
import { useDispatch } from "react-redux";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data1 = Object.fromEntries(formData);

  if (data1.newpassword !== data1.confirmpassword) {
    toast.success("New password and confirm password do not match");
    return null;
  }

  try {
    console.log(data1);
    console.log("here.....inside changepassword...");
    const session_token = localStorage.getItem("session_token");
    //console.log(session_token)
    let data = {
      current_password: data1.oldpassword,
      new_password: data1.newpassword,
      session_token: session_token,
    };
    const journeyResponse = await tsPlatform.ido.startJourney(
      "change_password",
      {
        additionalParams: {
          current_password: data1.oldpassword,
          new_password: data1.newpassword,
          session_token: session_token,
        },
      }
    );

    console.log(journeyResponse);

    if (journeyResponse.journeyStepId === "stepup_method_selection") {
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
      console.log("####data");
      console.log(data1);
      console.log(email_otp);
      // let data = email_otp;

     
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

      if (serverResp6.type === "journey_success") {
        console.log("here inside 150...");

        toast.success("password updated successfully");
        //return redirect("/");
        return null;
      } else {
        
        console.error("changepassword failed:");
        toast.success("password updated failed try having right credentials");
        return null;
      }
    }

    return null;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.error?.message ||
      "please double check your credentials passed";
    toast.error(errorMessage);
    return null;
  }
};

const Changepassword = () => {
  return (
    <section className="h-screen grid place-items-center">
      <script src="https://platform-websdk.transmitsecurity.io/platform-websdk/latest/ts-platform-websdk.js"></script>
      <Form
        method="post"
        className="card w-96  p-8 bg-base-100 shadow-lg flex flex-col gap-y-4"
      >
        <h4 className="text-center text-3xl font-bold">Change Password</h4>
        {/* <FormInput type='email' label='email' name='identifier' defaultValue='ysharat@gmail.com'/> */}
        <FormInput
          type="password"
          label="old password"
          name="oldpassword"
          defaultValue="Weblogic@123"
        />
        <FormInput
          type="password"
          label="New password"
          name="newpassword"
          defaultValue="Weblogic@123"
        />
        <FormInput
          type="password"
          label="Confirm password"
          name="confirmpassword"
          defaultValue="Weblogic@123"
        />
        <div className="mt-4">
          <SubmitBtn text="Change Password" />
        </div>
      </Form>
    </section>
  );
};

export default Changepassword;
