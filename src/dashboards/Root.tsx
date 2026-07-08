import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RoleSelection from "./login/RoleSelection";
import LoginPage from "./login/LoginPage";
import InstructorDashBoard from "./instructorDashBoard/InstructorDashBoard";
import OfficeDashBoard from "./officeDashBoard/OfficeDashBoard";
import StudentDashBoard from "./studentDashBoard/StudentDashBoard";

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
          path: "/dashboard/instructor",
          element: <InstructorDashBoard />,
        },

        {
          path: "/dashboard/student",
          element: <StudentDashBoard />,
        },

        {
          path: "/dashboard/office",
          element: <OfficeDashBoard />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router}></RouterProvider>;
}

export default Root;
