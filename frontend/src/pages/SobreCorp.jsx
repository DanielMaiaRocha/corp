const SobreCorp = () => {
    return (
      <div className="max-w-4xl mx-auto py-12 space-y-16 mb-10">
        {/* Vídeo Minimalista */}
        <div className="text-center">
          <video controls className="w-full rounded-sm shadow-lg">
            <source src="/videos/videoDrop.mp4" type="video/mp4" className="rotate-180"/>
            Seu navegador não suporta a exibição de vídeos.
          </video>
          <p className="mt-2 text-sm font-semibold text-gray-600">
            Video de Lançamento do Drop <span className="text-red-600 font-bold">We Made IT</span>
          </p>
        </div>
  
        {/* Segunda Imagem com Texto à Direita */}
        <div className="flex flex-col md:flex-row items-center gap-10">
          <img src="/images/festaCorp.jpg" alt="Foto Grey" className="w-full md:w-[30rem] rounded-sm shadow-md" />
          <p className="md:w-1/2 text-gray-700 font-semibold text-sm leading-relaxed">
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          </p>
        </div>
  
        {/* Texto à Esquerda com Imagem à Direita */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-6">
          <img src="/images/drop1.jpg" alt="Sunday session" className="w-full md:w-1/2 rounded-sm shadow-md" />
          <p className="md:w-1/2 text-gray-700 font-semibold text-sm leading-relaxed">
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          </p>
        </div>
  
       {/* Terceira Imagem com Texto à Direita */}
       <div className="flex flex-col md:flex-row items-center gap-6">
          <img src="/images/Corpirinha.jpg" alt="Foto Grey" className="w-full md:w-1/2 rounded-sm shadow-md" />
          <p className="md:w-1/2 text-gray-700 font-semibold text-sm leading-relaxed">
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          </p>
        </div>


  
      </div>
    );
  };
  
  export default SobreCorp;
  