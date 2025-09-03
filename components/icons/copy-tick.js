import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CopyButton({ textToCopy }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200); // Reset after 1.2s
  };

  return (
    <button onClick={handleCopy} className="relative p-2 rounded hover:scale-110 transition">
      <AnimatePresence initial={false}>
        {!copied ? (
          <motion.svg
            key="copy"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            width="24"
            height="24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" />
          </motion.svg>
        ) : (
          <motion.svg
            key="check"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            width="24"
            height="24"
            fill="none"
            stroke="green"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M5 13l4 4L19 7" />
          </motion.svg>
        )}
      </AnimatePresence>
    </button>
  );
}
