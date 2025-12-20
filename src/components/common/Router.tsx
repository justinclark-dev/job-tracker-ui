import { Routes, Route } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import ApplicationList from "../applications/ApplicationsList";
import Application from "../applications/Application";
import FollowUps from "../followups/FollowUps";
import Interviews from "../interviews/Interviews";
import Jobs from "../jobs/Jobs";

const Router = () => {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path='/applications' element={<ApplicationList />} />
      <Route path="/applications/:id" element={<Application />} />
      <Route path='/followups' element={<FollowUps />} />
      <Route path='/interviews' element={<Interviews />} />
      <Route path='/jobs' element={<Jobs />} />
    </Routes>
  );
};

export default Router;