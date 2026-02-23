window.Navbar = () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    const navLinkClass = (page) => {
        const isActive = currentPage === page;
        return isActive
            ? "text-primary border-b-2 border-primary px-3 py-2 text-sm font-bold transition-colors"
            : "text-gray-500 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors";
    };

    const mobileNavLinkClass = (page) => {
        const isActive = currentPage === page;
        return isActive
            ? "block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-primary border-primary bg-primary-50"
            : "block pl-3 pr-4 py-2 border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 text-base font-medium";
    };

    return `
    <nav class="glass-panel sticky top-4 mx-4 mt-4 rounded-2xl z-50 mb-4 transition-all duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center py-0">
                <div class="flex items-center">
                    <a href="index.html" class="flex-shrink-0 flex items-center">
                        <img src="public/images/logo.png" alt="Elite Estates" width="192" height="112" class="h-16 md:h-24 w-auto">
                    </a>
                </div>
                <div class="hidden sm:ml-6 sm:flex sm:items-center space-x-8">
                    <a href="index.html" class="${navLinkClass('index.html')}">Home</a>
                    <a href="about.html" class="${navLinkClass('about.html')}">About</a>
                    <a href="blog.html" class="${navLinkClass('blog.html')}">Blog</a>
                    <a href="contact.html" class="${navLinkClass('contact.html')}">Contact</a>
                </div>
                <div class="flex items-center sm:hidden">
                    <button id="mobile-menu-btn" type="button" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-my-primary" aria-controls="mobile-menu" aria-expanded="false">
                        <span class="sr-only">Open main menu</span>
                        <i data-lucide="menu" class="block h-6 w-6"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile menu, show/hide based on menu state. -->
        <div class="sm:hidden hidden" id="mobile-menu">
            <div class="pt-2 pb-3 space-y-1">
                <a href="index.html" class="${mobileNavLinkClass('index.html')}">Home</a>
                <a href="about.html" class="${mobileNavLinkClass('about.html')}">About</a>
                <a href="blog.html" class="${mobileNavLinkClass('blog.html')}">Blog</a>
                <a href="contact.html" class="${mobileNavLinkClass('contact.html')}">Contact</a>
            </div>
        </div>
    </nav>
`;
};

window.Footer = () => `
    <div id="footer-cta-container"></div>
    <footer class="glass-panel mt-16 border-t border-white/50 backdrop-blur-md bg-white/40">
        <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center md:items-start flex-col md:flex-row">
                 <div class="mb-8 md:mb-0">
                    <a href="#" class="flex items-center text-primary font-bold text-xl mb-4">
                        <i data-lucide="home" class="w-6 h-6 mr-2"></i>
                        Elite Estates
                    </a>
                    <p class="text-gray-500 text-sm max-w-xs">
                        Premium property listings in Sri Lanka. Finding your dream home has never been easier.
                    </p>
                </div>
                <div class="grid grid-cols-2 gap-8">
                    <div>
                        <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase">Navigation</h3>
                        <ul class="mt-4 space-y-4">
                            <li><a href="index.html" class="text-base text-gray-500 hover:text-gray-900">Home</a></li>
                            <li><a href="index.html#listings" class="text-base text-gray-500 hover:text-gray-900">Properties</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
                        <ul class="mt-4 space-y-4">
                            <li><a href="privacy.html" class="text-base text-gray-500 hover:text-gray-900">Privacy</a></li>
                            <li><a href="terms.html" class="text-base text-gray-500 hover:text-gray-900">Terms</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
                <div class="flex space-x-6 md:order-2">
                    <a href="${window.CONFIG.SOCIAL_LINKS.facebook}" target="_blank" class="text-gray-400 hover:text-gray-500">
                        <span class="sr-only">Facebook</span>
                        <i data-lucide="facebook" class="h-6 w-6"></i>
                    </a>
                    <a href="${window.CONFIG.SOCIAL_LINKS.instagram}" target="_blank" class="text-gray-400 hover:text-gray-500">
                        <span class="sr-only">Instagram</span>
                        <i data-lucide="instagram" class="h-6 w-6"></i>
                    </a>
                    <a href="${window.CONFIG.SOCIAL_LINKS.youtube}" target="_blank" class="text-gray-400 hover:text-gray-500">
                        <span class="sr-only">YouTube</span>
                        <i data-lucide="youtube" class="h-6 w-6"></i>
                    </a>
                    <a href="${window.CONFIG.WHATSAPP_CHANNEL}" target="_blank" class="text-gray-400 hover:text-gray-500">
                        <span class="sr-only">WhatsApp Channel</span>
                        <!-- WhatsApp Logo SVG -->
                        <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03c0 2.123.554 4.197 1.606 6.046L0 24l6.101-1.6c1.79.977 3.805 1.492 5.86 1.494h.005c6.635 0 12.032-5.396 12.036-12.03a11.82 11.82 0 00-3.528-8.416"/>
                        </svg>
                    </a>
                    <a href="${window.CONFIG.SOCIAL_LINKS.tiktok}" target="_blank" class="text-gray-400 hover:text-gray-500 transition-colors">
                        <span class="sr-only">TikTok</span>
                        <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"/>
                        </svg>
                    </a>
                </div>
                <p class="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
                    &copy; ${new Date().getFullYear()} Elite Estates. All rights reserved to vtec.
                </p>
            </div>
        </div>
    </footer>
`;

window.FooterCTA = () => `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 -mb-12 relative z-20">
        <div class="bg-gradient-to-r from-primary to-secondary rounded-3xl p-10 md:p-16 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-10 transform transition-all duration-500 hover:scale-[1.02]">
            <div class="text-center md:text-left">
                <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Ready to find your dream home?</h2>
                <p class="text-blue-100 text-lg md:text-xl max-w-xl">Our experts are ready to guide you through every step of your property journey in Sri Lanka.</p>
            </div>
            <div class="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <a href="tel:+94775485445" class="flex items-center justify-center bg-white text-primary hover:bg-blue-50 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-95 group">
                    <i data-lucide="phone" class="w-6 h-6 mr-3 transition-transform group-hover:rotate-12"></i>
                    Call Us Now
                </a>
                <a href="contact.html" class="flex items-center justify-center bg-primary/20 hover:bg-primary/30 text-white border-2 border-white/30 backdrop-blur-sm px-8 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95">
                    Contact Us
                </a>
            </div>
        </div>
    </div>
`;

window.PropertyCard = (property, index = 0) => {
    const isAvailable = property.status === 'available';
    const statusColor = isAvailable ? 'bg-green-100 text-green-800' :
        property.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800';

    // Fallback image if none provided or error
    const mainImage = property.images && property.images.length > 0 ? property.images[0] : 'https://via.placeholder.com/400x300?text=No+Image';

    const isLand = (property.category || 'house') === 'land';
    const delay = (index % 12) * 100; // Staggered delay logic

    // Optimize LCP (Largest Contentful Paint) for first property card
    const imageLoadAttributes = index === 0
        ? 'fetchpriority="high" decoding="sync"'
        : 'loading="lazy" decoding="async"';

    return `
    <div class="glass-card rounded-2xl overflow-hidden flex flex-col h-full group relative" data-aos="fade-up" data-aos-delay="${Math.min(delay, 1200)}">
        <div class="relative h-64 overflow-hidden bg-gray-100">
            <img src="${mainImage}" alt="${property.title}" ${imageLoadAttributes} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <div class="absolute top-4 left-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor} capitalize shadow-sm">
                    ${property.status}
                </span>
            </div>
            <div class="absolute top-4 right-4 flex space-x-2">
                 <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/90 text-gray-800 capitalize shadow-sm backdrop-blur-sm">
                    ${property.category || 'House'}
                </span>
                 <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/90 text-gray-800 capitalize shadow-sm backdrop-blur-sm">
                    ${property.listingType}
                </span>
                 ${property.condition === 'new' ? '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/90 text-white capitalize shadow-sm backdrop-blur-sm">New</span>' : ''}
            </div>
            <div class="absolute bottom-4 left-4">
               <span class="text-white font-bold text-xl drop-shadow-md">
                    ${window.formatCurrency(property.price)}
               </span>
            </div>
        </div>
        <div class="p-6 flex-1 flex flex-col">
            <div class="flex items-start justify-between mb-2">
                <h3 class="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
                    <a href="${window.getPropertyUrl(property.code)}">${property.title}</a>
                </h3>
            </div>
             <div class="flex items-center text-gray-500 text-sm mb-4">
                <i data-lucide="map-pin" class="w-4 h-4 mr-1"></i>
                ${property.location.city}, ${property.location.area}
            </div>
            
            <div class="grid grid-cols-3 gap-4 py-4 border-t border-gray-100 mt-auto">
                ${isLand ? `
                    <div class="col-span-3 flex items-center justify-center text-gray-600 bg-gray-50 rounded-lg py-2">
                        <i data-lucide="ruler" class="w-5 h-5 mr-3 text-primary"></i>
                        <span class="font-bold text-lg text-slate-800">${property.perches || 0}</span>
                        <span class="ml-2 text-sm text-gray-500 font-medium tracking-wide">Perches</span>
                    </div>
                ` : `
                    <div class="flex flex-col items-center justify-center text-gray-600">
                        <div class="flex items-center mb-1">
                            <i data-lucide="bed" class="w-4 h-4 mr-1.5 text-primary"></i>
                            <span class="font-semibold text-sm">${property.bedrooms || 0}</span>
                        </div>
                        <span class="text-xs text-gray-400">Beds</span>
                    </div>
                    <div class="flex flex-col items-center justify-center text-gray-600 border-l border-r border-gray-100">
                        <div class="flex items-center mb-1">
                            <i data-lucide="bath" class="w-4 h-4 mr-1.5 text-primary"></i>
                            <span class="font-semibold text-sm">${property.bathrooms || 0}</span>
                        </div>
                        <span class="text-xs text-gray-400">Baths</span>
                    </div>
                    <div class="flex flex-col items-center justify-center text-gray-600">
                        <div class="flex items-center mb-1">
                            <i data-lucide="maximize-2" class="w-4 h-4 mr-1.5 text-primary"></i>
                            <span class="font-semibold text-sm">${property.areaSize || 0}</span>
                        </div>
                        <span class="text-xs text-gray-400">sqft</span>
                    </div>
                    ${property.perches ? `
                        <div class="col-span-3 mt-3 pt-3 border-t border-gray-50 flex items-center justify-center text-gray-500 text-xs italic">
                            <i data-lucide="map" class="w-3.5 h-3.5 mr-2 text-primary"></i>
                            <span>Land: <span class="font-bold text-gray-700">${property.perches} Perches</span></span>
                        </div>
                    ` : ''}
                `}
            </div>

            <div class="mt-4 pt-4 border-t border-gray-100">
                <a href="${window.getPropertyUrl(property.code)}" class="block w-full text-center bg-gray-50 hover:bg-primary hover:text-white text-primary font-medium py-2 rounded-lg transition-colors duration-200">
                    View Details
                </a>
            </div>
        </div>
    </div>
`;
};

window.BlogCard = (post, index = 0) => {
    const delay = (index % 12) * 100; // Staggered delay logic
    return `
    <article class="glass-card rounded-2xl overflow-hidden hover:shadow-card-hover transition-all duration-300 group cursor-pointer" data-aos="fade-up" data-aos-delay="${Math.min(delay, 1200)}" onclick="window.location.href='blog-post.html?id=${post.id}'">
        <div class="relative h-56 overflow-hidden">
            <img src="${post.image}" alt="${post.title}" loading="lazy" decoding="async" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <div class="absolute top-4 left-4">
                <span class="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary text-xs font-bold rounded-full shadow-sm">${post.category}</span>
            </div>
        </div>

        <div class="p-8">
            <div class="flex items-center text-gray-400 text-xs mb-3">
                <i data-lucide="calendar" class="w-3 h-3 mr-1"></i>
                <span>${post.date}</span>
                <span class="mx-2">•</span>
                <i data-lucide="clock" class="w-3 h-3 mr-1"></i>
                <span>${post.readTime}</span>
            </div>
            <h3 class="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                <a href="blog-post.html?id=${post.id}">${post.title}</a>
            </h3>
            <p class="text-gray-600 text-sm leading-relaxed">
                ${post.excerpt}
            </p>
        </div>
    </article>
`;
};
