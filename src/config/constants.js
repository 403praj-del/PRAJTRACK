export const FORM_CONFIG = {
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSdW71Sx2-odKr5ihclXXSJIMWJ9xN7l0oZnniy__GyMmiBrWw/formResponse",
    fields: {
        amount: "entry.161512392",      // EXPENSE IN INR
        category: "entry.2092530941",   // TYPES OF EXPENSES
        method: "entry.1092195417"      // CASH (BILL), UPI, CARD
    },
    categories: [
        "Food",
        "Travel",
        "Shopping",
        "Bills",
        "Health",
        "Other"
        // User can type their own, but these are defaults for the dropdown
    ],
    paymentMethods: [
        "UPI",
        "CASH",
        "CARD",
        "BILL"
    ]
};
