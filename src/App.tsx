import AppRoutes from './routes/Routes';
import { UserProvider } from './context/UserContext'; // ajuste o caminho conforme seu projeto

function App() {
  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  );
}

export default App;
