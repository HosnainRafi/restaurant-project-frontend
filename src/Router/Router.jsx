import { createBrowserRouter } from "react-router-dom";
import { MainRoutes } from "./MainRoutes";
import { AdminRoutes } from "./AdminRoutes";
import { CustomerRoutes } from "./CustomerRoutes";


export const router = createBrowserRouter([
  ...MainRoutes,
  ...AdminRoutes,
  ...CustomerRoutes,
]);
