import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Plus, ArrowRight, User, Sparkles } from 'lucide-react';
import { CALENDAR_EVENTS, TASKS } from '../data/mockData';
import AIInsightPanel from '../components/AIInsightPanel';

const Calendar = () => {
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);

  return (
    <div className="flex h-full bg-white overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden p-16 md:p-32">
        <div className="max-w-960 mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-24 md:mb-40 gap-16">
            <h1 className="text-[24px] md:text-[28px] font-bold text-slate-900 tracking-tight">Calendar & Tasks</h1>
            <div className="flex gap-8 md:gap-12">
               <button 
                  onClick={() => setIsAIPanelOpen(true)}
                  className="lg:hidden flex items-center gap-6 bg-primary text-white px-12 py-8 rounded-12 font-bold text-[13px] shadow-lg shadow-primary/20"
               >
                  <Sparkles size={14} fill="currentColor" />
                  <span>AI</span>
               </button>
               <button className="bg-primary/10 text-primary px-14 md:px-16 py-8 rounded-12 font-bold text-[13px] md:text-[14px] hover:bg-primary/20 transition-all">Add Event</button>
               <button className="bg-slate-100 text-slate-700 px-14 md:px-16 py-8 rounded-12 font-bold text-[13px] md:text-[14px] hover:bg-slate-200 transition-all">Today</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 md:gap-32">
            <div>
              <h2 className="text-[12px] font-bold uppercase tracking-widest text-slate-400 mb-20 px-4">Upcoming Events</h2>
              <div className="space-y-12">
                {CALENDAR_EVENTS.map(event => (
                  <motion.div 
                    key={event.id}
                    whileHover={{ y: -2 }}
                    className="flex items-center justify-between p-16 bg-white border border-slate-200 rounded-20 shadow-sm hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center gap-16">
                      <div className="w-40 h-40 bg-primary/10 rounded-12 flex items-center justify-center text-primary">
                        <CalendarIcon size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-[15px] text-slate-800">{event.title}</h4>
                        <p className="text-[13px] text-slate-500 font-medium">{event.time}</p>
                      </div>
                    </div>
                    <button className="text-primary hover:bg-primary/5 p-8 rounded-full transition-all">
                       <ArrowRight size={18} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-[12px] font-bold uppercase tracking-widest text-slate-400 mb-20 px-4">Suggested Meeting Times</h2>
              <div className="bg-slate-50 border border-slate-100 rounded-24 p-24">
                 <div className="flex flex-wrap gap-12">
                    {[
                      { day: 'Tue', time: '11:00 AM' },
                      { day: 'Thu', time: '3:45 PM' },
                      { day: 'Fri', time: '1:30 PM' }
                    ].map((slot, i) => (
                      <div key={i} className="flex items-center justify-between bg-white border border-slate-200 p-12 rounded-16 w-full hover:border-primary transition-all group cursor-pointer">
                         <div className="flex items-center gap-12">
                            <div className="bg-primary/5 text-primary w-40 py-4 rounded-8 text-center">
                               <span className="block text-[10px] font-bold uppercase">{slot.day}</span>
                               <span className="block text-[14px] font-black leading-none">{slot.time.split(':')[0]}</span>
                            </div>
                            <span className="text-[14px] font-bold text-slate-700">{slot.time}</span>
                         </div>
                         <button className="text-[12px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-all">Add</button>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>

          <div className="mt-48">
             <div className="flex items-center justify-between mb-20">
                <h2 className="text-[12px] font-bold uppercase tracking-widest text-slate-400 px-4">Tasks</h2>
                <button className="text-primary font-bold text-[13px] flex items-center gap-4 hover:underline transition-all">
                   View all tasks
                </button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {TASKS.map(task => (
                  <div key={task.id} className="flex items-center gap-12 p-16 border border-slate-200 rounded-16 bg-white hover:border-slate-300 transition-all">
                     <div className="w-20 h-20 border-2 border-slate-300 rounded-6" />
                     <div className="flex-1">
                        <p className="text-[14px] font-bold text-slate-800">{task.text}</p>
                        <p className="text-[12px] text-slate-400 font-medium">From {task.source}</p>
                     </div>
                  </div>
                ))}
                <div className="flex items-center gap-12 p-12 border border-slate-200 border-dashed rounded-16 bg-slate-50/50">
                   <Plus size={16} className="text-slate-400" />
                   <input 
                      type="text" 
                      placeholder="Add a task..." 
                      className="bg-transparent border-none outline-none text-[14px] flex-1 text-slate-600 font-medium"
                   />
                   <button className="bg-primary text-white px-12 py-6 rounded-8 text-[12px] font-bold">Add Task</button>
                </div>
             </div>
          </div>
        </div>
      </div>

      <AIInsightPanel 
        isOpen={isAIPanelOpen}
        onClose={() => setIsAIPanelOpen(false)}
        mode="detail"
        insights={{
          summary: "A meeting was detected in \"Project Sync?\". Want to add it to your calendar?",
          reply: "You have a free slot Tuesday at 11 AM that matches a pending invite."
        }}
      />
    </div>
  );
};

export default Calendar;
