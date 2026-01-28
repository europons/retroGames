import { createBrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import SpaceInvaders from "./juegos/space-invaders/space-invaders.jsx";
import SuperHopper from "./juegos/super-hopper/super-hopper.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/space-invaders",
    element: <SpaceInvaders />,
  },
  {
    path: "/super-hopper",
    element: <SuperHopper />,
  },
]);