import { api } from "../../services/api";

export interface Comunicado {
  id: string;
  titulo: string;
  mensagem: string;
  publicadoEm: string;
}

export async function getComunicados(): Promise<Comunicado[]> {
  const response = await api.get<Comunicado[]>("/comunicados");
  return response.data;
}
