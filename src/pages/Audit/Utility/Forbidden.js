import React from "react";
import { useNavigate } from "react-router-dom";

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>403 - Forbidden</h1>
      <p style={styles.text}>You don't have permission to access this page.</p>
      <button style={styles.button} onClick={() => navigate("/dashboard")}>
        Go to Dashboard
      </button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "50px",
  },
  heading: {
    fontSize: "2rem",
    color: "#FF0000",
  },
  text: {
    fontSize: "1.2rem",
    color: "#333",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "1rem",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
};

export default Forbidden;
