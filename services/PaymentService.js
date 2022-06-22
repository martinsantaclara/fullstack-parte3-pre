const axios = require('axios')

class PaymentService {
    async createPayment() {
        const url = 'https://api.mercadopago.com/checkout/preferences'

        // console.log(body)

        const body = {
            payer_email: 'test_user_24559756@testuser.com',
            items: [
                {
                    title: 'Dummy Title',
                    description: 'Dummy description',
                    picture_url: 'http://www.myapp.com/myimage.jpg',
                    category_id: 'category123',
                    quantity: 2,
                    unit_price: 20
                }
            ],
            back_urls: {
                failure: 'https://google.com.ar',
                pending: 'https://google.com.ar',
                success: 'https://google.com.ar'
            }
        }

        const payment = await axios.post(url, body, {
            headers: {
                'Content-Type': 'application/json',
                // eslint-disable-next-line no-undef
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
            }
        })

        return payment.data
    }
}

module.exports = PaymentService
