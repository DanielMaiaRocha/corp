import React from "react";

const FAQ = () => {
    const faqItems = [
        {
            question: "Como funcionam os lançamentos da CORP?",
            answer: "Trabalhamos com o conceito de drops, ou seja, coleções limitadas que são lançadas periodicamente. Assim, garantimos exclusividade para quem veste CORP.",
        },
        {
            question: "Onde posso comprar as peças da CORP?",
            answer: "Nossas peças são vendidas exclusivamente pelo nosso site e em lançamentos especiais. Fique de olho no nosso Instagram para não perder os próximos drops!",
        },
        {
            question: "Vocês fazem reposição de estoque?",
            answer: "Não! Nossos produtos são lançamentos exclusivos e limitados. Se um drop esgotar, não terá reposição.",
        },
        {
            question: "Como sei qual é o meu tamanho?",
            answer: "Disponibilizamos uma tabela de medidas detalhada na página de cada produto. Se precisar de ajuda, entre em contato com a nossa equipe pelo WhatsApp ou Instagram.",
        },
        {
            question: "Quais formas de pagamento são aceitas?",
            answer: "Aceitamos PIX, boleto e cartões de crédito (com opção de parcelamento). Para mais informações, confira nossa página de Pagamentos.",
        },
        {
            question: "Qual o prazo de entrega?",
            answer: "O prazo varia de acordo com a sua localização. Enviamos para todo o Brasil e o tempo estimado é exibido no checkout antes da finalização da compra.",
        },
        {
            question: "Vocês fazem trocas e devoluções?",
            answer: "Sim! Caso sua peça tenha algum defeito ou não sirva, aceitamos trocas dentro do prazo de 7 dias após o recebimento. Para mais detalhes, confira nossa Política de Trocas e Devoluções.",
        },
        {
            question: "Como posso acompanhar meu pedido?",
            answer: "Após a compra, você receberá um código de rastreamento por e-mail para acompanhar a entrega em tempo real.",
        },
        {
            question: "Como entro em contato com a CORP?",
            answer: "Você pode nos chamar no Instagram @corp_0ration ou pelo WhatsApp, disponível na nossa página de contato.",
        },
        {
            question: "Posso fazer parte da Creative Corporantion?",
            answer: "Sem dúvidas, seu cadastro é muito importante pra gente, movimentamos tudo em prol de vocês, juntos #wemadeit! Esperamos ter sua presença em nossos eventos e sua contribuição sempre que puder! Seja bem vindo à CORP, e após o seu cadastro receberá todo passo-a-passo.",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Título da Página */}
                <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
                    FAQ - CORP
                </h1>

                {/* Lista de Perguntas e Respostas */}
                <div className="space-y-6">
                    {faqItems.map((item, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                {item.question}
                            </h2>
                            <p className="text-gray-600">{item.answer}</p>
                        </div>
                    ))}
                </div>

                {/* Mensagem Final */}
                <div className="mt-10 mb-20 text-center">
                    <p className="text-gray-600">
                        Se tiver mais alguma dúvida, fale com a gente!{" "}
                        <span className="font-bold text-gray-900">#WEMADEIT</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FAQ;