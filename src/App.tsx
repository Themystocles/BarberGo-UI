import { useState } from 'react';
import AppRoutes from './components/routes/Routes'; // Importando as rotas

function App() {
  const [count, setCount] = useState(0);

  return (
    <>

      <AppRoutes />
    </>
  );
}

export default App;
