import { FORM_CONFIG } from '../config/constants';
import { saveTransaction } from './storage';

export const submitToGoogleForm = async (data) => {
    const { amount, category, method, description } = data;

    const formData = new FormData();
    formData.append(FORM_CONFIG.fields.amount, amount);
    formData.append(FORM_CONFIG.fields.category, category);
    formData.append(FORM_CONFIG.fields.method, method);
    // If form has description field, add it here. For now storing locally.

    // Google Forms can be submitted via POST to /formResponse
    // Note: 'no-cors' is required for client-side submission to Google Forms
    // This means we won't get a readable response (always opaque), but the submission works.

    try {
        await fetch(FORM_CONFIG.formUrl, {
            method: "POST",
            mode: "no-cors",
            body: formData
        });

        // Save to local storage on success
        await saveTransaction({
            amount,
            category,
            method,
            description
        });

        return true;
    } catch (error) {
        console.error("Submission error:", error);
        return false;
    }
};
