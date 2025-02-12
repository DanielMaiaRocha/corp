import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import axios from "../../lib/axios";
import { useCartStore } from "../../stores/useCartStore";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react"; 
import { useState } from "react"; 

// Inicializa o Mercado Pago com sua chave pública
initMercadoPago("APP_USR-44b1ecef-d46d-4336-9f27-d26c5c029f47", {
    locale: "pt-BR",
});

const OrderSummary = () => {
    const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();
    const [preferenceId, setPreferenceId] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false); 
    const [paymentStarted, setPaymentStarted] = useState(false); // Estado para definir se o botão será substituído

    const savings = subtotal - total;
    const formattedSubtotal = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(subtotal);
    const formattedTotal = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(total);
    const formattedSavings = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(savings);

    const handlePayment = async () => {
        if (isProcessing || paymentStarted) return; // Evita múltiplos cliques

        setIsProcessing(true);

        try {
            const res = await axios.post("/payment/create-mercado-pago-preference", {
                products: cart,
                couponCode: coupon ? coupon.code : null,
            });

            const { preferenceId } = res.data;
            setPreferenceId(preferenceId);
            setPaymentStarted(true); // Substitui o botão pelo Mercado Pago
        } catch (error) {
            console.error("Erro ao processar o pagamento:", error);

            if (error.response) {
                console.error("Resposta do servidor:", error.response.data);
                alert(`Erro: ${error.response.data.message || "Erro ao criar pagamento."}`);
            } else if (error.request) {
                console.error("Sem resposta do servidor:", error.request);
                alert("Não foi possível conectar ao servidor. Verifique sua conexão.");
            } else {
                console.error("Erro inesperado:", error.message);
                alert("Ocorreu um erro inesperado. Tente novamente.");
            }
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <motion.div
            className='space-y-4 rounded-lg border bg-white p-4 shadow-sm sm:p-6'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <p className='text-xl font-semibold text-gray-700'>Revisão do Pedido</p>

            <div className='space-y-4'>
                <div className='space-y-2'>
                    <dl className='flex items-center justify-between gap-4'>
                        <dt className='text-base font-normal text-gray-700'>Preço Original</dt>
                        <dd className='text-base font-medium text-gray-900'>{formattedSubtotal}</dd>
                    </dl>

                    {savings > 0 && (
                        <dl className='flex items-center justify-between gap-4'>
                            <dt className='text-base font-normal text-gray-700'>Descontos</dt>
                            <dd className='text-base font-medium text-red-600'>-{formattedSavings}</dd>
                        </dl>
                    )}

                    {coupon && isCouponApplied && (
                        <dl className='flex items-center justify-between gap-4'>
                            <dt className='text-base font-normal text-gray-700'>Cupom ({coupon.code})</dt>
                            <dd className='text-base font-medium text-green-600'>-{coupon.discountPercentage}%</dd>
                        </dl>
                    )}
                    <dl className='flex items-center justify-between gap-4 border-t border-gray-300 pt-2'>
                        <dt className='text-base font-bold text-gray-900'>Total</dt>
                        <dd className='text-base font-bold text-gray-900'>{formattedTotal}</dd>
                    </dl>
                </div>

                {/* Renderiza o botão do Mercado Pago ou o botão de pagamento */}
                {paymentStarted ? (
                    <Wallet initialization={{ preferenceId }} key={preferenceId} />
                ) : (
                    <motion.button
                        className={`flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium text-white 
                            ${isProcessing ? "bg-gray-500 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 focus:ring-red-300"}`}
                        whileHover={!isProcessing ? { scale: 1.05 } : {}}
                        whileTap={!isProcessing ? { scale: 0.95 } : {}}
                        onClick={handlePayment}
                        disabled={isProcessing}
                    >
                        {isProcessing ? "Processando..." : "Finalizar compra"}
                    </motion.button>
                )}

                <div className='flex items-center justify-center gap-2'>
                    <span className='text-sm font-normal text-gray-400'>ou</span>
                    <Link
                        to='/'
                        className='inline-flex items-center gap-2 text-sm font-medium text-red-400 underline hover:text-red-300 hover:no-underline'
                    >
                        Continue Comprando
                        <MoveRight size={16} />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default OrderSummary;
