import React, { useEffect } from "react";
import LoginButton from "./LoginButton";
import "../css/HomePage.css";
import SignUpButton from "./SignUpButton";
import NavbarLogoutButton from "./LogOutButton";
import { useAuthContext } from "../hooks/useAuthContext";

const HomePageNavBar = () => {
  const { user, dispatch } = useAuthContext();

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      dispatch({ type: "LOGIN", payload: JSON.parse(userData) });
    }
  }, [dispatch]);

  return (
    <div className="navbar-container" style={{background: "#070720"}}>
      <div className="navbar-brand" id="summoner-central">
        Summoner Central 
      </div>
      <div className='navbar-right-container'>
      {user ? (
        <NavbarLogoutButton className="navbar-logout-button" />
      ) : (
        <>
          <SignUpButton className="navbar-signup-button" />
          <LoginButton className="navbar-login-button" />
        </>
      )}
      </div>
    </div>
  );
};

export default HomePageNavBar;
