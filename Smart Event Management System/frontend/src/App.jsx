import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { EventProvider } from './context/EventContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <EventProvider>
          <AppRoutes />
        </EventProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
