import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { Cashflow, deleteCashflow, getBalance, getCashflows, getCashflowsByDate } from "./services/cashflowService";
import { BalanceData } from "./interfaces/BalanceData";
import { CashflowTable } from "./components/CashflowTable";
import { CreateCashflowModal } from "./components/CreateflowModal";
import { DailyBalanceTable } from "./components/DailyBalanceTable";
import { EditCashflowModal } from "./components/EditCashflowModal";

export default function Home() {
  const [cashflows, setCashflows] = useState<Cashflow[]>([]);
  const [balances, setBalances] = useState<BalanceData[]>([]);
  const [filterDate, setFilterDate] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCashflow, setSelectedCashflow] = useState<Cashflow | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cashflowsData, balancesData] = await Promise.all([
        getCashflows(),
        getBalance(),
      ]);
      setCashflows(cashflowsData);
      setBalances(balancesData);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      toast.error("Erro ao carregar dados.");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este lançamento?")) {
      try {
        await deleteCashflow(id);
        toast.success("Lançamento excluído!");
        fetchData();
      } catch (error) {
        console.error("Erro ao excluir:", error);
        toast.error("Erro ao excluir lançamento.");
      }
    }
  };

  const handleSearch = async () => {
    try {
      if (filterDate) {
        const cashflowsByDate = await getCashflowsByDate(filterDate);
        setCashflows(cashflowsByDate);
      } else {
        fetchData();
      }
    } catch (error) {
      console.error("Erro na busca:", error);
      toast.error("Erro ao buscar lançamentos.");
    }
  };

  const handleEdit = (cashflow: Cashflow) => {
    setSelectedCashflow(cashflow);
    setEditModalOpen(true);
  };

  const calculateTotalSaldoFinal = () => {
    return balances.reduce((total, balance) => total + (balance.saldoFinal || 0), 0);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800">💸 Controle de Caixa</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-300"
        >
          + Novo Lançamento
        </button>
      </div>

      {/* Filtro por Data */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-2 rounded-lg shadow transition-all"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Saldo */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-700">Saldo</h2>
        <p className="text-2xl text-blue-600 font-semibold">
          {formatCurrency(calculateTotalSaldoFinal())}
        </p>
      </div>

      {/* Tabelas */}
      <div className="space-y-8">
        {/* Lançamentos */}
        <div className="bg-white rounded-lg shadow p-6">
          <CashflowTable cashflows={cashflows} onDelete={handleDelete} onEdit={handleEdit} />
        </div>

        {/* Saldos Diários */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">📊 Saldo Diário</h2>
          <DailyBalanceTable balances={balances} />
        </div>
      </div>

      {/* Modais */}
      <CreateCashflowModal open={modalOpen} onClose={() => setModalOpen(false)} onCreated={fetchData} />
      <EditCashflowModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onUpdated={fetchData}
        cashflow={selectedCashflow}
      />

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
