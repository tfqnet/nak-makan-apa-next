import { useState } from 'react';
import { motion } from 'framer-motion';

const APP_VERSION = '2.0.0';

export default function AboutPage({ onBack }) {
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState(null); // null | 'sending' | 'sent' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setStatus('sending');

    try {
      const form = new FormData();
      form.append('feedback', feedback);
      form.append('version', APP_VERSION);
      form.append('timestamp', new Date().toLocaleString());
      form.append('_subject', `Feedback - Nak Makan Apa v${APP_VERSION}`);
      form.append('_captcha', 'false');
      form.append('_template', 'table');

      const res = await fetch('https://formsubmit.co/tfqnet@gmail.com', {
        method: 'POST',
        body: form,
      });

      if (res.ok) {
        setStatus('sent');
        setFeedback('');
      } else {
        throw new Error();
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col">
      <div className="flex items-center px-5 pt-6 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Balik
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto space-y-4"
        >
          {/* Header */}
          <div className="text-center py-4">
            <span className="text-5xl">🍽️</span>
            <h1 className="text-2xl font-black text-white mt-3">Nak Makan Apa?</h1>
            <p className="text-white/60 text-sm mt-1">v{APP_VERSION} · by Taufiq Tomadan</p>
          </div>

          {/* Info card */}
          <div className="bg-white rounded-2xl p-5">
            <h2 className="font-black text-gray-800 text-base mb-3">Pasal App Ni 🤔</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              "Nak Makan Apa?" tolong kau decide nak makan apa bila dah blur sangat.
              Jawab 3 soalan mudah pasal mood lapar, tahap pedas, dan bajet kau —
              app ni suggest makanan yang sesuai!
            </p>
          </div>

          {/* Features card */}
          <div className="bg-white rounded-2xl p-5">
            <h2 className="font-black text-gray-800 text-base mb-3">Features ✨</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              {[
                ['🍜', '7 kategori makanan — Mamak, Western, Thai, Chinese, Japanese, Fast Food & Indian'],
                ['🎰', 'Slot machine reveal yang fun!'],
                ['📋', 'History semua pilihan kau'],
                ['📤', 'Share result dengan member via WhatsApp'],
                ['📱', 'PWA — boleh install macam app'],
              ].map(([emoji, text]) => (
                <li key={text} className="flex gap-2 items-start">
                  <span>{emoji}</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Feedback card */}
          <div className="bg-white rounded-2xl p-5">
            <h2 className="font-black text-gray-800 text-base mb-3">Send Feedback 💌</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Ada cadangan? Bug? Makanan yang nak kita tambah?"
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                type="submit"
                disabled={status === 'sending' || !feedback.trim()}
                className={`w-full py-3 rounded-xl font-bold text-sm text-white transition-colors ${
                  status === 'sending' || !feedback.trim()
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-indigo-500 hover:bg-indigo-600'
                }`}
              >
                {status === 'sending' ? 'Sending...' : 'Send Feedback'}
              </button>
              {status === 'sent' && (
                <p className="text-emerald-500 text-sm text-center font-medium">
                  ✅ Terima kasih! Feedback dah sampai.
                </p>
              )}
              {status === 'error' && (
                <p className="text-red-500 text-sm text-center font-medium">
                  ❌ Tak berjaya. Cuba lagi nanti.
                </p>
              )}
            </form>
          </div>

          <p className="text-center text-white/50 text-xs pb-4">
            Made with ❤️ for Malaysian food lovers
          </p>
        </motion.div>
      </div>
    </div>
  );
}
