import {
  ArticleOutlined,
  CampaignOutlined,
  ChevronRightRounded,
  LogoutRounded,
  SpaceDashboardOutlined,
} from "@mui/icons-material";
import { Avatar, Button, Tooltip } from "@mui/material";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import "./AppLayout.css";

const navigation = [
  {
    label: "Demonstrativo",
    path: "/demonstrativo",
    icon: <SpaceDashboardOutlined />,
  },
  {
    label: "Comunicados",
    path: "/comunicados",
    icon: <CampaignOutlined />,
  },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const currentPage =
    navigation.find((item) => item.path === location.pathname)?.label ??
    "Painel";
  const initials = user?.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink className="brand" to="/demonstrativo" aria-label="Painel inicial">
          <span className="brand-mark">
            <ArticleOutlined />
          </span>
          <span className="brand-copy">
            <strong>painel</strong>
          </span>
        </NavLink>

        <div className="sidebar-section-label">MENU PRINCIPAL</div>
        <nav className="sidebar-navigation" aria-label="Menu principal">
          {navigation.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `sidebar-link${isActive ? " is-active" : ""}`
              }
              key={item.path}
              to={item.path}
            >
              {item.icon}
              <span>{item.label}</span>
              <ChevronRightRounded className="sidebar-link-chevron" />
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <div className="breadcrumb">
            <strong>{currentPage}</strong>
          </div>
          <div className="topbar-user">
            <div className="topbar-user-copy">
              <strong>{user?.name || "Usuário"}</strong>
            </div>
            <Tooltip title={user?.email || ""}>
              <Avatar className="user-avatar">{initials || "U"}</Avatar>
            </Tooltip>
            <Button
              aria-label="Sair da conta"
              className="logout-button"
              onClick={logout}
              startIcon={<LogoutRounded />}
              variant="text"
            >
              Sair
            </Button>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
