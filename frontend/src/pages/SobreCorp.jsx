const SobreCorp = () => {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-20 mb-20">
      {/* Imagem com Texto à Direita */}
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex flex-col items-center">
          <img
            src="/images/drop1.jpg"
            alt="Foto Grey"
            className="w-full md:w-[90%] rounded-lg shadow-lg"
          />
          <p className="mt-4 text-sm font-medium text-gray-600 text-center">
            Vídeo de lançamento do Drop{" "}
            <span className="text-red-600 font-bold">We Made IT</span>
          </p>
        </div>
        <p className="w-full text-gray-700 font-medium text-base leading-relaxed text-center md:text-left md:pl-8">
          O nome <span className="font-bold">“CORP”</span> é a abreviação de{" "}
          <span className="font-bold">CREATIVE CORPORATION</span>. A corporação é
          um sinônimo de sociedade, liga, time, aliança ou organização. Criada
          para unir, expressar e protestar, a Corp procura evidenciar a
          importância de um time para um crescimento social e mental. Nosso
          símbolo é um troféu, pois representa a vitória do coletivo e ressalta
          que vencer com amigos e companheiros é melhor. Criada em 2022 e
          lançada em 2024 no subúrbio do Rio de Janeiro,{" "}
          <span className="font-bold">Jean Leandro</span>, carioca nascido em
          2003, busca apresentar elementos visuais do seu cotidiano em forma de
          estampas coloridas ou não, moldes simples ou extravagantes e ativações
          de rua que impactam o público ao redor.
        </p>
      </div>

      {/* Texto à Esquerda com Imagem à Direita */}
      <div className="flex flex-col md:flex-row-reverse items-center gap-8">
        <div className="flex flex-col items-center">
          <img
            src="/images/corp7.jpeg"
            alt="Sunday session"
            className="w-full md:w-[58%] rounded-lg shadow-lg"
          />
          <p className="mt-4 text-sm font-medium text-gray-600 text-center">
            Vídeo de lançamento do Drop{" "}
            <span className="text-red-600 font-bold">We Made IT</span>
          </p>
        </div>
        <p className="w-full text-gray-700 font-medium text-base leading-relaxed text-center md:text-left md:pr-8">
          Com uma narrativa coloquial, a Corp abraça as ruas e busca transmitir
          vibrações positivas. Procuramos nos conectar com nosso público através
          de estampas e modelagens, fazendo alusão a acontecimentos passados ou
          atuais.
        </p>
      </div>

      {/* Terceira Imagem com Texto à Direita */}
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex flex-col items-center">
          <img
            src="/images/corp5.jpeg"
            alt="Foto Grey"
            className="w-full md:w-[90%] rounded-lg shadow-lg"
          />
          <p className="mt-4 text-sm font-medium text-gray-600 text-center">
            Vídeo de lançamento do Drop{" "}
            <span className="text-red-600 font-bold">We Made IT</span>
          </p>
        </div>
        <p className="w-full text-gray-700 font-medium text-base leading-relaxed text-center md:text-left md:pl-8">
          O jogo de cores em determinadas peças é marcante, pois fica na memória
          e faz parte do conceito. Nenhuma cor é por acaso; são escolhidas à
          dedo e possuem um significado.
        </p>
      </div>

      {/* Quarta Imagem com Texto à Esquerda */}
      <div className="flex flex-col md:flex-row-reverse items-center gap-8">
        <div className="flex flex-col items-center">
          <img
            src="/images/corp6.jpeg"
            alt="Sunday session"
            className="w-full md:w-[55%] rounded-lg shadow-lg"
          />
          <p className="mt-4 text-sm font-medium text-gray-600 text-center">
            Vídeo de lançamento do Drop{" "}
            <span className="text-red-600 font-bold">We Made IT</span>
          </p>
        </div>
        <p className="w-full text-gray-700 font-medium text-base leading-relaxed text-center md:text-left md:pr-8">
          A Corp busca levar autoestima e amor próprio para quem faz parte do
          time. Moldes que preservam e valorizam seus corpos, independentemente
          da forma, enaltecem a beleza e celebram as diferenças individuais.
        </p>
      </div>

      {/* Quinta Imagem com Texto à Direita */}
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex flex-col items-center">
          <img
            src="/images/festaCorp.jpg"
            alt="Foto Grey"
            className="w-full md:w-[90%] rounded-lg shadow-lg"
          />
          <p className="mt-4 text-sm font-medium text-gray-600 text-center">
            Vídeo de lançamento do Drop{" "}
            <span className="text-red-600 font-bold">We Made IT</span>
          </p>
        </div>
        <p className="w-full text-gray-700 font-medium text-base leading-relaxed text-center md:text-left md:pl-8">
          Nossa missão principal é levantar e apoiar nosso time. Por isso,
          realizamos eventos de rua que evidenciam a arte, o trabalho manual,
          esportes, danças e tecnologia. Colocamos nossos holofotes virados para
          prodígios e visamos a vitória juntos.{" "}
          <span className="font-bold">1ª edição Fashion Wave RJ 2024</span>.
        </p>
      </div>
    </div>
  );
};

export default SobreCorp;