import { Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/auth/me`, {
          withCredentials: true, // Send cookies
        });
        setUser(res.data);
      } catch (error) {
        setUser(null);
      }
      setLoading(false);
    };

    if (!user) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [user, setUser]);

  if (loading) return <div>Loading...</div>; // Show loader while checking auth

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
