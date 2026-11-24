export interface PromotorResponse {
  id?: string;
  nome: string;
  cpf?: string;
  email?: string;
  [field: string]: unknown;
}

export interface Demonstrativo {
  id: string;
  nome_arquivo: string;
  periodo: string | null;
  tamanho_bytes: number;
  criado_em: string;
  url_visualizar: string;
  url_download: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: "Bearer";
  promotor: PromotorResponse;
  demonstrativo: Demonstrativo | null;
}

export interface SessionUser {
  id?: string;
  name: string;
  email?: string;
}

export interface AuthSession {
  accessToken: string;
  tokenType: string;
  user: SessionUser;
  demonstrativo: Demonstrativo | null;
}
