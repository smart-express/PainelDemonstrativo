import { useState, type FormEvent } from "react";
import {
  ArrowForwardRounded,
  LockOutlined,
  PersonOutlineRounded,
} from "@mui/icons-material";
import { Alert, Button, InputAdornment, TextField } from "@mui/material";
import { useAuth } from "../../auth/AuthContext";
import { login } from "./service";
import "./LoginPage.css";

export default function LoginPage() {
  const { login: authenticate } = useAuth();
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await login({ cpf, senha });
      authenticate({
        accessToken: response.access_token,
        tokenType: response.token_type,
        user: {
          id: response.promotor.id,
          name: response.promotor.nome,
          email: response.promotor.email,
        },
        demonstrativo: response.demonstrativo,
      });
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Não foi possível acessar. Tente novamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="cpf">CPF / Usuário</label>
          <TextField
            autoComplete="username"
            autoFocus
            fullWidth
            id="cpf"
            onChange={(event) => setCpf(event.target.value)}
            placeholder="Digite seu CPF ou usuário"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineRounded />
                  </InputAdornment>
                ),
              },
            }}
            type="text"
            value={cpf}
          />

          <label htmlFor="password">Senha</label>
          <TextField
            autoComplete="current-password"
            fullWidth
            id="password"
            onChange={(event) => setSenha(event.target.value)}
            placeholder="Digite sua senha"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined />
                  </InputAdornment>
                ),
              },
            }}
            type="password"
            value={senha}
          />

          {error && (
            <Alert className="login-error" severity="error">
              {error}
            </Alert>
          )}

          <Button
            className="login-submit"
            endIcon={<ArrowForwardRounded />}
            disabled={isSubmitting}
            fullWidth
            type="submit"
            variant="contained"
          >
            {isSubmitting ? "Acessando..." : "Entrar no painel"}
          </Button>
        </form>
      </section>
    </main>
  );
}
