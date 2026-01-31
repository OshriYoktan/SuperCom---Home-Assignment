import { useAuth } from './hooks/useAuth';
import RegisterPage from './pages/RegisterPage';
import TasksPage from './pages/TasksPage';

function App() {
  const { user, login } = useAuth();

  return user
    ? <TasksPage user={user} /> : <RegisterPage onRegistered={login} />;
}

export default App;
