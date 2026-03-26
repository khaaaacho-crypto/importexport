import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { SearchPage } from './pages/SearchPage';
import { LeadsPage } from './pages/LeadsPage';
import { LeadDetailPage } from './pages/LeadDetailPage';
import { BillingPage } from './pages/BillingPage';
import { Sidebar, Topbar } from './components/layout/Layout';
import { useStore } from './store/useStore';
import { cn } from './lib/utils';

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isPublic = location.pathname === '/';

  if (isPublic) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <main className="flex-1 lg:ml-64">
        <Topbar />
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default function App() {
  const { isAuthenticated } = useStore();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/dashboard" 
              element={isAuthenticated ? <DashboardPage /> : <Navigate to="/" />} 
            />
            <Route 
              path="/search" 
              element={isAuthenticated ? <SearchPage /> : <Navigate to="/" />} 
            />
            <Route 
              path="/leads" 
              element={isAuthenticated ? <LeadsPage /> : <Navigate to="/" />} 
            />
            <Route 
              path="/leads/:id" 
              element={isAuthenticated ? <LeadDetailPage /> : <Navigate to="/" />} 
            />
            <Route 
              path="/billing" 
              element={isAuthenticated ? <BillingPage /> : <Navigate to="/" />} 
            />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
