import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { stripe } from '../../../lib/stripe'
import { getUserSession } from '@/lib/core/session'

export async function POST(request) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_BASE_URL

    const formData = await request.formData()
    const price = formData.get('donation');
    const priceInCents = Math.round(parseFloat(price) * 100);
    const user = await getUserSession();
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      customer_email: user?.email,
      payment_method_types: ['card'],
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price_data: {
            currency: 'usd',
            product_data: {
              name: user?.name
            },
            unit_amount: priceInCents
          },
          // price: 'price_1TmnE1F8Bs2iBVtDfgld5MBL',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/funding/success?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        userId: user?.id || '',
        userName: user?.name || '',
        amount: price,
      }
    });
    return NextResponse.redirect(session.url, 303)
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}