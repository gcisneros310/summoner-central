import React from "react";
import { Button } from "react-bootstrap";
import { useLogout } from "../hooks/useLogout";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
const NavbarLogoutButton = () => {
  const { logout } = useLogout();
  const [modalShow, setModalShow] = useState(false);

  const handleClick = (event) => {
    event.preventDefault();
    setModalShow(true);
  };

  const handleYesClick = (event) => {
    logout();
    setModalShow(false);
  };
  return (
    <div>
      <Button
        className="navbar-logout-button"
        onClick={handleClick}
        variant="custom"
      >
        Log out
      </Button>

      <Modal className='logout-modal-container' show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Log out</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to log out?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            No
          </Button>
          <Button variant="danger" onClick={handleYesClick}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default NavbarLogoutButton;
