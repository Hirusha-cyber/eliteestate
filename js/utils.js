window.formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: window.CONFIG.CURRENCY,
        maximumFractionDigits: 0
    }).format(amount);
};

window.getPropertyUrl = (code) => {
    return `property.html?code=${code}`;
};

window.generateWhatsAppLink = (property) => {
    const text = `Hi, I'm interested in Property ${property.code} (${property.title}) in ${property.location.city}. Price: ${window.formatCurrency(property.price)}. Is it available? Please share more details.`;
    return `https://wa.me/${window.CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
};
