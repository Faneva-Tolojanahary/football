import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import AllPlayers from "./Pages/AllPlayers";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/:playerName",
    element: <AllPlayers />,
  },
]);

export default router;
