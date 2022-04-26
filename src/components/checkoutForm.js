import React, {useState} from "react";
import {
    CardCvcElement, CardElement,
    CardExpiryElement,
    CardNumberElement,
    useElements,
    useStripe
} from "@stripe/react-stripe-js";

import axios from 'axios'


function CheckoutForm() {
    const [plan, setPlan] = useState('')
    const [paymentMethod, setPaymentMethod] = useState()
    const stripe = useStripe();
    const elements = useElements();

    // const handleSubmit = async event => {
    //     event.preventDefault();
    //     if (!stripe || !elements) {
    //         return;
    //     }
    //     const card = elements.getElement(CardElement)
    //     const result = await stripe.createToken(card);
    //     if (result.error) {
    //         // Show error to your customer.
    //         console.log(result.error.message);
    //     } else {
    //         // Send the token to your server.
    //         // This function does not exist yet; we will define it in the next step.
    //         pay(result.token.id, card);
    //     }
    // };
    const pay = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) {
            return;
        }
        const card = elements.getElement(CardElement)

        const options = {
            url: 'http://localhost:8000/api/subscribe',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            data: {
                payment_method_types: ['card'],
            }
        };
        axios(options).then(response => {
            /*console.log(response.data)*/
            (async function (e) {
                const {setupIntent, error} = await stripe.confirmCardSetup(
                    response.data.client_secret, {
                        payment_method: {
                            card: card,
                            billing_details: {name: "Mohammed Asif"}
                        }
                    }
                );

                if (error) {
                    console.log(error)
                }

                else {
                    console.log("setupIntent",setupIntent)
                }

            })();
        })
        /*stripe
            .createPaymentMethod({
                type: 'card',
                card: card,
                billing_details: {
                    name: 'Jenny Rosen',
                },
            })
            .then(function (result) {

                const options = {
                    url: 'http://localhost:8000/api/subscribe',
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    data: {
                        plan: plan,
                        paymentMethodId: result.id
                    }
                };

                axios(options).then(response => {
                    console.log(response)
                })
            });*/
    };


    return (
        <div className="container">
            <h1> Payment with stripe</h1>
            <div className="d-flex justify-content-center">
                <div className="w-25">
                    <form onSubmit={pay}>
                        <select name="" id="" onChange={(e) => setPlan(e.target.value)}>
                            <option value="price_1KrIDuDHFpZchNKgimYaZzbS">Standard - 10 Kr</option>
                            <option value="price_1KrIDuDHFpZchNKgrTH9TW34">Premium - 20 Kr</option>
                        </select>

                        <CardElement/>

                        <button className="btn btn-success mt-2">Subscribe Now</button>
                    </form>
                </div>
            </div>
        </div>

    );

}

export default CheckoutForm