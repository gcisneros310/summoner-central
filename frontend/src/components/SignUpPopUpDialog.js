import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { useSignup } from "../hooks/useSignup";
import { Alert } from "react-bootstrap";
import "../css/HomePage.css";

const SignUpPopUpDialog = ({show, onHide}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [summonerName, setSummonerName] = useState("");
  const { signup, error, isLoading } = useSignup();
  const handleSignUp = async (event) => {
    event.preventDefault();

    const newUser = {
      email: email,
      password: password,
      summonerName: summonerName,
    };

    console.log("Sign up button clicked");
    console.log("Sign up email", newUser.email);
    console.log("Sign up password", newUser.password);
    console.log("Sign up summoner name", newUser.summonerName);

    await signup(newUser.email, newUser.password, newUser.summonerName);

    if (!error) {
      setEmail("");
      setPassword("");
      setSummonerName("");
      onHide()
    }
  };

  return (
    <Modal
    className="signup-modal-dialog"
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
  
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Sign Up</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4 className="signup-modal-h4">
          Sign up for Summoner Central using your email, password, and your
          summoner name
        </h4>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label className="form-label">Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              onChange={(event) => setEmail(event.target.value)}
              value={email}
            />
            <Form.Text className="text-muted"></Form.Text>
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(event) => setPassword(event.target.value)}
              value={password}
            />
          </Form.Group>
          <Form.Group controlId="formBasicSummonerName">
            <Form.Label>Summoner Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Summoner Name"
              onChange={(event) => setSummonerName(event.target.value)}
              value={summonerName}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          disabled={isLoading}
          onClick={handleSignUp}
          onSubmit={handleSignUp}
        >
          Sign Up
        </Button>
      </Modal.Footer>
      {error && <Alert variant="danger">{error}</Alert>}
    </Modal>
  );
};

export default SignUpPopUpDialog;
