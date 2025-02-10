import { MercadoPagoConfig, Payment } from "mercadopago";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import dotenv from "dotenv";

dotenv.config();

// Configura o cliente do Mercado Pago
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
    timeout: 5000,
    idempotencyKey: 'abc', // Chave de idempotência (opcional)
});

const payment = new Payment(client);

// Função para criar uma sessão de checkout (pagamento)
export const createCheckoutSession = async (req, res) => {
    try {
        const { products, couponCode } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "Invalid or empty products array" });
        }

        // Calcula o valor total do pagamento
        let totalAmount = products.reduce((acc, product) => acc + product.price * product.quantity, 0);

        // Verifica e aplica o cupom de desconto
        let coupon = null;
        if (couponCode) {
            coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true });
            if (coupon) {
                totalAmount -= (totalAmount * coupon.discountPercentage) / 100;
            }
        }

        // Cria o corpo do pagamento para o Mercado Pago
        const body = {
            transaction_amount: totalAmount,
            description: "Compra de produtos", // Descrição do pagamento
            payment_method_id: "pix", // Método de pagamento (PIX)
            payer: {
                email: req.user.email, // E-mail do usuário logado
            },
            metadata: {
                userId: req.user._id.toString(),
                couponCode: couponCode || "",
                products: JSON.stringify(
                    products.map((p) => ({
                        id: p._id,
                        quantity: p.quantity,
                        price: p.price,
                    }))
                ),
            },
        };

        // Cria o pagamento no Mercado Pago
        const result = await payment.create({ body });

        // Verifica se o pagamento foi criado com sucesso
        if (result && result.status === "pending") {
            // Se o total for maior ou igual a 200, cria um novo cupom
            if (totalAmount >= 200) {
                await createNewCoupon(req.user._id);
            }

            // Retorna o ID do pagamento e o valor total
            res.status(200).json({
                id: result.id,
                totalAmount: totalAmount,
                qrCode: result.point_of_interaction?.transaction_data?.qr_code, // QR code para PIX
            });
        } else {
            throw new Error("Erro ao criar o pagamento no Mercado Pago.");
        }
    } catch (error) {
        console.error("Error processing checkout:", error);
        res.status(500).json({ message: "Error processing checkout", error: error.message });
    }
};

// Função para processar o sucesso do pagamento
export const checkoutSuccess = async (req, res) => {
    try {
        const { paymentId } = req.body;

        // Recupera os detalhes do pagamento no Mercado Pago
        const paymentDetails = await payment.get(paymentId);

        if (paymentDetails.status === "approved") {
            // Verifica se um cupom foi usado e o desativa
            if (paymentDetails.metadata.couponCode) {
                await Coupon.findOneAndUpdate(
                    {
                        code: paymentDetails.metadata.couponCode,
                        userId: paymentDetails.metadata.userId,
                    },
                    {
                        isActive: false,
                    }
                );
            }

            // Cria um novo pedido
            const products = JSON.parse(paymentDetails.metadata.products);
            const newOrder = new Order({
                user: paymentDetails.metadata.userId,
                products: products.map((product) => ({
                    product: product.id,
                    quantity: product.quantity,
                    price: product.price,
                })),
                totalAmount: paymentDetails.transaction_amount,
                mercadoPagoPaymentId: paymentId,
            });

            await newOrder.save();

            res.status(200).json({
                success: true,
                message: "Payment successful, order created, and coupon deactivated if used.",
                orderId: newOrder._id,
            });
        } else {
            throw new Error("Pagamento não aprovado.");
        }
    } catch (error) {
        console.error("Error processing successful checkout:", error);
        res.status(500).json({ message: "Error processing successful checkout", error: error.message });
    }
};

// Função para criar um novo cupom
async function createNewCoupon(userId) {
    await Coupon.findOneAndDelete({ userId });

    const newCoupon = new Coupon({
        code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        discountPercentage: 10,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expira em 30 dias
        userId: userId,
    });

    await newCoupon.save();

    return newCoupon;
}