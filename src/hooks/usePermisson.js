import { useContext } from "react";
import { AuthContext } from "../store/context/AuthContext";

export const usePermissions = (menuUrl) => {
  // const { facilities } = useContext(AuthContext);
  const facilities = JSON.parse(sessionStorage.getItem("user_facilities"))
  const menu = facilities?.find((item) => item.url === menuUrl);

  return {
    canView: menu?.read_checked || menu?.read_write_checked || false,
    canEdit: menu?.read_write_checked || false,
  };
};
