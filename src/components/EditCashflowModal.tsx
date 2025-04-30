import { useState, useEffect } from 'react';
import { Cashflow, updateCashflow } from '../services/cashflowService';
import { toast } from 'react-toastify';

interface Props {
    open: boolean;
    onClose: () => void;
    onUpdated: () => void;
    cashflow: Cashflow | null;
}

export function EditCashflowModal({ open, onClose, onUpdated, cashflow }: Props) {
    const [data, setData] = useState('');
    const [tipo, setTipo] = useState<'CREDITO' | 'DEBITO'>('CREDITO');
    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState<number>(0);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Preenche os campos do modal com os dados do lançamento a ser editado
    useEffect(() => {
        if (cashflow) {
            setData(cashflow.data);
            setTipo(cashflow.tipo);
            setDescricao(cashflow.descricao);
            setValor(cashflow.valor);
        }
    }, [cashflow]);

    const validateForm = () => {
        const errors: { [key: string]: string } = {};

        if (!data) {
            errors.data = 'Data é obrigatória.';
        }
        if (descricao.length > 200) {
            errors.descricao = 'Descrição não pode ter mais de 200 caracteres.';
        }
        if (valor <= 0 || isNaN(Number(valor))) {
            errors.valor = 'Valor deve ser um número positivo e maior que zero.';
        }

        return errors;
    };

    const handleSubmit = async () => {
        const formErrors = validateForm();

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        try {
            if (cashflow) {
                await updateCashflow(cashflow.id!, { data, tipo, descricao, valor });
                toast.success('Lançamento atualizado com sucesso!');
                onUpdated();
                onClose();
            }
        } catch (error) {
            console.error('Erro ao atualizar lançamento:', error);
            toast.error('Erro ao atualizar lançamento.');
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Editar Lançamento</h2>
                <div className="flex flex-col gap-4">
                    <div>
                        <input
                            type="date"
                            value={data}
                            onChange={(e) => setData(e.target.value)}
                            className="border p-2 rounded w-full"
                        />
                        {errors.data && <span className="text-red-500 text-sm">{errors.data}</span>}
                    </div>

                    <div>
                        <select
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value as 'CREDITO' | 'DEBITO')}
                            className="border p-2 rounded w-full"
                        >
                            <option value="CREDITO">Crédito</option>
                            <option value="DEBITO">Débito</option>
                        </select>
                    </div>

                    <div>
                        <textarea
                            maxLength={200}
                            placeholder="Descrição (opcional)"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            className="border p-2 rounded w-full"
                        />
                        {errors.descricao && <span className="text-red-500 text-sm">{errors.descricao}</span>}
                    </div>

                    <div>
                        <input
                            type="number"
                            placeholder="Valor"
                            value={valor}
                            onChange={(e) => setValor(Number(e.target.value))}
                            className="border p-2 rounded w-full"
                        />
                        {errors.valor && <span className="text-red-500 text-sm">{errors.valor}</span>}
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Atualizar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
