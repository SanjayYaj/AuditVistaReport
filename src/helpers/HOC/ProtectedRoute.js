import { Navigate, Outlet } from "react-router-dom";
import { usePermissions } from "../../hooks/usePermisson";

const ProtectedRoute = ({ menuUrl }) => {
  const { canView } = usePermissions(menuUrl);
  return canView ? <Outlet /> : <Navigate to="/url-not-found" />;
};

export default ProtectedRoute;
