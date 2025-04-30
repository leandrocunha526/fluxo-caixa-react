import { BalanceData } from "../interfaces/BalanceData";
import dayjs from "dayjs";

interface DailyBalanceTableProps {
    balances: BalanceData[];
}

const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export function DailyBalanceTable({ balances }: DailyBalanceTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
                <thead>
                    <tr className="bg-gray-100 text-gray-700">
                        <th className="px-6 py-3 text-left text-sm font-bold">Data</th>
                        <th className="px-6 py-3 text-left text-sm font-bold">Total Crédito</th>
                        <th className="px-6 py-3 text-left text-sm font-bold">Total Débito</th>
                        <th className="px-6 py-3 text-left text-sm font-bold">Saldo Final</th>
                    </tr>
                </thead>
                <tbody>
                    {balances.map((balance) => (
                        <tr key={balance.data} className="border-t">
                            <td className="px-6 py-4">{dayjs(balance.data).format("DD/MM/YYYY")}</td>
                            <td className="px-6 py-4 text-green-600 font-medium">
                                {formatCurrency(balance.totalCredito)}
                            </td>
                            <td className="px-6 py-4 text-red-600 font-medium">
                                {formatCurrency(balance.totalDebito)}
                            </td>
                            <td className="px-6 py-4 font-bold">
                                {formatCurrency(balance.saldoFinal)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
