import { useSelector } from "react-redux";
import { Navigate, useSearchParams } from "react-router-dom";

/**
 * GuestRoute — blocks authenticated users from accessing pages like /login.
 * If logged in, redirects to the `redirect` query param or home.
 */
const GuestRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default GuestRoute;
