import { CampaignOutlined } from "@mui/icons-material";
import EmptyPage from "../../components/EmptyPage/EmptyPage";
import "./ComunicadosPage.css";

export default function ComunicadosPage() {
  return (
    <section className="comunicados-page">
      <div className="comunicados-heading">
        <div>
          <span className="page-eyebrow">FIQUE POR DENTRO</span>
          <h1>Comunicados</h1>
          <p>Novidades e informações importantes para você.</p>
        </div>
      </div>

      <EmptyPage
        description="Quando houver novidades, os comunicados serão exibidos nesta página."
        icon={<CampaignOutlined />}
        title="Nenhum comunicado por enquanto"
      />
    </section>
  );
}
