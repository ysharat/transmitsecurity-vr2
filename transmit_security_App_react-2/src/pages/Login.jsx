import { FormInput, SubmitBtn } from "../components";
import { useState, useEffect } from "react";
//import { initializeSDK } from "./sdk";
import { useSDK } from "./SDKProvider";
import { Form, Link, redirect, useNavigate } from "react-router-dom";
import { customFetch } from "../utils";
import { toast } from "react-toastify";
import { loginUser } from "../features/user/userSlice";
import { useDispatch } from "react-redux";

export const action =
  (store) =>
  async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    try {
      console.log("1. started login journey...:");

      // const journeyResponse = await tsPlatform.ido.startJourney("login", {
      //   additionalParams: { username: "ysharat1@yopmail.com" },
      // });
      const journeyResponse = await tsPlatform.ido.startJourney("login-emailOTP-success-Jacob-sharath", {
        additionalParams: { username: data.username },
      });

      console.log("1. started login journey serverresp:");
      console.log(journeyResponse);
      const debug = await tsPlatform.ido.generateDebugPin();
      console.log("debug ping:");
      console.log(debug);

      const serverResp2 = await tsPlatform.ido.submitClientResponse(
        "client_input",
        { data: data }
      );
      console.log("2 serverResp2");
      console.log(serverResp2);

      // console.log("#getting access_token1");
      // let jsonText = serverResp2.data.text;
      // console.log(jsonText);
      // console.log("=============1");
      // // Convert the JSON string into a JavaScript object
      // const parseData1 = JSON.parse(serverResp2.data.text);
      // console.log("=============2");
      // console.log(parseData1);
      // // Extract the access_token
      // const accessToken = parseData1.access_token;

      //Log the access_token
      // console.log("=============3");
      // console.log(accessToken);
      // console.log("=============4");
      // console.log(jsonText.access_token);
      // console.log("=============5");

      //console.log(JSON.parse(access_token))

      // const serverResp0 = await tsPlatform.ido.submitClientResponse("client_input",{});
      // console.log("0.serverResp1 -display information");
      // console.log(serverResp0);

      //sending empty input for action:information
      //   const serverResp3 = await tsPlatform.ido.submitClientResponse(
      //     "client_input",
      //     {}
      //   );
      //   console.log("3 serverResp3");
      //   console.log(serverResp3);

      //   const finalresponsePromise =
      //   await window.tsPlatform.drs.triggerActionEvent("login", {
      //     correlation_id: serverResp3.data.correlation_id,
      //     user_id: serverResp3.data.user_id,
      //   });
      // console.log("3.0 before finalresponsePromise");
      // const finalresponse = await finalresponsePromise;
      // console.log(finalresponse);

      // console.log("3.1 finalresponse");
      // console.log(finalresponse);

      // // let accessToken3 =
      // //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5N…xMTh9.Ap04MwfMs6L9gGrM4cQdNluN9XCATX-o2x8N-Pdgk8Y";

      // let accessToken3 = finalresponse.actionToken;
      // console.log("3.2 finalresponse");
      // console.log(accessToken3);

      // const serverResp4 = await tsPlatform.ido.submitClientResponse(
      //   "client_input",
      //   { action_token: accessToken3 }
      // );
      // console.log("4 serverResp4");
      // console.log(serverResp4);

      // const serverResp5 = await tsPlatform.ido.submitClientResponse(
      //   "client_input",
      //   {}
      // );
      // console.log("5 serverResp5");
      // console.log(serverResp5);
      const responseData = JSON.parse(serverResp2.data.text);
      console.log(responseData);
      if (responseData.code ==="authenticator_locked") {
        toast.error("Account locked out try after some time");
        return null;
         }

       else if (serverResp2.journeyStepId ==="transmit_platform_email_otp_authentication") {
        // console.log("##inside stepup...");
        // const mfaSelection = prompt(
        //   "Select MFA method: 1. email_otp, 2. sms_otp"
        // );
        // let email_otp, sms_otp;

        // switch (mfaSelection) {
        //   case "1":
        //     email_otp = "email_otp";
        //     break;
        //   case "2":
        //     sms_otp = "sms_otp";
        //     break;
        //   default:
        //     console.log("Invalid selection");
        // }

        // console.log("Selected method:");
        // console.log("5.1 serverResp5");
        // console.log(mfaSelection);
        // console.log("####data")
        // console.log(data)
        // console.log(email_otp);
        // // let data = email_otp;

        // // { username: "ysharat1@yopmail.com", "email":"ysharat1@yopmail.com" }
        // const serverResp5 = await tsPlatform.ido.submitClientResponse(
        //   "email_otp",
        //   {username: data.username, email: data.username}
        // );
        // console.log("5.2 serverResp5");
        // console.log(serverResp5);
        // console.log("5.3 end serverResp5");
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
       console.log("here ***********160")
       let jsonText =  serverResp7.data.text;
       console.log(jsonText);

       console.log("=============1");
       // Convert the JSON string into a JavaScript object
       const parseData1 =   JSON.parse(serverResp7.data.text);
       console.log("=============2");
       console.log(parseData1);
      
       // Extract the access_token
       const accessToken = parseData1.access_token;
        //  username = serverResp7.data.data.data.identifier;
        //     console.log("Login success:" + username);

          const serverResp8 = await tsPlatform.ido.submitClientResponse(
            "client_input",
            {}
          );
          console.log("serverResp8....");
          console.log(serverResp8);
          console.log(serverResp8.headers);
          console.log("#######178")
           if (serverResp8.type === "journey_success") {
            // const sessionToken = await tsPlatform.drs.getSessionToken();
            // console.log("sessionToken1")
            // console.log(sessionToken)
   
          console.log("sessionToken3")
            console.log(serverResp8.data.json_data.session_token);
            const user = {
              jwt: 'eyzerer',
              user: {
                username: data.username,
                email: data.username
              }
            }
             
            localStorage.setItem('session_token', serverResp8?.data?.json_data?.session_token); 
            localStorage.setItem('session_id', parseData1?.session_id); 
            console.log("session_id")
            console.log(parseData1.session_id); 
            store.dispatch(loginUser(user));
                toast.success("logged in successfully");
                return redirect("/");
           }
           else {
            //   // Handle login failure
              //console.error('Login failed:', serverResp.errorMessage);
              console.error("Login failed:");
                  return;
               }

        // if (serverResp7.type === "journey_success") {
        //   console.log("here inside 150...")
        //  let username = null;
        //  username = serverResp2.data.data.data.identifier;

        //   //console.log("Login success:" + username);
        //   // isAuthenticated =true;
        //   //localStorage.setItem("isLoggedIn", "true");
        //   //localStorage.setItem("authtoken", accessToken);
        //   // loadWelcomePage(username);
        //   //  return;
        //         //const response = await customFetch.post("/auth/local", data);
        //         const user = {
        //           jwt: 'eyzerer',
        //           user: {
        //             username: username,
        //             email: username
        //           }
        //         }
        //             store.dispatch(loginUser(user));
        //             toast.success("logged in successfully");
        //             return redirect("/");
        //   }   else {
        //   // Handle login failure
        //   //console.error('Login failed:', serverResp.errorMessage);
        //   console.error("Login failed:");
        //       return;
        //    }
      }
      else {
          // Handle login failure
          //console.error('Login failed:', serverResp.errorMessage);
              console.error("Login failed:");
              toast.error("Invalid credentials");
              return redirect("/login");
            
        }

      

      // if (serverResp5.type === "journey_success") {
      //   //username = serverResp2.data.data.data.username;

      //   //console.log("Login success:" + username);
      //   // isAuthenticated =true;
      //   //localStorage.setItem("isLoggedIn", "true");
      //   //localStorage.setItem("authtoken", accessToken);
      //   // loadWelcomePage(username);
      //   // return
      //   let username = null;
      //   username = serverResp2.data.data.data.identifier;

      //    //console.log("Login success:" + username);
      //    // isAuthenticated =true;
      //    //localStorage.setItem("isLoggedIn", "true");
      //    //localStorage.setItem("authtoken", accessToken);
      //    // loadWelcomePage(username);
      //    //  return;
      //          //const response = await customFetch.post("/auth/local", data);
      //          const user = {
      //            jwt: 'eyzerer',
      //            user: {
      //              username: username,
      //              email: username
      //            }
      //          }
      //         //const response = await customFetch.post("/auth/local", data);
      //       store.dispatch(loginUser(user));
      //         toast.success("logged in successfully");
      //         return redirect("/");
      // } else {
      //   // Handle login failure
      //   //console.error('Login failed:', serverResp.errorMessage);
      //       console.error("Login failed:");
      //     return
      // }

      // return null;
      // const response = await customFetch.post("/auth/local", data);
      // store.dispatch(loginUser(response.data));
      // toast.success("logged in successfully");
      //return redirect("/");
    } catch (error) {
      const errorMessage =
      console.log("here inside final catch"+error)
        error?.response?.data?.error?.message ||
        "please double check your credentials";
      toast.error(errorMessage);
      
      return null;
    }
  };

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginAsGuestUser = async () => {
    try {
      const response = await customFetch.post("/auth/local", {
        identifier: "test@test.com",
        password: "secret",
      });
      dispatch(loginUser(response.data));
      toast.success("welcome guest user");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("guest user login error. please try again");
    }
  };
  console.log("here inside ....282");
  // let isinitializeSDK = localStorage.getItem("isinitializeSDK") === "true";
  // useEffect(() => {
  //   console.log("useEffect called"); // Check if useEffect is being called
  //   console.log("isinitializeSDK:", isinitializeSDK); // Log the value of isinitializeSDK
  //   // Call the SDK initialization function
  //   if (!isinitializeSDK) {
  //     console.log("Initializing SDK..."); // Log when SDK initialization starts
  //     localStorage.setItem("isinitializeSDK", "true");
  //     isinitializeSDK = true;
  //     console.log("SDK initialized successfully!");
  //     initializeSDK();
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
    <section className="h-screen grid place-items-center">
      <Form
        method="post"
        className="card w-96  p-8 bg-base-100 shadow-lg flex flex-col gap-y-4"
      >
        <h4 className="text-center text-3xl font-bold">Login</h4>
        <FormInput
          type="email"
          label="email"
          name="username"
          defaultValue="test1fn@yopmail.com"
        />
        <FormInput
          type="password"
          label="password"
          name="password"
          defaultValue="Welcome@123"
        />
        <div className="mt-4">
          <SubmitBtn text="login" />
        </div>
        {/* <button
          type="button"
          className="btn btn-secondary btn-block"
          onClick={loginAsGuestUser}
        >
          guest user
        </button> */}
          <p className="text-center">
          <Link
            to="/Forgotpassword"
            className="ml-2 link link-hover link-primary capitalize"
          >
            ForgotPassword
          </Link>
        </p>

        <p className="text-center">
          Not a member yet?{" "}
          <Link
            to="/register"
            className="ml-2 link link-hover link-primary capitalize"
          >
            register
          </Link>
        </p>
        <p className="text-center">
          <Link to="/" className="ml-2 link link-hover link-primary capitalize">
            Home
          </Link>
        </p>
      </Form>
    </section>
  );
};
export default Login;
