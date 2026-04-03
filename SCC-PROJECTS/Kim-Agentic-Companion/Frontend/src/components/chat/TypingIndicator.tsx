export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-2 self-start bg-[rgba(111,130,240,0.2)] border border-[rgba(146,161,252,0.3)] rounded-2xl rounded-tl-sm">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[#a8aed3] inline-block"
          style={{
            animation: "typing-dot 1.2s ease-in-out infinite",
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}