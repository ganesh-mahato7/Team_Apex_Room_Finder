import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

const App = () => (
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;