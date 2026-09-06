import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, X, LogOut, ArrowLeft } from 'lucide-react';

interface ExitConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmExit: () => void;
}

export const ExitConfirmModal: React.FC<ExitConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmExit,
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
    >
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm -z-10" 
        onClick={onClose} 
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-md bg-white border border-stone-200 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col gap-5"
      >
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 transition-colors p-1 rounded-lg cursor-pointer"
          aria-label="Chiudi"
        >
          <X size={20} />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600">
              Conferma Uscita
            </span>
            <h3 className="text-lg font-black text-stone-900 leading-tight">
              Abbandonare la partita?
            </h3>
          </div>
        </div>

        <div className="bg-rose-50/60 border border-rose-100 rounded-2xl p-4 text-stone-700 text-xs sm:text-sm leading-relaxed">
          <p className="font-semibold text-rose-950 mb-1">
            Attenzione: lasciando la partita perderai tutti i tuoi progressi!
          </p>
          <p className="text-stone-600 text-xs leading-relaxed">
            I giorni trascorsi, l'oro accumulato, i punti reputazione, le merci e i potenziamenti del carretto andranno persi e dovrai ricominciare da capo.
          </p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-2.5 pt-1">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <ArrowLeft size={16} />
            Continua a giocare
          </button>
          
          <button
            onClick={onConfirmExit}
            className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-bold rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
          >
            <LogOut size={16} />
            Esci e abbandona
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
