import type { ReactNode } from "react";
import "./EmptyPage.css";

interface EmptyPageProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function EmptyPage({
  icon,
  title,
  description,
}: EmptyPageProps) {
  return (
    <div className="empty-page">
      <div className="empty-page-illustration">
        <div className="empty-page-icon">{icon}</div>
        <span className="empty-page-orbit empty-page-orbit-one" />
        <span className="empty-page-orbit empty-page-orbit-two" />
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
      <span className="empty-page-footnote">
        As informações serão exibidas aqui quando estiverem disponíveis.
      </span>
    </div>
  );
}
