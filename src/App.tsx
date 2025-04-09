
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Conventional pages
import Index from './pages/Index';
import VehiculesPage from './pages/VehiculesPage';
import VehicleDetailsPage from './pages/VehicleDetailsPage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFound from './pages/NotFound';

// Admin pages
import AdminPage from './pages/AdminPage';
import Dashboard from './components/admin/Dashboard';
import VehiclesList from './components/admin/VehiclesList';
import VehicleForm from './components/admin/VehicleForm';
import MessagesList from './components/admin/MessagesList';
import SiteSettings from './components/admin/SiteSettings';
import MediaManager from './components/admin/MediaManager';
import ActivityLog from './components/admin/ActivityLog';
import PageEditor from './components/admin/PageEditor';

// Create a QueryClient instance
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/vehicules" element={<VehiculesPage />} />
          <Route path="/vehicules/:id" element={<VehicleDetailsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/a-propos" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminPage />}>
            <Route path="" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="vehicles" element={<VehiclesList />} />
            <Route path="vehicles/add" element={<VehicleForm mode="create" />} />
            <Route path="vehicles/edit/:id" element={<VehicleForm mode="edit" />} />
            <Route path="messages" element={<MessagesList />} />
            <Route path="media" element={<MediaManager />} />
            <Route path="activity" element={<ActivityLog />} />
            <Route path="pages" element={<PageEditor />} />
            <Route path="settings" element={<SiteSettings />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  )
}

export default App
