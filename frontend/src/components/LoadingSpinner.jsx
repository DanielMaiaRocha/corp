const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <img src="/images/logo.png" alt="Logo" className="w-76 h-72 mb-4" />
      <div className="relative">
        <div className="w-20 h-20 border-red-200 border-2 rounded-full" />
        <div className="w-20 h-20 border-red-500 border-t-2 animate-spin rounded-full absolute left-0 top-0" />
        <div className="sr-only">
          <img src="/logo.png" />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
