export default function Navbar({ onHistoryClick, onAboutClick, historyCount }) {
  return (
    <div className="flex items-center justify-between px-5 pt-5 pb-2 w-full max-w-md mx-auto">
      <button
        onClick={onAboutClick}
        className="text-white/70 hover:text-white transition-colors text-sm font-medium"
      >
        About
      </button>

      <span className="text-white/50 text-xs font-semibold tracking-widest uppercase">
        Nak Makan Apa?
      </span>

      <button
        onClick={onHistoryClick}
        className="relative text-white/70 hover:text-white transition-colors"
        aria-label="View history"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {historyCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-white text-gray-800 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {historyCount > 9 ? '9+' : historyCount}
          </span>
        )}
      </button>
    </div>
  );
}
