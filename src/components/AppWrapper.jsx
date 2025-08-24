import { router } from "@/Router/Router";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';
import SplashScreen from "./SplashScreen";

const AppWrapper = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading ? (
        <SplashScreen key="splash" />
      ) : (
        <>
          <Toaster position="top-center" />
          <RouterProvider router={router} />
        </>
      )}
    </AnimatePresence>
  );
};

export default AppWrapper;