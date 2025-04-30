import api from "./api";

export interface Cashflow {
  id?: number;
  data: string;
  tipo: "CREDITO" | "DEBITO";
  descricao: string;
  valor: number;
}

export const getCashflows = async () => {
  const response = await api.get<Cashflow[]>(`/lancamentos`);
  return response.data;
};

export const createCashflow = async (cashflow: Cashflow) => {
  const response = await api.post(`/criar`, cashflow);
  return response.data;
};

export const getBalance = async () => {
  const response = await api.get<[]>(`/saldo`);
  return response.data;
};

export const deleteCashflow = async (id: number) => {
  const response = await api.delete(`/delete/${id}`);
  return response.data;
};

export const updateCashflow = async (id: number, cashflow: Cashflow) => {
  const response = await api.put(`/lancamento/${id}`, cashflow);
  return response.data;
};

export const getCashflowById = async (id: number) => {
  const response = await api.get<Cashflow>(`/lancamento/${id}`);
  return response.data;
};

export const getCashflowsByDate = async (date: string) => {
  const response = await api.get<Cashflow[]>(`/lancamento`, {
    params: { data: date },
  });
  return response.data;
};
