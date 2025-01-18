// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


// exports.payment = async(req,res) => {
//     const product  = await stripe.products.create({
//         name: "Plan"
//     });

//     if(product){
//         var price  = await stripe.prices.create({
//             unit_amount: 3999 * 100,
//             currency: 'inr',
//             product: `${product.id}`
//         });
//     }


//     if(price.id){
//         var session = await stripe.checkout.sessions.create({
//             line_items:[
//                 {
//                     price: `${price.id}`,
//                     quantity: 1
//                 }
//             ],
//             mode : 'payment',
//             success_url: `${process.env.SERVER_URL}/success`,
//             cancel_url: `${process.env.SERVER_URL}/cancel`,
//             customer_email : "rk3727000@gmail.com",
//         });
//     }
//     consloe.log(session);
//     return res.status(200).json({
//         success: true,
//         message: "Session created succfully",
//         data: session
//     });


// }







// exports.stripeWebhook = async (req, res) => {
//     const sig = req.headers['stripe-signature'];
//     const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

//     let event;

//     try {
//         event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
//     } catch (err) {
//         console.error("Webhook signature verification failed:", err.message);
//         return res.status(400).send(`Webhook Error: ${err.message}`);
//     }

//     // Handle successful payment
//     if (event.type === 'checkout.session.completed') {
//         const session = event.data.object;

//         const { metadata } = session; // Metadata passed during session creation
//         try {
//             await createOrganizationHelper({
//                 name: metadata.orgName,
//                 planId: metadata.planId,
//                 userId: metadata.userId,
//             });
//             console.log("Organization created successfully in the database");
//         } catch (error) {
//             console.error("Error creating organization:", error);
//         }
//     }

//     res.status(200).json({ received: true });
// };



// const createOrganization = async ({ name, planId, userId }) => {
//     try {

//         if (!userId || !planId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User ID and Plan ID are required fields"
//             });
//         }

//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found"
//             });
//         }

//         let organization = await Organization.findOne({ userId });

//         if (organization) {
//             if (!organization.planId.includes(planId)) {
//                 organization.planId.push(planId);
//                 await organization.save();
//             }

//             return res.status(200).json({
//                 success: true,
//                 message: "Plan ID added to the existing organization",
//                 data: organization
//             });
//         }

//         user.isAdmin = true;
//         await user.save();

//         const newOrganization = new Organization({
//             name: name || 'Org_1',
//             planId: [planId],
//             userId
//         });

//         await newOrganization.save();

//         res.status(201).json({
//             success: true,
//             message: "Organization created successfully",
//             data: newOrganization
//         });
//     } catch (error) {
//         console.error('Error creating/updating organization:', error);
//         res.status(500).json({
//             success: false,
//             message: "Failed to create/update organization",
//             error: error.message
//         });
//     }
// };

// exports.success = async (req, res) => {
//     try {
//         const { planId, orgName, userId } = req.query;

//         if (!planId || !orgName || !userId) {
//             return res.status(400).json({ success: false, message: "Missing required data" });
//         }

//         // Create organization in the database
//         // Replace this with your database logic
//         await createOrganization({ planId, orgName, userId });

//         return res.status(200).json({ success: true, message: "Organization created successfully" });
//     } catch (error) {
//         console.error("Error handling success callback:", error);
//         return res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// };




const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Organization = require('../Models/organization');
const User = require('../Models/user');
exports.stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; 

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;

            const { metadata } = session; 
            const { planId, orgName, userId } = metadata;

            try {
                const user = await User.findById(userId);
                if (!user) throw new Error('User not found');

                let organization = await Organization.findOne({ userId });
                if (organization) {
                    if (!organization.planId.includes(planId)) {
                        organization.planId.push(planId);
                        await organization.save();
                    }
                } else {
                    user.isAdmin = true;
                    await user.save();

                    organization = new Organization({
                        name: orgName || 'Default Organization',
                        planId: [planId],
                        userId
                    });

                    await organization.save();
                }

                console.log('Organization saved/updated successfully');
            } catch (error) {
                console.error('Error handling webhook data:', error.message);
            }
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
};

exports.payment = async (req, res) => {
    try {

        const { planId, orgName, userId, planName, amount, planQuantity, email } = req.body;
        const product = await stripe.products.create({ name: planName });

        if (!product) {
            return res.status(400).json({ success: false, message: "Failed to create product" });
        }

        const price = await stripe.prices.create({
            unit_amount: amount * 100,
            currency: 'inr',
            product: product.id,
        });

        if (!price.id) {
            return res.status(400).json({ success: false, message: "Failed to create price" });
        }

        
        const successUrl = `${process.env.SERVER_URL}/payment/success?planId=${planId}&orgName=${encodeURIComponent(orgName)}&userId=${userId}`;

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: price.id,
                    quantity: planQuantity || 1,
                },
            ],
            mode: 'payment',
            success_url: successUrl,
            cancel_url: `${process.env.SERVER_URL}/cancel`,
            customer_email: email || "default@example.com",
        });

        return res.status(200).json({
            success: true,
            message: "Session created successfully",
            url: session.url,
        });
    } catch (error) {
        console.error("Error creating payment session:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


exports.cancelPayment = (req, res) => {
    // res.send('Payment cancelled. Please try again.');
    const frontendUrl = `${process.env.FRONTEND_URL}/`;
        res.redirect(frontendUrl);
}
exports.paymentSuccess = async (req, res) => {
    const { planId, orgName, userId } = req.query;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(400).send('User not found');

        let organization = await Organization.findOne({ userId });
        if (organization) {
            if (!organization.planId.includes(planId)) {
                organization.planId.push(planId);
                await organization.save();
            }
        } else {
            user.isAdmin = true;
            await user.save();

            organization = new Organization({
                name: orgName || 'Default Organization',
                planId: [planId],
                userId
            });

            await organization.save();
        }

        // console.log('User and organization saved/updated successfully');
        // res.send('Payment successful! Your account has been updated.');
        const frontendUrl = `${process.env.FRONTEND_URL}/dashboard`;
        res.redirect(frontendUrl);
    } catch (error) {
        console.error('Error handling payment success:', error.message);
        res.status(500).send('Internal Server Error');
    }
};

