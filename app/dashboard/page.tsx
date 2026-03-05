"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "../services/Api";
import { useRouter } from "next/navigation";
import { 
  LogOut, PlusCircle, Wallet, ArrowUpCircle, User as UserIcon, 
  Loader2, Eye, EyeOff, Trash2, Edit2, Check, X 
} from "lucide-react";
import "./dashboard.css";

export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState("Usuário");
  const [balance, setBalance] = useState<number>(0);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  
  const [newAmount, setNewAmount] = useState("");
  const [expenseDesc, setExpenseDesc] = useState("");
  const [expenseValue, setExpenseValue] = useState("");

  // --- ESTADOS PARA EDIÇÃO ---
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDesc, setEditDesc] = useState("");
  const [editValue, setEditValue] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const [resExp, resBal] = await Promise.all([
        api.get("/users/expense"),
        api.get("/users/balance")
      ]);

      setExpenses(resExp.data || []);
      const saldoFinal = typeof resBal.data === 'object' ? resBal.data.saldo : resBal.data;
      setBalance(Number(saldoFinal) || 0);

      if (resBal.data && resBal.data.name) {
        setUserName(resBal.data.name);
      }
    } catch (error: any) {
      if (error.response?.status === 403) handleLogout();
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  // --- FUNÇÕES DE AÇÃO (CORRIGIDAS) ---

  // Prepara os inputs com os dados atuais da despesa
  const startEdit = (expense: any) => {
    setEditingId(expense.id);
    setEditDesc(expense.description);
    setEditValue(expense.amount.toString());
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm("Deseja realmente excluir esta despesa?")) return;
    try {
      await api.delete(`/users/expense/${id}`); 
      fetchData();
    } catch (error) {
      alert("Erro ao deletar despesa.");
    }
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await api.put(`/users/expense/${id}`, {
        description: editDesc,
        amount: Number(editValue)
      });
      setEditingId(null);
      fetchData();
    } catch (error) {
      alert("Erro ao atualizar despesa.");
    }
  };

  const handleAddBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmount || Number(newAmount) <= 0) return;
    try { 
      await api.post("/users/adicionarsaldo", { valor: Number(newAmount) });
      setNewAmount("");
      fetchData();
    } catch (erro) { alert("Erro ao adicionar saldo."); }
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseDesc || !expenseValue || Number(expenseValue) <= 0) return;
    try {
      await api.post("/users/expense", { description: expenseDesc, amount: Number(expenseValue) });
      setExpenseDesc(""); setExpenseValue("");
      fetchData();
    } catch (error: any) { alert("Erro ao cadastrar despesa."); }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <Loader2 className="animate-spin text-purple-500" size={48} />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="header-glass">
        <div className="flex items-center gap-4">
          <div className="user-avatar"><UserIcon size={24} /></div>
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-tighter">Finanças</p>
            <h2 className="text-xl font-bold">{userName}</h2>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn"><LogOut size={18} /> <span>Sair</span></button>
      </header>

      <main className="main-content">
        <div className="space-y-6">
          <div className="balance-card">
            <div className="flex justify-between items-start">
              <Wallet size={28} />
              <button onClick={() => setShowBalance(!showBalance)} className="opacity-70 hover:opacity-100">
                {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-purple-100/70 mt-4">Saldo Total</p>
            <h3 className="text-3xl font-black">
              {showBalance ? `R$ ${balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : "••••••"}
            </h3>
          </div>

          <div className="glass-form-card">
            <h4 className="card-title text-purple-300"> <ArrowUpCircle size={18} /> Depósito </h4>
            <form onSubmit={handleAddBalance} className="flex flex-col gap-3">
              <input type="number" placeholder="0,00" className="input-field" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} step="0.01" />
              <button className="btn-primary bg-purple-600">Depositar</button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="glass-form-card">
            <h4 className="card-title text-blue-300"> <PlusCircle size={18} /> Novo Gasto </h4>
            <form onSubmit={handleCreateExpense} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input type="text" placeholder="Descrição" className="input-field md:col-span-1" value={expenseDesc} onChange={(e) => setExpenseDesc(e.target.value)} />
              <input type="number" placeholder="R$ 0,00" className="input-field" value={expenseValue} onChange={(e) => setExpenseValue(e.target.value)} step="0.01" />
              <button className="btn-primary bg-blue-600">Registrar</button>
            </form>
          </div>

          <div className="history-card">
            <div className="history-header">
              <h4 className="font-bold">Extrato Recente</h4>
              <span className="count-badge">{expenses.length} itens</span>
            </div>
            <div className="table-container custom-scrollbar">
              <table className="w-full">
                <tbody>
                  {expenses.map((expense, i) => (
                    <tr key={expense.id || i} className="table-row group">
                      <td className="p-4">
                        {editingId === expense.id ? (
                          <input 
                            className="input-field-sm" 
                            value={editDesc} 
                            onChange={(e) => setEditDesc(e.target.value)} 
                          />
                        ) : (
                          <span className="text-slate-300">{expense.description}</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {editingId === expense.id ? (
                          <input 
                            type="number" 
                            className="input-field-sm w-24" 
                            value={editValue} 
                            onChange={(e) => setEditValue(e.target.value)} 
                          />
                        ) : (
                          <span className="text-red-400 font-bold">- R$ {Number(expense.amount).toFixed(2)}</span>
                        )}
                      </td>
                      <td className="p-4 text-right w-24">
                        <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          {editingId === expense.id ? (
                            <>
                              <button onClick={() => handleSaveEdit(expense.id)} className="text-green-400 hover:scale-110">
                                <Check size={18} />
                              </button>
                              <button onClick={() => setEditingId(null)} className="text-gray-400 hover:scale-110">
                                <X size={18} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => startEdit(expense)} className="text-blue-400 hover:scale-110">
                                <Edit2 size={18} />
                              </button>
                              <button onClick={() => handleDeleteExpense(expense.id)} className="text-red-500 hover:scale-110">
                                <Trash2 size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}