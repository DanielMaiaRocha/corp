const SobreCorp = () => {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-20 mb-20">
      {/* Imagem com Texto à Direita */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex flex-col items-center">
          <img
            src="/images/drop1.jpg"
            alt="Foto Grey"
            className="w-full md:w-[90%] rounded-sm shadow-md"
          />
          <p className="mt-2 text-sm font-semibold text-gray-600 text-center">
            Vídeo de lançamento do Drop{" "}
            <span className="text-red-600 font-bold">We Made IT</span>
          </p>
        </div>
        <p className="w-full  text-gray-700 font-semibold text-sm leading-relaxed text-center md:text-left px-4 md:mt-72">
          O nome “CORP” é a abreviação de CREATIVE CORPORATION. A corporação é
          um sinônimo de sociedade, liga, time, aliança ou organização. Criada
          para unir , expressar e protestar, a Corp procura evidenciar a
          importância de um time para um crescimento social e mental. Nosso
          símbolo é um troféu pois representa a vitória do coletivo e ressalta
          que vencer com amigos e companheiros é melhor. Criada em 2022 e
          lançada em 2024 no subúrbio do Rio de Janeiro , Jean Leandro, carioca
          nascido em 2003 busca apresentar elementos visuais do seu cotidiano em
          forma de estampas coloridas ou não, moldes simples ou extravagantes e
          ativações de rua que impactam o público ao redor
        </p>
      </div>

      {/* Texto à Esquerda com Imagem à Direita */}
      <div className="flex flex-col md:flex-row-reverse items-center gap-6">
        <div className="flex flex-col items-center ">
          <img
            src="/images/corp7.jpeg"
            alt="Sunday session"
            className="w-full md:w-[58%] rounded-sm shadow-md"
          />
          <p className="mt-2 text-sm font-semibold text-gray-600 text-center">
            Vídeo de lançamento do Drop{" "}
            <span className="text-red-600 font-bold">We Made IT</span>
          </p>
        </div>
        <p className="max-w-full text-gray-700 font-semibold text-sm leading-relaxed text-center md:text-left px-4 sm:mt-72">
          Com uma narrativa coloquial, a Corp abraça as ruas e busca transmitir
          vibrações positivas e procura se conectar com seu público através de
          estampas ou modelagens, fazendo alusão à acontecimentos passados ou
          atuais.
        </p>
      </div>

      {/* Terceira Imagem com Texto à Direita */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex flex-col items-center">
          <img
            src="/images/corp5.jpeg"
            alt="Foto Grey"
            className="w-full md:w-[90%] rounded-sm shadow-md"
          />
          <p className="mt-2 text-sm font-semibold text-gray-600 text-center">
            Vídeo de lançamento do Drop{" "}
            <span className="text-red-600 font-bold">We Made IT</span>
          </p>
        </div>
        <p className="w-full  text-gray-700 font-semibold text-sm leading-relaxed text-center md:text-left px-4 sm:mt-64">
          O jogo de cores em determinadas peças é marcante pois fica na memória
          e faz parte do conceito. Nenhuma cor é por acaso, são escolhidas à
          dedo e possuem um significado.
        </p>
      </div>
      <div className="flex flex-col md:flex-row-reverse items-center gap-6">
        <div className="flex flex-col items-center">
          <img
            src="/images/corp6.jpeg"
            alt="Sunday session"
            className="w-full md:w-[55%] rounded-sm shadow-md"
          />
          <p className="mt-2 text-sm font-semibold text-gray-600 text-center">
            Vídeo de lançamento do Drop{" "}
            <span className="text-red-600 font-bold">We Made IT</span>
          </p>
        </div>
        <p className="max-w-full  text-gray-700 font-semibold text-sm leading-relaxed text-center md:text-left px-4 sm:mt-80">
          A corp busca levar autoestima e amor próprio para quem faz parte do
          time, moldes que preservam e valorizam seus corpos, independentemente
          da forma, a Corp busca engrandecer a beleza e enaltecer as diferenças
          individuais.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex flex-col items-center">
          <img
            src="/images/festaCorp.jpg"
            alt="Foto Grey"
            className="w-full md:w-[520%] rounded-sm shadow-md"
          />
          <p className="mt-2 text-sm font-semibold text-gray-600 text-center">
            Vídeo de lançamento do Drop{" "}
            <span className="text-red-600 font-bold">We Made IT</span>
          </p>
        </div>
        <p className="w-full text-gray-700 font-semibold text-sm leading-relaxed text-center md:text-left px-4 sm:mt-52">
          Nossa missão principal é levantar e apoiar nosso time, por isso,
          realizamos eventos de rua que evidenciam a arte, o trabalho Manual,
          esportes , danças e tecnologia. Colcamos nossos Holofotes virados para
          prodígios e visamos a vitória juntos. 1ª edição Fashion Wave Rj 2024
        </p>
      </div>
    </div>
  );
};

export default SobreCorp;
