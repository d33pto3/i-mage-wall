import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, Globe } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <div className="pt-32 pb-20 px-6 md:px-12 max-w-[1000px] mx-auto min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full">
            <Shield size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Data Security</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-[var(--text-primary)]">Privacy Policy</h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl">
            At I-MAGE-WALL, we prioritize your visual intellectual property and digital footprint. This policy outlines how we handle your data across our architecture.
          </p>
        </div>

        <div className="grid gap-8">
          {[
            {
              icon: Lock,
              title: "Data Sovereignty",
              content: "All images uploaded to our infrastructure remain your exclusive property. We do not claim ownership of any assets injected into the wall."
            },
            {
              icon: Eye,
              title: "Selective Visibility",
              content: "You control the visibility of your assets. By default, assets are private. Marking an asset as 'Public' makes it discoverable on the Global Feed."
            },
            {
              icon: Globe,
              title: "Remote Assets",
              content: "For linked remote assets, we only store the reference URL. We do not download or host copies of images linked via the 'Remote Injection' system."
            },
            {
              icon: FileText,
              title: "Information Collection",
              content: "We collect basic authentication data via Google Sign-In to manage your studio workspace and protect your assets from unauthorized access."
            }
          ].map((item, i) => (
            <div key={i} className="glass rounded-[2rem] p-8 border border-white/10 group hover:border-[var(--accent-color)]/30 transition-all">
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] group-hover:bg-[var(--accent-color)] group-hover:text-white transition-all">
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
            Last updated: January 2026. For inquiries regarding your data, please contact the network administrator.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Privacy;
