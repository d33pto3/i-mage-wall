import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Download, Info, Maximize2, Palette, Shield, Calendar, Camera } from 'lucide-react';
import { IPicture } from '../types';

interface ImageDetailModalProps {
  picture: IPicture | null;
  isOpen: boolean;
  onClose: () => void;
}

const ImageDetailModal: React.FC<ImageDetailModalProps> = ({ picture, isOpen, onClose }) => {
  if (!picture) return null;

  // Mocked EXIF and Color Palette data for "High Fidelity" feel
  const exifData = [
    { label: 'Camera', value: 'Sony A7R IV', icon: Camera },
    { label: 'Lens', value: 'FE 24-70mm F2.8 GM', icon: Info },
    { label: 'Exposure', value: '1/250s f/4.0 ISO 100', icon: Info },
    { label: 'Dimensions', value: '6048 x 4024 px', icon: Maximize2 },
    { label: 'Uploaded', value: 'Oct 24, 2024', icon: Calendar },
    { label: 'Storage', value: '12.4 MB', icon: Shield },
  ];

  const colors = [
    '#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51', '#ABB2BF'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[var(--bg-primary)]/90 backdrop-blur-xl"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-6xl max-h-[90vh] glass rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-10 p-2.5 rounded-full bg-black/10 hover:bg-black/20 text-[var(--text-primary)] transition-all"
            >
              <X size={20} />
            </button>

            {/* Image Preview Area */}
            <div className="w-full md:w-2/3 h-[50vh] md:h-auto bg-[var(--bg-secondary)] flex items-center justify-center overflow-hidden p-6">
              <img 
                src={picture.url} 
                alt={picture.title}
                className="w-full h-full object-contain drop-shadow-2xl rounded-lg"
              />
            </div>

            {/* Content Area */}
            <div className="w-full md:w-1/3 flex flex-col p-8 overflow-y-auto bg-[var(--bg-primary)] border-l border-[var(--border-color)]">
              <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight mb-2 text-[var(--text-primary)]">{picture.title}</h2>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500" />
                  <span className="text-sm text-[var(--text-secondary)]">Pro Collector #1042</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-10">
                <button className="flex-1 bg-[var(--accent-color)] text-white py-3 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all">
                  <Download size={18} />
                  Download
                </button>
                <button className="p-3 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-2xl hover:bg-[var(--border-color)] transition-all active:scale-95">
                  <Share2 size={18} />
                </button>
              </div>

              {/* Color Palette */}
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <Palette size={18} className="text-[var(--text-secondary)]" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]">Color Palette</h3>
                </div>
                <div className="flex gap-2">
                  {colors.map((color, i) => (
                    <motion.div 
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 * i }}
                      className="group relative flex-1"
                    >
                      <div 
                        className="h-12 w-full rounded-xl cursor-copy shadow-sm border border-black/5"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                        {color}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* EXIF Metadata */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Info size={18} className="text-[var(--text-secondary)]" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]">Technical Details</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {exifData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--border-color)]">
                      <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                        <item.icon size={16} />
                        <span className="text-xs font-medium">{item.label}</span>
                      </div>
                      <span className="text-xs font-semibold text-[var(--text-primary)]">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ImageDetailModal;
