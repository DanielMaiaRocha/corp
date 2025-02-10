import {MercadoPagoConfig, Payment} from "mercadopago";
import dotenv from "dotenv"

dotenv.config()

const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
    timeout: 5000,
    idempotencyKey: 'abc'
})

const payment = new Payment(client)

const body = {
    transaction_amount: 20.10,
    description: 'Teste api pix',
    payment_method_id: 'pix',
    payer:{
        email: 'contatodanielmrocha@gmail.com'
    },

}

payment.create({body}).then(console.log).catch(console.log)