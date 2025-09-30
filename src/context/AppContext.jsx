import { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext(null);

const AppContextProvider = (props) => {
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setDoctors] = useState([]);
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Save token in localStorage whenever it changes
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  const getDoctorsData = useCallback(async () => {
    try {
      const url = backendUrl + "/api/doctor/list";
      console.log("GET Doctors URL:", url);
      const { data } = await axios.get(url);
      if (data.success) setDoctors(data.doctors);
      else toast.error(data.message);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error(error.message);
    }
  }, [backendUrl]);

  const loadUserProfileData = useCallback(async () => {
    try {
      if (!token) {
        setUserData(null);
        return;
      }

      const url = backendUrl + "/api/user/get-profile";
      console.log("GET Profile URL:", url);

      // ✅ Pass token in Authorization header
      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Profile API Response:", data);

      if (data.success) {
        setUserData(data.userData);
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setUserData(null);
      toast.error(error.message);
    }
  }, [token, backendUrl]);

  const value = {
    doctors,getDoctorsData,
    userData,
    token,
    setToken,
    currencySymbol,
    backendUrl,
    getDoctorsData,
    loadUserProfileData,
    setUserData,
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    }
  }, [token]);
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;

