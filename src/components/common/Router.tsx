import { Routes, Route } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import ApplicationList from "../applications/ApplicationsList";
import ApplicationEdit from "../applications/ApplicationEdit";
import ApplicationNew from "../applications/ApplicationNew";
import ApplicationView from "../applications/ApplicationView";
import FollowUps from "../followups/FollowUps";
import Interviews from "../interviews/Interviews";
import Jobs from "../jobs/Jobs";

const Router = () => {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path='/applications' element={<ApplicationList />} />
      <Route path='/applications/new' element={<ApplicationNew />} />
      <Route path="/applications/:id" element={<ApplicationView />} />
      <Route path="/applications/:id/edit" element={<ApplicationEdit />} />
      <Route path='/followups' element={<FollowUps />} />
      <Route path='/interviews' element={<Interviews />} />
      <Route path='/jobs' element={<Jobs />} />
    </Routes>
  );
};

export default Router;