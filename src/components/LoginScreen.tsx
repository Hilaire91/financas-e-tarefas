import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, ShieldAlert, AlertCircle } from "lucide-react";
import { supabase } from "../lib/supabase";

interface LoginScreenProps {
  onSuccess: (name: string, userId: string) => void;
  isDarkMode: boolean;
}

export default function LoginScreen({ onSuccess, isDarkMode }: LoginScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // User metadata might have name, if not default to email prefix
        const userName = data.user?.user_metadata?.full_name || email.split('@')[0];
        onSuccess(userName, data.user.id);
      } else {
        if (!name.trim()) {
          throw new Error("Por favor, insira seu nome");
        }
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            }
          }
        });
        if (error) throw error;
        
        if (data.session) {
           onSuccess(name, data.user!.id);
        } else {
           setError("Cadastro realizado! Verifique seu email para confirmar.");
        }
      }
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro na autenticação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center font-sans ${isDarkMode ? "bg-[#090C15] text-gray-100" : "bg-gray-100 text-gray-900"}`}>
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full blur-[100px] ${isDarkMode ? "bg-violet-900/20" : "bg-violet-300/30"}`} />
        <div className={`absolute bottom-[10%] -right-[10%] w-[30%] h-[40%] rounded-full blur-[120px] ${isDarkMode ? "bg-blue-900/20" : "bg-blue-300/30"}`} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`relative z-10 w-full max-w-sm p-8 rounded-3xl shadow-2xl border ${isDarkMode ? "bg-[#111827]/80 border-gray-800 backdrop-blur-xl" : "bg-white/80 border-gray-200 backdrop-blur-xl"}`}
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-violet-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/30">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1 className="font-display text-2xl font-extrabold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            Finanças&Tarefas
          </h1>
          <p className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            {isLogin ? "Acesse sua conta para continuar" : "Crie sua conta"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span className="flex-1">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col w-full">
          <div className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className={`w-full py-3 px-4 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-violet-500 ${isDarkMode ? "bg-gray-800/80 border-gray-700 text-white" : "bg-gray-100 border-gray-300 text-gray-900"}`}
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu email"
                className={`w-full py-3 pl-10 pr-4 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-violet-500 ${isDarkMode ? "bg-gray-800/80 border-gray-700 text-white" : "bg-gray-100 border-gray-300 text-gray-900"}`}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                className={`w-full py-3 pl-10 pr-4 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-violet-500 ${isDarkMode ? "bg-gray-800/80 border-gray-700 text-white" : "bg-gray-100 border-gray-300 text-gray-900"}`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-md hover:brightness-110 disabled:opacity-50 cursor-pointer transition-all"
          >
            {loading ? "Processando..." : (isLogin ? "Entrar" : "Cadastrar-se")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(null); }}
            className={`text-xs hover:underline cursor-pointer ${isDarkMode ? 'text-violet-400' : 'text-violet-600'}`}
          >
            {isLogin ? "Não possui conta? Cadastre-se" : "Já tem conta? Entrar"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
