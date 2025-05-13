const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="h-full min-h-screen flex items-center justify-center px-8 py-12 relative overflow-hidden">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

      {/* Subtle Icon Grid Pattern */}
      <div className="absolute inset-0 grid grid-cols-3 gap-3 p-3 opacity-5">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className={`aspect-square rounded-3xl bg-primary ${
              i % 3 === 0 ? "animate-pulse" : ""
            }`}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-md space-y-6">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tight">
          {title}
        </h2>
        <p className="text-base-content/80 text-base leading-relaxed">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
