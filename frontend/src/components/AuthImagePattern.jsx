

const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-6"> 
      <div className="max-w-xs text-center"> 
        <div className="grid grid-cols-3 gap-2 mb-4"> 
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-xl bg-primary/10 ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
            />
          ))}
        </div>
        <h2 className="text-lg font-bold mb-2">{title}</h2> 
        <p className="text-sm text-base-content/60">{subtitle}</p> 
      </div>
    </div>
  );
};

export default AuthImagePattern;
