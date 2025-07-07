import React, { createContext, useEffect, useState } from "react";
import urlSocket from "helpers/urlSocket";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [facilities, setFacilities] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false); // Track loading state

  useEffect(() => {
    const fetchSideBarInfo = async () => {
      try {
        //console.log("Fetching facilities...");
        const authUser = JSON.parse(sessionStorage.getItem("authUser"));

        if (!authUser || !authUser.db_info) {
          console.error("No auth user found");
          setDataLoaded(true);
          return;
        }

        const responseData = await urlSocket.post("cog/get-role-facilities", {
          encrypted_db_url: authUser.db_info.encrypted_db_url,
          user_data: authUser.user_data,
        });

        //console.log(responseData, "responseData");

        if (responseData.data.response_code === 200) {  // Ensure correct response check
          setFacilities(responseData.data.data[0].facilities || []);
        }
      } catch (error) {
        console.error("Error fetching facilities:", error);
      } finally {
        setDataLoaded(true); // Ensure state updates even if API fails
      }
    };

    fetchSideBarInfo();
  }, []);

  return (
    <AuthContext.Provider value={{ facilities, dataLoaded }}>
      {dataLoaded ? children : <p>Loading...</p>}
    </AuthContext.Provider>
  );
};
