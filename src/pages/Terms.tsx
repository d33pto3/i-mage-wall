import React from 'react';
import { motion } from 'framer-motion';
import { FileCheck, ShieldAlert, Cpu, Share2, Layers } from 'lucide-react';

const Terms: React.FC = () => {
  return (
    <div className="pt-32 pb-20 px-6 md:px-12 max-w-[1000px] mx-auto min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full">
            <FileCheck size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Service Protocol</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-[var(--text-primary)]">Terms of Service</h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl">
            By accessing the I-MAGE-WALL architecture, you agree to abide by the following operational protocols to maintain the integrity of the discovery wall.
          </p>
        </div>

        <div className="grid gap-8">
          {[
            {
              icon: ShieldAlert,
              title: "Ethical Injection",
              content: "Users are prohibited from injecting assets that contain illegal, offensive, or copyright-violating content. We reserve the right to remove any asset without prior notification."
            },
            {
              icon: Cpu,
              title: "System Integrity",
              content: "Any attempt to reverse-engineer, bypass limitations, or overload the I-MAGE-WALL infrastructure is strictly prohibited."
            },
            {
              icon: Layers,
              title: "Tier Restrictions",
              content: "The free tier is limited to 3 physical file uploads. Remote linked assets are unlimited but must follow the content guidelines."
            },
            {
              icon: Share2,
              title: "Global Distribution",
              content: "Assets marked as 'Public' may be distributed across the global discovery feed and are viewable by all network participants."
            }
          ].map((item, i) => (
            <div key={i} className="glass rounded-[2rem] p-8 border border-white/10 group hover:border-amber-500/30 transition-all">
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] group-hover:bg-amber-500 group-hover:text-white transition-all">
                  <item.icon size={24} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">{item.title}</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    {item.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-10 border-t border-[var(--border-color)]">
          <p className="text-sm text-[var(--text-secondary)] opacity-50">
            Version 1.0.1. Operating under global digital distribution standards.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Terms;
