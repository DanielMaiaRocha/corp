import { Instagram, MessageCircle   } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-white fixed bottom-0 left-0 flex justify-between items-center px-8 py-8  mx-0 text-sm">
      <div className="flex gap-2">
        <a
          href="https://instagram.com"
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
          <MessageCircle className='w-6 h-6' />
        </a>
      </div>

      {/* Links do Footer */}
      <div className="flex gap-4 text-gray-500 font-semibold">
        <a href="#rastreo" className="hover:underline">
          rastreio
        </a>
        <a href="#cadastro-drop" className="hover:underline">
          cadastro drop
        </a>
        <a href="#trocas-devolucoes" className="hover:underline">
          trocas e devoluções
        </a>
      </div>
    </footer>
  );
}

export default Footer;
