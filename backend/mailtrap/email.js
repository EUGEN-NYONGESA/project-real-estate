import {VERIFICATION_EMAIL_TEMPLATE} from "./emailTemplate.js";

import { mailtrapClient, sender } from "./mailtrap.config.js";

//send verification email
export const sendVerificationEmail = async (email, verificationToken) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Verify your email",
			html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
			category: "Email Verification",
		});

		console.log("Email sent successfully", response);
	} catch (error) { 
		console.error(`Error sending verification`, error);
		throw new Error(`Error sending verification email: ${error}`);
	}
};

//welcome email
export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "bf25a0d5-a2ab-439d-9610-a40b985abf14",
            template_variables: {
                company_info_name: "SKY-HOMES REAL ESTATE",
                name: name,
            },
        });

        console.log("Welcome email sent successfully", response);

    } catch (error) {
        console.error(`Error sending welcome email`, error);
        throw new error(`Error sending welcome email: ${error}`);
    }
}

