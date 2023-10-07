import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import '../css/HomePage.css'
import { Alert } from "react-bootstrap";
import { useLogin } from "../hooks/useLogin";


const LoginPopupDialog = ({ show, onHide }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useLogin();

  const handleLogin = async (event) => {
    event.preventDefault();

    const newUser = {
      email: email,
      password: password,
    };

    console.log("Log in button clicked");
    console.log("Log in email", newUser.email);
    console.log("Log in password", newUser.password);

    await login(newUser.email, newUser.password);

    if(!error) {
      setEmail('')
      setPassword('')
      onHide() // call onHide when login is successful
      console.log('reset email and password state variables')
    }
  };

  return (
    <Modal
      show={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="login-modal"
      onHide={onHide} // pass onHide directly to the Modal component
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Log In</Modal.Title>
      </Modal.Header>
      <Modal.Body className='modal-body-text'>
        <h4>Enter your login details below:</h4>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label className="form-label">Email address</Form.Label>
            <Form.Control className="form-control"
            type="email" 
            placeholder="Enter email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            />
            <Form.Text className="text-muted"></Form.Text>
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label className="form-label">Password</Form.Label>
            <Form.Control className="form-control"
            type="password" 
            placeholder="Password"
            value={password}
            onChange={event => setPassword(event.target.value) } />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button 
        onClick={handleLogin}
        onSubmit={handleLogin}
        disabled={isLoading}
        >Close</Button>
      </Modal.Footer>
      {error && <Alert variant="danger">{error}</Alert>}
    </Modal>
  );
};

export default LoginPopupDialog;