import { Instagram, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-white fixed bottom-0 left-0 flex flex-col md:flex-row justify-between items-center px-4 md:px-8 py-4 md:py-8 mx-0 text-sm z-50">
      {/* Ícones de redes sociais */}
      <div className="flex gap-2 mb-4 md:mb-0">
        <a
          href="https://instagram.com/corp_0ration/tagged/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 hover:text-gray-900"
        >
          <Instagram className="w-6 h-6" />
        </a>
        <a
          href="https://wa.me"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 hover:text-gray-900"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
      </div>

      {/* Links do Footer */}
      <div className="flex-col hidden md:flex md:flex-row gap-2 md:gap-4 text-gray-500 font-semibold text-center">
        <a href="https://rastreamento.correios.com.br/app/index.php" className="hover:underline">
          rastreio
        </a>
        <a href="/FAQ" className="hover:underline">
          FAQ
        </a>
        <a href="https://wa.me" className="hover:underline">
          ajuda
        </a>
        <a href="https://wa.me" className="hover:underline">
          trocas e devoluções
        </a>
      </div>
    </footer>
  );
}

export default Footer;