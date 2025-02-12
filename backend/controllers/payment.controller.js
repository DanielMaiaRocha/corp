import { MercadoPagoConfig, Preference, Payment } from "mercadopago"; 
import User from "../models/user.model.js"
import nodemailer from "nodemailer";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import dotenv from "dotenv";

dotenv.config();

// Configura o cliente do Mercado Pago
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
    timeout: 5000,
});

const transporter = nodemailer.createTransport({
    service: "gmail", // Use o provedor de e-mail desejado
    auth: {
        user: process.env.EMAIL_SENDER, // Email da loja (remetente)
        pass: process.env.EMAIL_PASSWORD, // Senha do email (ou App Password)
    },
});

const preference = new Preference(client);
const payment = new Payment(client); // Instância para recuperar pagamentos

// Função para criar uma sessão de checkout (preferência de pagamento)
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

        // Garante que o valor total não fique negativo
        totalAmount = Math.max(totalAmount, 0);

        // Verifica e ajusta o e-mail do comprador para evitar erro de auto-pagamento
        let payerEmail = req.user.email;
        if (payerEmail === process.env.MERCADO_PAGO_SELLER_EMAIL) {
            payerEmail = "comprador_teste@mercadopago.com"; // E-mail de teste
        }

        // Cria a preferência de pagamento para o Mercado Pago
        const body = {
            items: products.map((product) => ({
                title: product.name,
                unit_price: product.price,
                quantity: product.quantity,
            })),
            payer: {
                email: payerEmail, // Usa um e-mail alternativo se necessário
            },
            back_urls: {
                success: "http://localhost:5173/purchase-success",
                failure: "http://localhost:5173/purchase-cancel",
            },
            auto_return: "approved",
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

        // Cria a preferência de pagamento no Mercado Pago
        const result = await preference.create({ body });

        res.status(200).json({
            preferenceId: result.id,
            totalAmount: totalAmount,
        });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ message: "Error creating checkout session", error: error.message });
    }
};

const sendEmailToStore = async (order) => {
    try {
        // 1️⃣ Busca o usuário no banco pelo ID armazenado no pedido
        const user = await User.findById(order.userId);

        if (!user) {
            console.error("Usuário não encontrado no banco de dados.");
            return;
        }

        // 2️⃣ Configuração do email
        const mailOptions = {
            from: process.env.EMAIL_SENDER,
            to: process.env.STORE_EMAIL, // Email da loja para receber os pedidos
            subject: "Novo Pedido Recebido",
            html: `
                <h2>📦 Novo Pedido Recebido!</h2>
                <p><strong>Cliente:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Telefone:</strong> ${user.phone || "Não informado"}</p>
                <p><strong>Endereço:</strong> ${user.address || "Não informado"}</p>
                <p><strong>CEP:</strong> ${user.zipCode || "Não informado"}</p>
                <p><strong>Total:</strong> R$ ${order.totalAmount.toFixed(2)}</p>
                <p><strong>Produtos:</strong></p>
                <ul>
                    ${order.products.map(p => `<li>${p.quantity}x ${p.product} - R$ ${p.price.toFixed(2)}</li>`).join("")}
                </ul>
                <p><strong>ID do Pagamento:</strong> ${order.mercadoPagoPaymentId}</p>
            `,
        };

        // 3️⃣ Enviar o email
        await transporter.sendMail(mailOptions);
        console.log("Email enviado para a loja com sucesso!");

    } catch (error) {
        console.error("Erro ao buscar usuário ou enviar email:", error);
    }
};



// Função para processar o sucesso do pagamento
export const checkoutSuccess = async (req, res) => {
    try {
        const { paymentId } = req.body;
        const paymentDetails = await payment.get({ id: paymentId });

        if (paymentDetails.status === "approved") {
            if (paymentDetails.metadata?.couponCode) {
                await Coupon.findOneAndUpdate(
                    { code: paymentDetails.metadata.couponCode, userId: paymentDetails.metadata.userId },
                    { isActive: false }
                );
            }

            const products = JSON.parse(paymentDetails.metadata?.products || "[]");
            const newOrder = new Order({
                user: paymentDetails.metadata?.userId,
                products: products.map((product) => ({
                    product: product.id,
                    quantity: product.quantity,
                    price: product.price,
                })),
                totalAmount: paymentDetails.transaction_amount,
                mercadoPagoPaymentId: paymentId,
            });

            await newOrder.save();

            // Envia email para a loja
            await sendEmailToStore(newOrder);

            res.status(200).json({
                success: true,
                message: "Pagamento aprovado. Pedido criado e e-mail enviado!",
                orderId: newOrder._id,
            });
        } else {
            throw new Error("Pagamento não aprovado.");
        }
    } catch (error) {
        console.error("Erro no checkout:", error);
        res.status(500).json({ message: "Erro ao processar checkout", error: error.message });
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
