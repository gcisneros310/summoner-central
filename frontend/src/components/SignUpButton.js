import React from "react";
import { Button } from "react-bootstrap";
import "../css/HomePage.css";
import { useState } from "react";
import SignUpPopUpDialog from "./SignUpPopUpDialog";

const SignUpButton = () => {
  const [modalShow, setModalShow] = useState(false);
  const handleClick = (event) => {
    event.preventDefault();
    console.log("Sign up button clicked");
    setModalShow(true);
  };
  return (
    <div>
      <Button
        className="navbar-signup-button"
        onClick={handleClick}
        variant="custom"
      >
        Sign Up
      </Button>
      <SignUpPopUpDialog show={modalShow} onHide={() => setModalShow(false)} />
    </div>
  );
};

export default SignUpButton;
