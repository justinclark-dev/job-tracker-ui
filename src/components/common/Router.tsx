import { Routes, Route } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import Applications from "../applications/Applications";
import FollowUps from "../followups/FollowUps";
import Interviews from "../interviews/Interviews";
import Jobs from "../jobs/Jobs";

const Router = () => {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path='/applications' element={<Applications />} />
      <Route path='/followups' element={<FollowUps />} />
      <Route path='/interviews' element={<Interviews />} />
      <Route path='/jobs' element={<Jobs />} />
    </Routes>
  );
};

export default Router;