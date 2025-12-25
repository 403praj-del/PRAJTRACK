import Tesseract from 'tesseract.js';

// --- Image Preprocessing ---
const preprocessImage = (imageSoruce) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = imageSoruce;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Convert to grayscale and increase contrast
            for (let i = 0; i < data.length; i += 4) {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                // Binarize (thresholding)
                const color = avg > 128 ? 255 : 0;
                data[i] = color;     // R
                data[i + 1] = color; // G
                data[i + 2] = color; // B
            }

            ctx.putImageData(imageData, 0, 0);
            resolve(canvas.toDataURL('image/jpeg'));
        };
    });
};

// --- Main OCR Function ---
export const analyzeImage = async (imageFile) => {
    try {
        // 1. Preprocess the image for better accuracy
        const processedImage = await preprocessImage(imageFile);

        // 2. Perform OCR
        const result = await Tesseract.recognize(
            processedImage,
            'eng',
            { logger: m => console.log(m) }
        );

        const text = result.data.text;
        console.log("OCR Raw Text:", text);

        // 3. Extract Data
        return {
            text,
            amount: extractAmount(text),
            date: extractDate(text),
            category: extractCategory(text),
            payment_method: extractPaymentMethod(text),
            confidence_score: 100 // Local OCR is "binary" (extracted or not)
        };
    } catch (error) {
        console.error("OCR Failed:", error);
        return { text: "", amount: "", date: "", category: "Other", payment_method: "Cash" };
    }
};

const extractAmount = (text) => {
    // Matches "₹ 500", "Rs. 1,234.00", "Total: 500.00", "Paid: 500"
    const lines = text.split('\n');
    let candidates = [];

    for (const line of lines) {
        const cleaned = line.replace(/,/g, '');
        // Look for currency symbols or keywords followed by numbers
        const amountRegex = /(?:₹|rs\.?|total|amt|paid|amount)[:\s]*([\d]+\.?\d*)/i;
        const match = cleaned.match(amountRegex);
        if (match) candidates.push(match[1]);
    }

    if (candidates.length > 0) {
        // Return the largest candidate (often the total)
        return candidates.sort((a, b) => parseFloat(b) - parseFloat(a))[0];
    }

    // Fallback: look for generic decimal numbers
    const fallbackRegex = /\d+\.\d{2}/g;
    const fallbackMatches = text.match(fallbackRegex);
    if (fallbackMatches) return fallbackMatches[fallbackMatches.length - 1]; // Often the last number is the total

    return "";
};

const extractDate = (text) => {
    const dateRegex = /\d{2}[-/]\d{2}[-/]\d{4}|\d{4}[-/]\d{2}[-/]\d{2}/;
    const match = text.match(dateRegex);
    return match ? match[0] : new Date().toISOString().split('T')[0];
};

const extractCategory = (text) => {
    const t = text.toLowerCase();
    const mapping = {
        'Food': ['zomato', 'swiggy', 'restaurant', 'food', 'cafe', 'dining', 'bake', 'lunch', 'dinner'],
        'Travel': ['uber', 'ola', 'fuel', 'petrol', 'diesel', 'transport', 'taxi', 'metro'],
        'Shopping': ['amazon', 'flipkart', 'mart', 'store', 'retail', 'fashions', 'mall'],
        'Health': ['pharmacy', 'hospital', 'doctor', 'clinic', 'medical', 'medicine'],
        'Bills': ['electricity', 'water', 'recharge', 'mobile', 'internet', 'subscription']
    };

    for (const [cat, words] of Object.entries(mapping)) {
        if (words.some(w => t.includes(w))) return cat;
    }
    return 'Other';
};

const extractPaymentMethod = (text) => {
    const t = text.toLowerCase();
    if (t.includes('upi') || t.includes('scan') || t.includes('phonepe') || t.includes('paytm') || t.includes('gpay')) return 'UPI';
    if (t.includes('card') || t.includes('visa') || t.includes('mastercard') || t.includes('credit') || t.includes('debit')) return 'Card';
    if (t.includes('netbanking') || t.includes('neft') || t.includes('imbps')) return 'NetBanking';
    return 'Cash'; // Default fallback
};
