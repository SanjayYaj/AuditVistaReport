import React, { useState, useEffect } from "react";
import { Spinner } from "reactstrap";
import TreeStructure from "./Component/TreeStructure";

const NewHstructure = () => {
  const [dataloaded, setDataloaded] = useState(false);

  useEffect(() => {
    // Simulate a data loading process (e.g., fetching data from an API)
    const timer = setTimeout(() => {
      setDataloaded(true);
    }, 2000);

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);

  return (
    <div className="page-content">
      {dataloaded ? (
        <TreeStructure />
      ) : (
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "100vh" }}>
          <div>Loading...</div>
          <Spinner color="primary" />
        </div>
      )}
    </div>
  );
};

export default NewHstructure;






