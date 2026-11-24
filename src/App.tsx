import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";

const AppLayout = lazy(() => import("./components/AppLayout/AppLayout"));
const ComunicadosPage = lazy(
  () => import("./pages/Comunicados/ComunicadosPage"),
);
const DemonstrativoPage = lazy(
  () => import("./pages/Demonstrativo/DemonstrativoPage"),
);
const LoginPage = lazy(() => import("./pages/Login/LoginPage"));

function ProtectedLayout() {
  const { user } = useAuth();

  return user ? <AppLayout /> : <Navigate to="/login" replace />;
}

export default function App() {
  const { user } = useAuth();

  return (
    <Suspense fallback={<div className="route-loading">Carregando painel...</div>}>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/demonstrativo" replace /> : <LoginPage />}
        />
        <Route element={<ProtectedLayout />}>
          <Route index element={<Navigate to="/demonstrativo" replace />} />
          <Route path="/demonstrativo" element={<DemonstrativoPage />} />
          <Route path="/comunicados" element={<ComunicadosPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
