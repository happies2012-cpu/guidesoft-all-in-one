import { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { PageLoader } from "@/components/PageLoader";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthPage } from "./components/auth/AuthPage";
import { PaymentGate } from "./components/auth/PaymentGate";
import { AppLayout } from "./components/layout/AppLayout";

// Lazy-loaded app pages
const Dashboard = lazy(() => import("./pages/app/Dashboard"));
const Messages = lazy(() => import("./pages/app/Messages"));
const Explore = lazy(() => import("./pages/app/Explore"));
const CloudDrive = lazy(() => import("./pages/app/CloudDrive"));
const Notifications = lazy(() => import("./pages/app/Notifications"));
const Settings = lazy(() => import("./pages/app/Settings"));
const Stories = lazy(() => import("./pages/app/Stories"));
const Reels = lazy(() => import("./pages/app/Reels"));
const Live = lazy(() => import("./pages/app/Live"));
const Communities = lazy(() => import("./pages/app/Communities"));
const News = lazy(() => import("./pages/app/News"));
const Channels = lazy(() => import("./pages/app/Channels"));
const Workspaces = lazy(() => import("./pages/app/Workspaces"));
const Analytics = lazy(() => import("./pages/app/Analytics"));
const Payments = lazy(() => import("./pages/app/Payments"));
const Admin = lazy(() => import("./pages/app/Admin"));
const Chatbot = lazy(() => import("./pages/app/Chatbot"));
const MarketingPage = lazy(() => import("./pages/MarketingPage"));

const queryClient = new QueryClient();

function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, hasPaid } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <PageLoader />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!hasPaid) return <PaymentGate />;

  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isLoading, user, hasPaid, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <PageLoader />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!hasPaid) return <PaymentGate />;
  if (!isAdmin) return <Navigate to="/app" replace />;

  return <>{children}</>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, hasPaid } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <PageLoader />
      </div>
    );
  }

  if (user && hasPaid) return <Navigate to="/app" replace />;
  if (user && !hasPaid) return <PaymentGate />;

  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pages/:slug" element={<LazyPage><MarketingPage /></LazyPage>} />
            <Route path="/auth" element={<AuthRoute><AuthPage /></AuthRoute>} />
            <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<LazyPage><Dashboard /></LazyPage>} />
              <Route path="explore" element={<LazyPage><Explore /></LazyPage>} />
              <Route path="messages" element={<LazyPage><Messages /></LazyPage>} />
              <Route path="notifications" element={<LazyPage><Notifications /></LazyPage>} />
              <Route path="stories" element={<LazyPage><Stories /></LazyPage>} />
              <Route path="reels" element={<LazyPage><Reels /></LazyPage>} />
              <Route path="live" element={<LazyPage><Live /></LazyPage>} />
              <Route path="cloud" element={<LazyPage><CloudDrive /></LazyPage>} />
              <Route path="communities" element={<LazyPage><Communities /></LazyPage>} />
              <Route path="news" element={<LazyPage><News /></LazyPage>} />
              <Route path="channels" element={<LazyPage><Channels /></LazyPage>} />
              <Route path="workspaces" element={<LazyPage><Workspaces /></LazyPage>} />
              <Route path="analytics" element={<LazyPage><Analytics /></LazyPage>} />
              <Route path="payments" element={<LazyPage><Payments /></LazyPage>} />
              <Route path="chatbot" element={<LazyPage><Chatbot /></LazyPage>} />
              <Route path="admin" element={<AdminRoute><LazyPage><Admin /></LazyPage></AdminRoute>} />
              <Route path="settings" element={<LazyPage><Settings /></LazyPage>} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
