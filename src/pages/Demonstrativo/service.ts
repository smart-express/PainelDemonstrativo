import { api } from "../../services/api";

export async function getDemonstrativoFile(
  url: string,
  accessToken: string,
  tokenType: string,
): Promise<Blob> {
  const response = await api.get<Blob>(url, {
    responseType: "blob",
    headers: {
      Authorization: `${tokenType} ${accessToken}`,
    },
  });
  return response.data;
}
