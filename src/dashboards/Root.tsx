import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Student from "./student/Student";
import Instructor from "./instructor/Instructor";
import Office from "./office/Office";

import RoleSelection from "./login/RoleSelection";
import LoginPage from "./login/LoginPage";

export function Root() {
  const router = createBrowserRouter([
    {
      path: "/",
      children: [
        { index: true, element: <RoleSelection /> },

        {
          path: "/login/:role",
          element: <LoginPage />,
        },

        {
          path: "/student",
          element: <Student />,
        },
        {
          path: "/instructor",
          element: <Instructor />,
        },
        {
          path: "/office",
          element: <Office />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router}></RouterProvider>;
}

export default Root;
