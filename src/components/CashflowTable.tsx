import dayjs from "dayjs";
import { Cashflow } from "../services/cashflowService";

interface Props {
  cashflows: Cashflow[];
  onDelete: (id: number) => void;
  onEdit: (cashflow: Cashflow) => void;
}

export function CashflowTable({ cashflows, onDelete, onEdit }: Props) {
  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-2">Lançamentos</h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Data</th>
            <th className="border p-2">Tipo</th>
            <th className="border p-2">Descrição</th>
            <th className="border p-2">Valor</th>
            <th className="border p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {cashflows.map((c) => (
            <tr key={c.id}>
              <td className="border p-2">
                {dayjs(c.data).format("DD/MM/YYYY")}
              </td>
              <td className="border p-2">
                {c.tipo === "CREDITO" ? "Crédito" : "Débito"}
              </td>
              <td className="border p-2">{c.descricao}</td>
              <td className="border p-2">
                {c.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </td>
              <td className="border p-2 flex gap-2 justify-center">
                <button
                  onClick={() => onEdit(c)}
                  className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(c.id!)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
          {cashflows.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center p-4">
                Nenhum lançamento encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
