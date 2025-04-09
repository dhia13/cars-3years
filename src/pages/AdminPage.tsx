
import React, { useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator
} from '@/components/ui/sidebar';
import { Layers, Car, MessageSquare, Settings, LogOut, Image, FileText, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminLogin from '@/components/admin/AdminLogin';

const AdminPage = () => {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
  };

  if (!token) {
    return <AdminLogin onLoginSuccess={(newToken) => setToken(newToken)} />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="flex items-center px-4 py-2">
            <span className="text-xl font-semibold">3ansdz Admin</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className={window.location.pathname === '/admin/dashboard' ? 'bg-gray-100' : ''}
                  onClick={() => navigate('/admin/dashboard')}
                >
                  <Layers className="h-5 w-5" />
                  <span>Tableau de bord</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className={window.location.pathname.startsWith('/admin/vehicles') ? 'bg-gray-100' : ''}
                  onClick={() => navigate('/admin/vehicles')}
                >
                  <Car className="h-5 w-5" />
                  <span>Véhicules</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className={window.location.pathname === '/admin/messages' ? 'bg-gray-100' : ''}
                  onClick={() => navigate('/admin/messages')}
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>Messages</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className={window.location.pathname === '/admin/media' ? 'bg-gray-100' : ''}
                  onClick={() => navigate('/admin/media')}
                >
                  <Image className="h-5 w-5" />
                  <span>Médias</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className={window.location.pathname === '/admin/activity' ? 'bg-gray-100' : ''}
                  onClick={() => navigate('/admin/activity')}
                >
                  <Activity className="h-5 w-5" />
                  <span>Activité</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className={window.location.pathname === '/admin/pages' ? 'bg-gray-100' : ''}
                  onClick={() => navigate('/admin/pages')}
                >
                  <FileText className="h-5 w-5" />
                  <span>Pages</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className={window.location.pathname === '/admin/settings' ? 'bg-gray-100' : ''}
                  onClick={() => navigate('/admin/settings')}
                >
                  <Settings className="h-5 w-5" />
                  <span>Configuration</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarSeparator />
            <div className="p-4">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                Déconnexion
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminPage;
