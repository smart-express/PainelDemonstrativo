import axios from "axios";
import { api } from "../../services/api";
import type { LoginResponse } from "../../types/auth";

export interface LoginCredentials {
  cpf: string;
  senha: string;
}

interface LoginErrorResponse {
  erro?: string;
}

export async function login(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const cpf = credentials.cpf.trim();

  if (!cpf || !credentials.senha) {
    throw new Error("Preencha o CPF/usuário e a senha.");
  }

  try {
    const response = await api.post<LoginResponse>("/api/auth/login/", {
      cpf,
      senha: credentials.senha,
    });

    if (!response.data.access_token || !response.data.promotor?.nome) {
      throw new Error("A resposta do servidor não contém os dados de acesso esperados.");
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError<LoginErrorResponse>(error)) {
      const apiMessage = error.response?.data?.erro;

      if (error.response?.status === 401) {
        throw new Error(apiMessage || "CPF/usuário ou senha inválidos.");
      }

      if (apiMessage) {
        throw new Error(apiMessage);
      }

      if (!error.response) {
        throw new Error("Não foi possível conectar à API. Tente novamente.");
      }
    }

    throw error;
  }
}
