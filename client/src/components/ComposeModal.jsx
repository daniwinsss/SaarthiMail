import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Save, Clock, Sparkles, Wand2, ArrowRight } from 'lucide-react';
import { cn } from '../utils/cn';

const ComposeModal = ({ isOpen, onClose }) => {
  const [tone, setTone] = useState('Professional');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-24">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full h-full md:h-[720px] md:max-w-960 bg-white md:rounded-32 shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10"
          >
            <div className="flex-1 flex flex-col min-w-0 h-full">
              <div className="h-64 border-b border-slate-100 flex items-center justify-between px-24 shrink-0">
                <h3 className="text-[16px] font-bold text-slate-900">New Message</h3>
                <button onClick={onClose} className="p-8 hover:bg-slate-100 rounded-full transition-all text-slate-400">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-24 space-y-20 custom-scrollbar">
                <div className="flex items-center gap-16 border-b border-slate-100 pb-12">
                   <span className="text-[14px] font-bold text-slate-400 w-44 md:w-64 shrink-0">To</span>
                   <div className="flex flex-wrap gap-8 items-center flex-1">
                      <input type="text" className="border-none outline-none flex-1 text-[14px] min-w-120" placeholder="recipient@email.com" />
                   </div>
                </div>
                <div className="flex items-center gap-16 border-b border-slate-100 pb-12">
                   <span className="text-[14px] font-bold text-slate-400 w-44 md:w-64 shrink-0">Subject</span>
                   <input 
                      type="text" 
                      className="border-none outline-none flex-1 text-[14px] font-bold text-slate-900" 
                      placeholder="Subject"
                   />
                </div>
                <textarea 
                   placeholder="Write your message..."
                   className="w-full flex-1 resize-none border-none outline-none text-[15px] text-slate-700 min-h-[200px] md:min-h-[400px]"
                />
              </div>

              <div className="p-20 border-t border-slate-100 bg-white flex items-center justify-between shrink-0">
                <div className="flex gap-10">
                   <button className="bg-slate-100 text-slate-400 px-20 md:px-24 py-10 md:py-12 rounded-12 md:rounded-16 font-bold text-[14px] md:text-[15px] flex items-center gap-8 md:gap-10 cursor-not-allowed">
                      <Send size={18} />
                      <span>Send (Unsupported)</span>
                   </button>
                   <button className="bg-primary text-white px-12 md:px-16 py-10 md:py-12 rounded-12 md:rounded-16 font-bold text-[14px] md:text-[15px] hover:brightness-110 transition-all flex items-center gap-6 md:gap-8 shadow-lg shadow-primary/20">
                      <Save size={18} />
                      <span>Save Draft</span>
                   </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ComposeModal;
