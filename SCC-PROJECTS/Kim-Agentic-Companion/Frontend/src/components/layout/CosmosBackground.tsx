export function CosmosBackground() {
  return (
    <>
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, #3a2c63 0, rgba(58,44,99,0) 35%), " +
            "radial-gradient(circle at 80% 15%, #723f7e 0, rgba(114,63,126,0) 33%), " +
            "linear-gradient(160deg, #050714, #13182f)",
        }}
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(2px 2px at 15% 25%, rgba(255,255,255,0.5), transparent 80%), " +
            "radial-gradient(1.5px 1.5px at 75% 14%, rgba(114,255,245,0.5), transparent 80%), " +
            "radial-gradient(1.5px 1.5px at 30% 80%, rgba(255,114,159,0.45), transparent 80%), " +
            "radial-gradient(2px 2px at 64% 70%, rgba(255,255,255,0.34), transparent 80%)",
          animation: "drift 28s linear infinite",
        }}
        aria-hidden="true"
      />
    </>
  );
}