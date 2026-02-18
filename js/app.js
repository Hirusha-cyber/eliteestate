// State
let filteredProperties = [];
let currentCategory = 'house';

// Universal Page Initializer
const initCommonLayout = () => {
    try {
        const navContainer = document.getElementById('navbar-container');
        const footContainer = document.getElementById('footer-container');

        if (navContainer && typeof window.Navbar === 'function') {
            navContainer.innerHTML = window.Navbar();
        }
        if (footContainer && typeof window.Footer === 'function') {
            footContainer.innerHTML = window.Footer();
        }

        // Initialize icons
        if (window.lucide) {
            window.lucide.createIcons();
        }

        // Mobile Menu Logic
        const btn = document.getElementById('mobile-menu-btn');
        const menu = document.getElementById('mobile-menu');
        if (btn && menu) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                menu.classList.toggle('hidden');
            });
            // Close menu when clicking outside
            document.addEventListener('click', () => menu.classList.add('hidden'));
        }

        // Floating Call Button
        setupFloatingCall();

    } catch (error) {
        console.error("Layout initialization failed:", error);
    }
};

const setupFloatingCall = () => {
    if (document.getElementById('floating-call-btn')) return;
    const callBtn = document.createElement('a');
    callBtn.id = 'floating-call-btn';
    callBtn.href = `tel:+94775485445`;
    callBtn.className = "fixed bottom-8 right-8 z-[100] bg-primary text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center animate-bounce-slow";
    callBtn.innerHTML = `<i data-lucide="phone" class="w-6 h-6"></i>`;
    document.body.appendChild(callBtn);
    if (window.lucide) window.lucide.createIcons();
};

// Global Page Init (Used by Page-specific inits)
window.initPage = () => {
    initCommonLayout();
};

// --- HOME PAGE LOGIC ---

window.initHome = async () => {
    window.initPage();

    // 1. Setup filters first
    setupFilters();

    // 2. Set default category and render
    switchCategory('house');

    // 3. Populate locations
    populateLocationFilter();
};

window.initBlog = () => {
    window.initPage();
};

window.switchCategory = (category) => {
    currentCategory = category;

    // Update Tabs UI
    const tabHouse = document.getElementById('tab-houses');
    const tabLand = document.getElementById('tab-lands');

    if (category === 'house') {
        if (tabHouse) tabHouse.className = "px-6 py-2 rounded-lg text-sm font-bold transition-all bg-primary text-white shadow-md";
        if (tabLand) tabLand.className = "px-6 py-2 rounded-lg text-sm font-bold transition-all text-gray-500 hover:text-gray-700";
        const houseF = document.getElementById('house-filters');
        const landF = document.getElementById('land-filters');
        if (houseF) houseF.classList.remove('hidden');
        if (landF) landF.classList.add('hidden');
    } else {
        if (tabLand) tabLand.className = "px-6 py-2 rounded-lg text-sm font-bold transition-all bg-primary text-white shadow-md";
        if (tabHouse) tabHouse.className = "px-6 py-2 rounded-lg text-sm font-bold transition-all text-gray-500 hover:text-gray-700";
        const houseF = document.getElementById('house-filters');
        const landF = document.getElementById('land-filters');
        if (landF) landF.classList.remove('hidden');
        if (houseF) houseF.classList.add('hidden');
    }

    // Filter properties by category and render
    if (window.applyFilters) window.applyFilters();
};

const populateLocationFilter = () => {
    const locationList = document.getElementById('locations-list');
    if (!locationList) return;

    // Extract unique cities
    const cities = [...new Set(window.ALL_PROPERTIES.map(p => p.location.city))].sort();

    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        locationList.appendChild(option);
    });
};

const renderListings = () => {
    const grid = document.getElementById('listings-grid');
    const noResults = document.getElementById('no-results');

    if (!grid) return;

    if (filteredProperties.length === 0) {
        grid.innerHTML = '';
        noResults.classList.remove('hidden');
    } else {
        noResults.classList.add('hidden');
        grid.innerHTML = filteredProperties.map(property => window.PropertyCard(property)).join('');
    }

    // Re-init icons for new content
    if (window.lucide) window.lucide.createIcons();
};

const setupFilters = () => {
    // Filter Toggle
    const toggleBtn = document.getElementById('toggle-filters-btn');
    const filtersContainer = document.getElementById('filters-container');
    const filterBtnText = document.getElementById('filter-btn-text');

    if (toggleBtn && filtersContainer) {
        toggleBtn.addEventListener('click', () => {
            filtersContainer.classList.toggle('hidden');
            const isHidden = filtersContainer.classList.contains('hidden');
            filterBtnText.textContent = isHidden ? "Show Filters" : "Hide Filters";
        });
    }

    // Select all inputs
    const searchInput = document.getElementById('search');
    const locationInput = document.getElementById('filter-location-input');
    const typeSelect = document.getElementById('filter-type');

    // House Elements
    const sizeInput = document.getElementById('filter-size');
    const conditionSelect = document.getElementById('filter-condition');
    const bedsSelect = document.getElementById('filter-beds');
    const bathsSelect = document.getElementById('filter-baths');
    const parkingCheck = document.getElementById('filter-parking');

    // Land Elements
    const perchesInput = document.getElementById('filter-perches');
    const electricityCheck = document.getElementById('filter-electricity');
    const waterCheck = document.getElementById('filter-water');

    // Dual Slider Elements
    const minPriceInput = document.getElementById('price-min');
    const maxPriceInput = document.getElementById('price-max');
    const priceDisplay = document.getElementById('price-display');

    const resetBtn = document.getElementById('reset-filters');

    const updatePriceDisplay = () => {
        if (!minPriceInput || !maxPriceInput || !priceDisplay) return;
        const minVal = parseInt(minPriceInput.value);
        const maxVal = parseInt(maxPriceInput.value);
        const realMin = Math.min(minVal, maxVal);
        const realMax = Math.max(minVal, maxVal);
        priceDisplay.textContent = `${window.formatCurrency(realMin)} - ${window.formatCurrency(realMax)}`;
    };

    window.applyFilters = () => {
        if (!searchInput) return; // Guard

        const query = searchInput.value.toLowerCase();
        const location = locationInput ? locationInput.value : '';
        const type = typeSelect ? typeSelect.value : 'any';

        let minPrice = minPriceInput ? parseInt(minPriceInput.value) : 0;
        let maxPrice = maxPriceInput ? parseInt(maxPriceInput.value) : 200000000;
        if (minPrice > maxPrice) [minPrice, maxPrice] = [maxPrice, minPrice];

        filteredProperties = window.ALL_PROPERTIES.filter(p => {
            // Category Match
            const matchesCategory = (p.category || 'house') === currentCategory;
            if (!matchesCategory) return false;

            // Search & Basic
            const matchesSearch = p.title.toLowerCase().includes(query) ||
                p.location.city.toLowerCase().includes(query) ||
                p.location.area.toLowerCase().includes(query);
            const matchesLocation = location === '' || p.location.city.toLowerCase().includes(location.toLowerCase());
            const matchesType = type === 'any' || p.listingType === type;
            const matchesPrice = p.price >= minPrice && p.price <= maxPrice;

            if (currentCategory === 'house') {
                const minBeds = (bedsSelect && bedsSelect.value !== 'any') ? parseInt(bedsSelect.value) : 0;
                const minBaths = (bathsSelect && bathsSelect.value !== 'any') ? parseInt(bathsSelect.value) : 0;
                const minSize = (sizeInput && sizeInput.value) ? parseInt(sizeInput.value) : 0;
                const condition = conditionSelect ? conditionSelect.value : 'any';
                const parkingReq = parkingCheck ? parkingCheck.checked : false;

                const matchesBeds = p.bedrooms >= minBeds;
                const matchesBaths = p.bathrooms >= minBaths;
                const matchesSize = p.areaSize >= minSize;
                const matchesCondition = condition === 'any' || p.condition === condition;
                const matchesParking = !parkingReq || p.parking;

                return matchesSearch && matchesLocation && matchesType && matchesPrice &&
                    matchesBeds && matchesBaths && matchesSize && matchesCondition && matchesParking;
            } else {
                // Land logic
                const minPerches = (perchesInput && perchesInput.value) ? parseFloat(perchesInput.value) : 0;
                const elecReq = electricityCheck ? electricityCheck.checked : false;
                const waterReq = waterCheck ? waterCheck.checked : false;

                const matchesPerches = (p.perches || 0) >= minPerches;
                const matchesElec = !elecReq || p.electricity;
                const matchesWater = !waterReq || p.water;

                return matchesSearch && matchesLocation && matchesType && matchesPrice &&
                    matchesPerches && matchesElec && matchesWater;
            }
        });

        // Default sort: available -> reserved -> sold
        const statusOrder = { 'available': 1, 'reserved': 2, 'sold': 3 };
        filteredProperties.sort((a, b) => (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99));

        renderListings();
    };

    // Attach listeners
    const triggerInputs = [
        searchInput, locationInput, typeSelect,
        bedsSelect, bathsSelect, sizeInput, conditionSelect, parkingCheck,
        perchesInput, electricityCheck, waterCheck,
        minPriceInput, maxPriceInput
    ];
    triggerInputs.forEach(input => {
        if (input) input.addEventListener('input', () => {
            if (input === minPriceInput || input === maxPriceInput) updatePriceDisplay();
            applyFilters();
        });
    });

    // Init Display
    updatePriceDisplay();

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (locationInput) locationInput.value = '';
            if (typeSelect) typeSelect.value = 'any';

            // House resets
            if (sizeInput) sizeInput.value = '';
            if (conditionSelect) conditionSelect.value = 'any';
            if (bedsSelect) bedsSelect.value = 'any';
            if (bathsSelect) bathsSelect.value = 'any';
            if (parkingCheck) parkingCheck.checked = false;

            // Land resets
            if (perchesInput) perchesInput.value = '';
            if (electricityCheck) electricityCheck.checked = false;
            if (waterCheck) waterCheck.checked = false;

            if (minPriceInput) minPriceInput.value = 0;
            if (maxPriceInput) maxPriceInput.value = 200000000;

            updatePriceDisplay();
            applyFilters();
        });
    }
};

// --- PROPERTY DETAILS LOGIC ---

window.initPropertyDetails = async () => {
    window.initPage();
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (!code) { showError(); return; }
    const property = window.ALL_PROPERTIES.find(p => p.code === code);
    if (!property) { showError(); return; }
    renderPropertyDetails(property);
};

const showError = () => {
    const loading = document.getElementById('loading-state');
    const error = document.getElementById('error-state');
    if (loading) loading.classList.add('hidden');
    if (error) error.classList.remove('hidden');
};

const renderPropertyDetails = (property) => {
    const loading = document.getElementById('loading-state');
    const content = document.getElementById('property-content');
    if (loading) loading.classList.add('hidden');
    if (content) content.classList.remove('hidden');

    const breadcrumb = document.getElementById('breadcrumb-code');
    if (breadcrumb) breadcrumb.textContent = property.code;

    const title = document.getElementById('prop-title');
    if (title) title.textContent = property.title;

    const location = document.getElementById('prop-location');
    if (location) location.textContent = `${property.location.area}, ${property.location.city}`;

    const price = document.getElementById('prop-price');
    if (price) price.textContent = window.formatCurrency(property.price);

    const code = document.getElementById('prop-code');
    if (code) code.textContent = `Property ID: ${property.code}`;

    // House vs Land Stats Display
    const beds = document.getElementById('prop-beds');
    const baths = document.getElementById('prop-baths');
    const area = document.getElementById('prop-area');

    if ((property.category || 'house') === 'house') {
        if (beds) beds.textContent = property.bedrooms || 0;
        if (baths) baths.textContent = property.bathrooms || 0;
        if (area) area.textContent = `${property.areaSize || 0} sqft`;
    } else {
        if (area) {
            const areaContainer = area.parentElement;
            if (areaContainer.previousElementSibling) areaContainer.previousElementSibling.textContent = "Size";
            area.textContent = `${property.perches || 0} Perches`;
        }
        if (beds) beds.parentElement.classList.add('hidden');
        if (baths) baths.parentElement.classList.add('hidden');
    }

    const pType = document.getElementById('prop-type');
    if (pType) pType.textContent = property.listingType;

    const pDesc = document.getElementById('prop-description');
    if (pDesc) pDesc.textContent = property.description;

    const statusEl = document.getElementById('prop-status');
    if (statusEl) {
        statusEl.textContent = property.status;
        if (property.status === 'available') statusEl.classList.add('text-green-800');
        else if (property.status === 'reserved') statusEl.classList.add('text-yellow-800');
        else statusEl.classList.add('text-red-800');
    }

    const featuresContainer = document.getElementById('prop-features');
    if (featuresContainer) {
        if (property.features && property.features.length > 0) {
            featuresContainer.innerHTML = property.features.map(f => `
                <li class="flex items-center text-gray-600">
                    <i data-lucide="check-circle" class="w-4 h-4 mr-2 text-primary"></i>
                    <span class="text-sm">${f}</span>
                </li>
            `).join('');
        } else {
            featuresContainer.innerHTML = '<li class="text-gray-400">No specific features listed.</li>';
        }
    }

    setupGallery(property.images);

    // Utilities/Infrastructure Block
    const utilBlock = document.getElementById('utilities-block');
    if (utilBlock) {
        if (property.electricity || property.water || property.parking) {
            utilBlock.classList.remove('hidden');

            const elecEl = document.getElementById('util-electricity');
            if (elecEl) elecEl.className = property.electricity ? 'flex items-center text-sm font-medium text-slate-700' : 'flex items-center text-sm font-medium text-gray-400 line-through opacity-50';

            const waterEl = document.getElementById('util-water');
            if (waterEl) waterEl.className = property.water ? 'flex items-center text-sm font-medium text-slate-700' : 'flex items-center text-sm font-medium text-gray-400 line-through opacity-50';

            let parkingEl = document.getElementById('util-parking');
            if (!parkingEl) {
                parkingEl = document.createElement('div');
                parkingEl.id = 'util-parking';
                utilBlock.querySelector('.space-y-2').appendChild(parkingEl);
            }
            if (property.category === 'house') {
                parkingEl.classList.remove('hidden');
                parkingEl.className = property.parking ? 'flex items-center text-sm font-medium text-slate-700' : 'flex items-center text-sm font-medium text-gray-400 line-through opacity-50';
                parkingEl.innerHTML = `<i data-lucide="car" class="w-4 h-4 mr-2 text-slate-500"></i><span>Parking: Available</span>`;
            } else {
                parkingEl.classList.add('hidden');
            }
        } else {
            utilBlock.classList.add('hidden');
        }
    }

    const waBtn = document.getElementById('whatsapp-btn');
    if (waBtn) waBtn.href = generateWhatsAppLink(property);

    if (window.lucide) window.lucide.createIcons();
};

const setupGallery = (images) => {
    if (!images || images.length === 0) return;
    const mainImage = document.getElementById('main-image');
    const thumbnailsContainer = document.getElementById('gallery-thumbnails');
    if (!mainImage || !thumbnailsContainer) return;

    mainImage.src = images[0];
    thumbnailsContainer.innerHTML = images.map((img, index) => `
        <button class="flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-colors ${index === 0 ? 'border-primary' : 'border-transparent hover:border-gray-300'}" 
                onclick="changeMainImage('${img}', this)">
            <img src="${img}" class="w-full h-full object-cover" alt="Thumbnail ${index + 1}">
        </button>
    `).join('');

    window.changeMainImage = (src, btn) => {
        mainImage.src = src;
        const buttons = thumbnailsContainer.querySelectorAll('button');
        buttons.forEach(b => {
            b.classList.remove('border-primary');
            b.classList.add('border-transparent');
        });
        btn.classList.remove('border-transparent');
        btn.classList.add('border-primary');
    };
};
