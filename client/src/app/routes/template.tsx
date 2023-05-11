import TopBar from "../topBar";
import SideBar from "../sideBar";
import { Outlet } from "react-router-dom";

const Template = () => {
  return (
    <>
      <TopBar />
      <SideBar />
      <Outlet />
    </>
  );
};

export default Template;
