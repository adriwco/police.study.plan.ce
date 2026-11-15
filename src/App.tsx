import { Navigate, Route, Routes } from 'react-router-dom';

import { ROUTES } from '@/constants/navigation';
import AppLayout from '@/modules/study/layout/AppLayout';
import DashboardScreen from '@/modules/study/screens/Dashboard/IndexScreen';
import EditalScreen from '@/modules/study/screens/Edital/IndexScreen';
import GuideScreen from '@/modules/study/screens/Guide/IndexScreen';
import LessonScreen from '@/modules/study/screens/Lesson/IndexScreen';
import NotebookScreen from '@/modules/study/screens/Notebook/IndexScreen';
import RevisionsScreen from '@/modules/study/screens/Revisions/IndexScreen';

const App = () => (
  <Routes>
    <Route element={<AppLayout />}>
      <Route index element={<DashboardScreen />} />
      <Route path={ROUTES.edital} element={<EditalScreen />} />
      <Route path={ROUTES.revisions} element={<RevisionsScreen />} />
      <Route path={ROUTES.notebook} element={<NotebookScreen />} />
      <Route path={ROUTES.guide} element={<GuideScreen />} />
      <Route path="/aula/:lessonId" element={<LessonScreen />} />
      <Route path="*" element={<Navigate to={ROUTES.dashboard} replace />} />
    </Route>
  </Routes>
);

export default App;
