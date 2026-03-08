import { useStore } from './store/useStore';
import LoginPage from './pages/LoginPage';
import WorkspacePage from './pages/WorkspacePage';

export default function App() {
  const user = useStore((s) => s.user);
  return user ? <WorkspacePage /> : <LoginPage />;
}
