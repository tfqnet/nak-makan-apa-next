export default function ProgressBar({ current, total }) {
  return (
    <div className="flex items-center gap-2 justify-center mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-2 rounded-full transition-all duration-500 ${
            i < current
              ? 'bg-white w-8'
              : i === current
              ? 'bg-white/80 w-6'
              : 'bg-white/30 w-4'
          }`}
        />
      ))}
    </div>
  );
}
