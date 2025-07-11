import AppRoutes from './routes/Routes';
import { UserProvider } from './context/UserContext'; // ajuste o caminho conforme seu projeto
import { CustomizationProvider } from './context/CustomizationContext';

function App() {
  return (

    <UserProvider>
      <CustomizationProvider>
        <AppRoutes />
      </CustomizationProvider>
    </UserProvider>
  );
}

export default App;
