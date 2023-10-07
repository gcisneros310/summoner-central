// define a react-bootstrap component for a login button

import React from "react";
import { Button } from "react-bootstrap";
import "../css/HomePage.css";
import LoginPopupDialog from "./LoginPopupDialog";
import { useState } from "react";
// define a react-bootstrap component for a login button
// this component is a child component of HomePageNavBar
// designate an onClick event handler with a preventDefault() method

const LoginButton = () => {

  const [loginModalShow, setLoginModalShow] = useState(false);
  const handleClick = (event) => {
    event.preventDefault();
    console.log("Login button clicked");
    setLoginModalShow(true)
  };
  return (<>
    <Button
      className="navbar-login-button"
      onClick={handleClick}
      variant='custom'
    >
      Log In
    </Button>
     <LoginPopupDialog show={loginModalShow} onHide={() => setLoginModalShow(false)} />
     </>
  );
};

export default LoginButton;
