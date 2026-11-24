import {
  DownloadOutlined,
  PictureAsPdfOutlined,
} from "@mui/icons-material";
import { Alert, Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import EmptyPage from "../../components/EmptyPage/EmptyPage";
import { getDemonstrativoFile } from "./service";
import "./DemonstrativoPage.css";

export default function DemonstrativoPage() {
  const { session } = useAuth();
  const demonstrativo = session?.demonstrativo;
  const previewSourceUrl = demonstrativo?.url_visualizar;
  const accessToken = session?.accessToken;
  const tokenType = session?.tokenType;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const [downloadError, setDownloadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    setPreviewUrl(null);
    setPreviewError("");

    if (!previewSourceUrl || !accessToken || !tokenType) {
      setIsPreviewLoading(false);
      return;
    }

    setIsPreviewLoading(true);

    getDemonstrativoFile(
      previewSourceUrl,
      accessToken,
      tokenType,
    )
      .then((file) => {
        objectUrl = URL.createObjectURL(file);

        if (cancelled) {
          URL.revokeObjectURL(objectUrl);
          return;
        }

        setPreviewUrl(objectUrl);
      })
      .catch(() => {
        if (!cancelled) {
          setPreviewError(
            "Não foi possível exibir o demonstrativo. Você ainda pode tentar baixá-lo.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsPreviewLoading(false);
        }
      });

    return () => {
      cancelled = true;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [
    previewSourceUrl,
    accessToken,
    tokenType,
  ]);

  async function handleDownload() {
    if (!demonstrativo || !session) {
      return;
    }

    setDownloadError("");
    setIsDownloading(true);

    try {
      const file = await getDemonstrativoFile(
        demonstrativo.url_download,
        session.accessToken,
        session.tokenType,
      );
      const objectUrl = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = demonstrativo.nome_arquivo;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch {
      setDownloadError("Não foi possível baixar o demonstrativo. Tente novamente.");
    } finally {
      setIsDownloading(false);
    }
  }

  function formatFileSize(bytes: number): string {
    if (!Number.isFinite(bytes) || bytes <= 0) {
      return "0 B";
    }

    const units = ["B", "KB", "MB", "GB"];
    const unitIndex = Math.min(
      Math.floor(Math.log(bytes) / Math.log(1024)),
      units.length - 1,
    );
    const size = bytes / 1024 ** unitIndex;

    return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
  }

  function formatDate(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat("pt-BR").format(date);
  }

  return (
    <section className="demonstrativo-page">
      <div className="demonstrativo-heading">
        <div>
          <span className="page-eyebrow">VISÃO GERAL</span>
          <h1>Demonstrativo</h1>
          <p>Acompanhe seus demonstrativos.</p>
        </div>
      </div>

      {demonstrativo ? (
        <>
          <article className="demonstrativo-document">
            <div className="demonstrativo-document-icon">
              <PictureAsPdfOutlined />
            </div>
            <div className="demonstrativo-document-details">
              <h2>{demonstrativo.nome_arquivo}</h2>
              <span>
                Período: {demonstrativo.periodo || "Não informado"}
              </span>
              <span>Criado em: {formatDate(demonstrativo.criado_em)}</span>
              <span>{formatFileSize(demonstrativo.tamanho_bytes)}</span>
            </div>
            <div className="demonstrativo-document-actions">
              <Button
                disabled={isDownloading}
                onClick={handleDownload}
                startIcon={
                  isDownloading ? (
                    <CircularProgress size={16} />
                  ) : (
                    <DownloadOutlined />
                  )
                }
                variant="contained"
              >
                {isDownloading ? "Baixando..." : "Baixar PDF"}
              </Button>
            </div>
          </article>

          {downloadError && <Alert severity="error">{downloadError}</Alert>}

          <section
            aria-label="Visualização do demonstrativo"
            className="demonstrativo-preview-panel"
          >
            {isPreviewLoading && (
              <div className="demonstrativo-preview-loading">
                <CircularProgress size={24} />
                <span>Carregando demonstrativo...</span>
              </div>
            )}
            {previewError && <Alert severity="error">{previewError}</Alert>}
            {previewUrl && (
            <iframe
              className="demonstrativo-preview"
              src={previewUrl}
              title={`Visualização de ${demonstrativo.nome_arquivo}`}
            />
            )}
          </section>
        </>
      ) : (
        <EmptyPage
          description="Sua conta ainda não possui um demonstrativo disponível."
          icon={<PictureAsPdfOutlined />}
          title="Nenhum demonstrativo disponível"
        />
      )}
    </section>
  );
}
