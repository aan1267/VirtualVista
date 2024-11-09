import React from 'react'
import ReactDOM from "react-dom/client";
import { createBrowserRouter,RouterProvider } from "react-router-dom";
import Lobby from "./Components/Lobby";
import Room from "./Components/Room"
import SocketProvider from "./context/SocketProvider";
import { UserProvider } from "./context/UserProvider";
import LandingPage from './Components/LandingPage';

const router = createBrowserRouter([
  {
    element:<SocketProvider/>,
    children: [
      {
        path:"/",
        element:<LandingPage/>
      },
      {
        path: "/lobby",
        element: <UserProvider><Lobby/></UserProvider>
      },
      {
        path: "room/:roomId",
        element: <UserProvider><Room/></UserProvider>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
       <RouterProvider router={router} />
  </React.StrictMode>
)


