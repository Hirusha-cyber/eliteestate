
// Universal Page Initializer
const initCommonLayout = () => {
    try {
        const navContainer = document.getElementById('navbar-container');
        const footContainer = document.getElementById('footer-container');
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        if (navContainer && typeof window.Navbar === 'function') {
            navContainer.innerHTML = window.Navbar();
        }
        if (footContainer && typeof window.Footer === 'function') {
            footContainer.innerHTML = window.Footer();

            // Initialize Footer CTA (Skip on contact page)
            const ctaContainer = document.getElementById('footer-cta-container');
            if (ctaContainer && typeof window.FooterCTA === 'function' && currentPage !== 'contact.html') {
                ctaContainer.innerHTML = window.FooterCTA();
            }
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

        // Glassify Selects
        initCustomSelects();

        // Initialize AOS animations if available
        if (window.AOS) {
            window.AOS.init({
                once: true,
                offset: 50,
                duration: 800,
                easing: 'ease-out-cubic',
            });
        }

    } catch (error) {
        console.error("Layout initialization failed:", error);
    }
};

const setupFloatingCall = () => {
    let callBtn = document.getElementById('floating-call-btn');
    if (!callBtn) {
        callBtn = document.createElement('a');
        callBtn.id = 'floating-call-btn';
        callBtn.href = `tel:+94775485445`;
        callBtn.setAttribute('aria-label', 'Call Us Now');
        callBtn.className = "fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[100] bg-primary text-white p-3.5 md:p-4 rounded-full shadow-2xl hover:scale-110 transition duration-500 flex items-center justify-center animate-bounce-slow opacity-100 transform translate-y-0";
        callBtn.innerHTML = `<i data-lucide="phone" class="w-6 h-6"></i>`;
        document.body.appendChild(callBtn);
        if (window.lucide) window.lucide.createIcons();
    }

    // Scroll Logic to Replace Floating Button with Footer CTA
    window.addEventListener('scroll', () => {
        const ctaContainer = document.getElementById('footer-cta-container');
        if (!ctaContainer) return;

        const rect = ctaContainer.getBoundingClientRect();
        const triggerPoint = window.innerHeight - 100; // Switch when CTA is near bottom of viewport

        if (rect.top < triggerPoint) {
            // Hide floating button when CTA is visible
            callBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-10');
            callBtn.classList.remove('opacity-100', 'translate-y-0');
        } else {
            // Show floating button when scrolling up
            callBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-10');
            callBtn.classList.add('opacity-100', 'translate-y-0');
        }
    });
};

// Global Page Init (Used by Page-specific inits)
window.initPage = () => {
    initCommonLayout();
};

const initCustomSelects = () => {
    const selects = document.querySelectorAll('select.glass-input');

    selects.forEach(select => {
        if (select.parentElement.classList.contains('custom-select-container')) return;

        // Hide native select
        select.style.display = 'none';

        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'custom-select-container';
        select.parentNode.insertBefore(wrapper, select);
        wrapper.appendChild(select);

        // Create trigger
        const trigger = document.createElement('div');
        trigger.className = 'glass-input custom-select-trigger';
        const selectedOption = select.options[select.selectedIndex];
        trigger.innerHTML = `
            <span>${selectedOption ? selectedOption.text : ''}</span>
            <i data-lucide="chevron-down" class="w-4 h-4 text-gray-400"></i>
        `;
        wrapper.appendChild(trigger);

        // Create options container
        const optionsList = document.createElement('div');
        optionsList.className = 'custom-options';

        // Add options
        Array.from(select.options).forEach((option, index) => {
            const optDiv = document.createElement('div');
            optDiv.className = `custom-option ${index === select.selectedIndex ? 'selected' : ''}`;
            optDiv.textContent = option.text;
            optDiv.dataset.value = option.value;

            optDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                select.value = option.value;
                trigger.querySelector('span').textContent = option.text;

                // Sync UI
                optionsList.querySelectorAll('.custom-option').forEach(el => el.classList.remove('selected'));
                optDiv.classList.add('selected');

                optionsList.classList.remove('show');

                // Trigger change event for filtering
                select.dispatchEvent(new Event('change'));
                select.dispatchEvent(new Event('input'));
            });

            optionsList.appendChild(optDiv);
        });

        wrapper.appendChild(optionsList);

        // Toggle logic
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close other open selects
            document.querySelectorAll('.custom-options.show').forEach(el => {
                if (el !== optionsList) el.classList.remove('show');
            });
            optionsList.classList.toggle('show');
        });

        // Close on click outside
        document.addEventListener('click', () => {
            optionsList.classList.remove('show');
        });
    });

    if (window.lucide) window.lucide.createIcons();
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

    const blogContainer = document.getElementById('blog-posts-grid');
    if (blogContainer && window.BLOG_POSTS) {
        blogContainer.innerHTML = window.BLOG_POSTS.map((post, index) => window.BlogCard(post, index)).join('');
        if (window.lucide) window.lucide.createIcons();
    }
};

window.initBlogPost = () => {
    window.initPage();

    // Get post ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId || !window.BLOG_POSTS) {
        window.location.href = 'blog.html';
        return;
    }

    const post = window.BLOG_POSTS.find(p => p.id === postId);

    if (!post) {
        window.location.href = 'blog.html';
        return;
    }

    // Populate page content
    document.title = `${post.title} - Elite Estates`;
    const titleEl = document.getElementById('post-title');
    const breadcrumbTitleEl = document.getElementById('breadcrumb-title');
    const dateEl = document.getElementById('post-date');
    const readTimeEl = document.getElementById('post-read-time');
    const categoryEl = document.getElementById('post-category');
    const imageEl = document.getElementById('post-image');
    const contentEl = document.getElementById('post-content');

    if (titleEl) titleEl.textContent = post.title;
    if (breadcrumbTitleEl) breadcrumbTitleEl.textContent = post.title;
    if (dateEl) dateEl.textContent = post.date;
    if (readTimeEl) readTimeEl.textContent = post.readTime;
    if (categoryEl) categoryEl.textContent = post.category;
    if (imageEl) imageEl.src = post.image;
    if (contentEl) {
        contentEl.innerHTML = post.content;
    }

    if (window.lucide) window.lucide.createIcons();
};

window.switchCategory = (category) => {
    currentCategory = category;

    // Update Tabs UI
    const tabHouse = document.getElementById('tab-houses');
    const tabLand = document.getElementById('tab-lands');

    if (category === 'house') {
        if (tabHouse) tabHouse.className = "px-6 py-2 rounded-lg text-sm font-bold transition bg-primary text-white shadow-md";
        if (tabLand) tabLand.className = "px-6 py-2 rounded-lg text-sm font-bold transition text-gray-500 hover:text-gray-700";
        const houseF = document.getElementById('house-filters');
        const landF = document.getElementById('land-filters');
        if (houseF) houseF.classList.remove('hidden');
        if (landF) landF.classList.add('hidden');
    } else {
        if (tabLand) tabLand.className = "px-6 py-2 rounded-lg text-sm font-bold transition bg-primary text-white shadow-md";
        if (tabHouse) tabHouse.className = "px-6 py-2 rounded-lg text-sm font-bold transition text-gray-500 hover:text-gray-700";
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
        grid.innerHTML = filteredProperties.map((property, index) => window.PropertyCard(property, index)).join('');
    }

    // Re-init icons for new content
    if (window.lucide) window.lucide.createIcons();

    // Refresh animations for newly rendered DOM content
    if (window.AOS) setTimeout(() => { window.AOS.refresh(); }, 100);
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

    // Sticky Header Logic
    const stickyHeader = document.getElementById('sticky-search-header');
    const heroSection = document.querySelector('.relative.overflow-hidden.pb-32');

    // Switcher Logic
    const switcherBtn = document.getElementById('header-switcher-btn');
    const stickySearchContainer = document.getElementById('sticky-search-container');
    const stickyNavContainer = document.getElementById('sticky-nav-container');
    let isSearchMode = true;

    if (switcherBtn && stickySearchContainer && stickyNavContainer) {
        switcherBtn.addEventListener('click', () => {
            isSearchMode = !isSearchMode;
            updateStickyHeaderState();
        });
    }

    function updateStickyHeaderState() {
        if (!stickySearchContainer || !stickyNavContainer || !switcherBtn) return;

        if (isSearchMode) {
            stickySearchContainer.classList.remove('hidden');
            stickyNavContainer.classList.add('hidden');
            stickyNavContainer.classList.remove('flex'); // consistent display handling

            switcherBtn.innerHTML = '<i data-lucide="align-justify" class="w-5 h-5"></i>'; // Menu Icon to switch to nav
        } else {
            stickySearchContainer.classList.add('hidden');
            stickyNavContainer.classList.remove('hidden');
            stickyNavContainer.classList.add('flex'); // Ensure flex flow

            switcherBtn.innerHTML = '<i data-lucide="search" class="w-5 h-5"></i>'; // Search Icon to switch back
        }
        if (window.lucide) window.lucide.createIcons();
    }

    // Scroll Trigger Logic
    if (stickyHeader) {
        window.addEventListener('scroll', () => {
            // Threshold for showing sticky header (navbar height approx)
            const navHeight = 100;
            const mainSearch = document.getElementById('main-search-input');
            const searchRect = mainSearch ? mainSearch.getBoundingClientRect() : { bottom: 0 };

            // Show sticky header if scrolled past nav
            if (window.scrollY > navHeight) {
                stickyHeader.classList.remove('translate-y-[-150%]');
                stickyHeader.classList.add('translate-y-0');

                // If search bar is scrolled out of view, switch to Search Mode
                const searchVisibleOffset = 80;
                const shouldShowSearch = searchRect.bottom < searchVisibleOffset;

                // Only update if state needs changing to prevent constant re-renders/flicker
                if (isSearchMode !== shouldShowSearch) {
                    isSearchMode = shouldShowSearch;
                    updateStickyHeaderState();
                }
            } else {
                stickyHeader.classList.remove('translate-y-0');
                stickyHeader.classList.add('translate-y-[-150%]');

                // Reset to Nav mode when hidden
                if (isSearchMode !== false) {
                    isSearchMode = false;
                    updateStickyHeaderState();
                }
            }

            // Scroll indicator fade out independent of sticky header
            const scrollIndicator = document.getElementById('scroll-indicator');
            if (scrollIndicator) {
                if (window.scrollY > 20) {
                    scrollIndicator.classList.add('opacity-0', 'pointer-events-none');
                } else {
                    scrollIndicator.classList.remove('opacity-0', 'pointer-events-none');
                }
            }
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

    // --- Dynamic Price Range Scaling ---
    let absoluteMaxPrice = 100000000; // default fallback
    if (window.ALL_PROPERTIES && window.ALL_PROPERTIES.length > 0) {
        const prices = window.ALL_PROPERTIES.map(p => p.price);
        absoluteMaxPrice = Math.max(...prices);

        // Polished ceiling: Round up to nearest 500k or 1M for a cleaner UI
        const roundingFactor = absoluteMaxPrice > 10000000 ? 1000000 : 500000;
        absoluteMaxPrice = Math.ceil(absoluteMaxPrice / roundingFactor) * roundingFactor;
    }

    if (minPriceInput && maxPriceInput) {
        minPriceInput.max = absoluteMaxPrice;
        maxPriceInput.max = absoluteMaxPrice;
        maxPriceInput.value = absoluteMaxPrice;
        // Adjust step for smoother sliding vs precision
        const step = absoluteMaxPrice > 50000000 ? 500000 : (absoluteMaxPrice > 10000000 ? 100000 : 50000);
        minPriceInput.step = step;
        maxPriceInput.step = step;
    }

    const resetBtn = document.getElementById('reset-filters');

    const updatePriceDisplay = () => {
        if (!minPriceInput || !maxPriceInput || !priceDisplay) return;
        const minVal = parseInt(minPriceInput.value);
        const maxVal = parseInt(maxPriceInput.value);
        const realMin = Math.min(minVal, maxVal);
        const realMax = Math.max(minVal, maxVal);
        priceDisplay.textContent = `${window.formatCurrency(realMin)} - ${window.formatCurrency(realMax)}`;
    };

    window.applyFilters = (shouldScroll = false) => {
        const searchInput = document.getElementById('search');
        const mainSearchInput = document.getElementById('main-search-input');

        let query = (mainSearchInput ? mainSearchInput.value : (searchInput ? searchInput.value : '')).toLowerCase().trim();
        const keywords = query ? query.split(/[\s,]+/).filter(k => k.length > 0) : [];
        const hasSearch = keywords.length > 0;

        const location = locationInput ? locationInput.value : '';
        const type = typeSelect ? typeSelect.value : 'any';

        let minPrice = minPriceInput ? parseInt(minPriceInput.value) : 0;
        let maxPrice = maxPriceInput ? parseInt(maxPriceInput.value) : absoluteMaxPrice;
        if (minPrice > maxPrice) [minPrice, maxPrice] = [maxPrice, minPrice];

        filteredProperties = window.ALL_PROPERTIES.filter(p => {
            // Category Match: STRICT. Search filters within the current category.
            const matchesCategory = (p.category || 'house') === currentCategory;
            if (!matchesCategory) return false;

            // Search Logic
            let searchScore = 0;
            let distinctKeywordsMatched = 0;
            let isExactMatch = false;

            if (hasSearch) {
                const searchFields = [
                    (p.code || '').toLowerCase(),
                    (p.title || '').toLowerCase(),
                    (p.description || '').toLowerCase(),
                    (p.location.city || '').toLowerCase(),
                    (p.location.area || '').toLowerCase(),
                    (p.location.district || '').toLowerCase(),
                    ...(p.features || []).map(f => f.toLowerCase())
                ];

                // Exact match check
                isExactMatch = searchFields.some(field => field === query || (query.length > 3 && field.includes(query)));

                // Count distinct keywords matched
                distinctKeywordsMatched = keywords.reduce((count, word) => {
                    return count + (searchFields.some(field => field.includes(word)) ? 1 : 0);
                }, 0);

                searchScore = distinctKeywordsMatched; // Base score is distinct matches

                // If keywords provided but no match, filter out
                if (distinctKeywordsMatched === 0 && !isExactMatch) return false;
            }

            p._isExactMatch = isExactMatch;
            p._matchesAllKeywords = distinctKeywordsMatched === keywords.length;
            p._searchScore = searchScore;

            const matchesLocation = location === '' || p.location.city.toLowerCase().includes(location.toLowerCase());
            const matchesType = type === 'any' || p.listingType === type;
            const matchesPrice = p.price >= minPrice && p.price <= maxPrice;

            // Property Specific Filters - Apply based on currentCategory, even if search is active
            if (currentCategory === 'house') {
                const minBeds = (bedsSelect && bedsSelect.value !== 'any') ? parseInt(bedsSelect.value) : 0;
                const minBaths = (bathsSelect && bathsSelect.value !== 'any') ? parseInt(bathsSelect.value) : 0;
                const minSize = (sizeInput && sizeInput.value) ? parseInt(sizeInput.value) : 0;
                const condition = conditionSelect ? conditionSelect.value : 'any';
                const parkingReq = parkingCheck ? parkingCheck.checked : false;

                const matchesBeds = (p.bedrooms || 0) >= minBeds;
                const matchesBaths = (p.bathrooms || 0) >= minBaths;
                const matchesSize = (p.areaSize || 0) >= minSize;
                const matchesCondition = condition === 'any' || p.condition === condition;
                const matchesParking = !parkingReq || p.parking;

                // Strict filtering even during search
                return matchesLocation && matchesType && matchesPrice &&
                    matchesBeds && matchesBaths && matchesSize && matchesCondition && matchesParking;
            } else { // currentCategory === 'land'
                // Land logic
                const minPerches = (perchesInput && perchesInput.value) ? parseFloat(perchesInput.value) : 0;
                const elecReq = electricityCheck ? electricityCheck.checked : false;
                const waterReq = waterCheck ? waterCheck.checked : false;

                const matchesPerches = (p.perches || 0) >= minPerches;
                const matchesElec = !elecReq || p.electricity;
                const matchesWater = !waterReq || p.water;

                return matchesLocation && matchesType && matchesPrice &&
                    matchesPerches && matchesElec && matchesWater;
            }
        });

        // Sorting: 
        // 1. Exact matches
        // 2. Matches ALL keywords
        // 3. Highest keyword matches
        // 4. Status priority (available first)
        const statusOrder = { 'available': 1, 'reserved': 2, 'sold': 3 };
        filteredProperties.sort((a, b) => {
            if (hasSearch) {
                // Exact Match
                if (a._isExactMatch && !b._isExactMatch) return -1;
                if (!a._isExactMatch && b._isExactMatch) return 1;

                // Match All Keywords
                if (a._matchesAllKeywords && !b._matchesAllKeywords) return -1;
                if (!a._matchesAllKeywords && b._matchesAllKeywords) return 1;

                // Match Count
                if (a._searchScore !== b._searchScore) {
                    return b._searchScore - a._searchScore;
                }
            }

            // Status Priority
            const statusA = statusOrder[a.status] || 99;
            const statusB = statusOrder[b.status] || 99;
            if (statusA !== statusB) return statusA - statusB;

            // Tiebreaker: sort by property code (e.g. EP-001 < EP-002)
            return (a.code || '').localeCompare(b.code || '', undefined, { numeric: true, sensitivity: 'base' });
        });

        renderListings();

        // --- Auto Scroll Logic ---
        if (shouldScroll) {
            // Target the main container so the "Houses & Apartments / Land" tabs stay perfectly visible
            const scrollTarget = document.getElementById('listings');
            const hasQuery = (mainSearchInput?.value.trim() !== '') || (stickySearchInput?.value.trim() !== '');
            if (scrollTarget && hasQuery) {
                setTimeout(() => {
                    const stickyHeader = document.getElementById('sticky-search-header');
                    // Calculate precise offset so tabs slide perfectly underneath the glassy header
                    const offset = stickyHeader ? stickyHeader.offsetHeight + 20 : 75;
                    const topPosition = scrollTarget.getBoundingClientRect().top + window.pageYOffset - offset;

                    window.scrollTo({
                        top: topPosition,
                        behavior: 'smooth'
                    });
                }, 150);
            }
        }

        // --- UI Feedback: Active Tab Styles ---
        const tabHouse = document.getElementById('tab-houses');
        const tabLand = document.getElementById('tab-lands');
        if (tabHouse && tabLand) {
            const activeClass = "px-6 py-2 rounded-lg text-sm font-bold transition bg-primary text-white shadow-md";
            const inactiveClass = "px-6 py-2 rounded-lg text-sm font-bold transition text-gray-500 hover:text-gray-700";
            tabHouse.className = currentCategory === 'house' ? activeClass : inactiveClass;
            tabLand.className = currentCategory === 'land' ? activeClass : inactiveClass;
        }
    };

    // Attach listeners
    const mainSearchInput = document.getElementById('main-search-input');
    const mainSearchBtn = document.getElementById('main-search-btn');
    const stickySearchInput = document.getElementById('sticky-search-input');
    const stickySearchBtn = document.getElementById('sticky-search-btn');

    const triggerInputs = [
        searchInput, mainSearchInput, stickySearchInput, locationInput, typeSelect,
        bedsSelect, bathsSelect, sizeInput, conditionSelect, parkingCheck,
        perchesInput, electricityCheck, waterCheck,
        minPriceInput, maxPriceInput
    ];
    triggerInputs.forEach(input => {
        if (!input) return;
        input.addEventListener('input', () => {
            if (input === minPriceInput || input === maxPriceInput) updatePriceDisplay();

            // Sync search inputs
            const val = input.value;
            if (input === mainSearchInput || input === stickySearchInput || input === searchInput) {
                if (searchInput && searchInput !== input) searchInput.value = val;
                if (mainSearchInput && mainSearchInput !== input) mainSearchInput.value = val;
                if (stickySearchInput && stickySearchInput !== input) stickySearchInput.value = val;
            }

            applyFilters();
        });
    });

    if (mainSearchBtn) {
        mainSearchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            applyFilters(true);
        });
    }

    if (stickySearchBtn) {
        stickySearchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            applyFilters(true);
        });
    }

    // Enter key support for search inputs
    const handleEnterKey = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            applyFilters(true);
            e.target.blur();
        }
    };

    if (mainSearchInput) mainSearchInput.addEventListener('keydown', handleEnterKey);
    if (stickySearchInput) stickySearchInput.addEventListener('keydown', handleEnterKey);
    if (searchInput) searchInput.addEventListener('keydown', handleEnterKey);

    // Init Display
    updatePriceDisplay();

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (mainSearchInput) mainSearchInput.value = '';
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
    const landSize = document.getElementById('prop-land');
    const landContainer = document.getElementById('prop-land-container');

    if ((property.category || 'house') === 'house') {
        if (beds) beds.textContent = property.bedrooms || 0;
        if (baths) baths.textContent = property.bathrooms || 0;
        if (area) area.textContent = `${property.areaSize || 0} sqft`;

        // Show land size for houses if available
        if (landSize && property.perches) {
            landSize.textContent = `${property.perches} Perches`;
            if (landContainer) landContainer.classList.remove('hidden');
        } else if (landContainer) {
            landContainer.classList.add('hidden');
        }

        const conditionEl = document.getElementById('prop-condition');
        const conditionCont = document.getElementById('prop-condition-container');
        if (conditionEl && property.condition) {
            conditionEl.textContent = property.condition;
            if (conditionCont) conditionCont.classList.remove('hidden');
        } else if (conditionCont) {
            conditionCont.classList.add('hidden');
        }
    } else {
        // For pure land, show perches in the main area slot
        if (area) {
            const areaContainer = area.parentElement;
            if (areaContainer.previousElementSibling) areaContainer.previousElementSibling.textContent = "Total Area";
            area.textContent = `${property.perches || 0} Perches`;
        }
        // Hide redundant land container and house-specific fields
        if (landContainer) landContainer.classList.add('hidden');
        const conditionCont = document.getElementById('prop-condition-container');
        if (conditionCont) conditionCont.classList.add('hidden');
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

            // Helper to update status cards
            const updateUtil = (id, available) => {
                const status = document.getElementById(`util-${id}-status`);
                const indicator = document.getElementById(`util-${id}-indicator`);
                const card = document.getElementById(`util-${id}-card`);

                if (status) status.textContent = available ? 'Available' : 'Not Available';
                if (indicator) {
                    indicator.className = available
                        ? 'w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'
                        : 'w-2 h-2 rounded-full bg-gray-300';
                }
                if (card) {
                    card.style.opacity = available ? '1' : '0.6';
                    if (!available) card.classList.add('bg-gray-50/50');
                    else card.classList.remove('bg-gray-50/50');
                }
            };

            updateUtil('electricity', property.electricity);
            updateUtil('water', property.water);

            const parkingCard = document.getElementById('util-parking-card');
            if (property.category === 'house' && property.parking !== undefined) {
                if (parkingCard) parkingCard.classList.remove('hidden');
                updateUtil('parking', property.parking);
            } else if (parkingCard) {
                parkingCard.classList.add('hidden');
            }
        } else {
            utilBlock.classList.add('hidden');
        }
    }

    const waBtn = document.getElementById('whatsapp-btn');
    if (waBtn) waBtn.href = generateWhatsAppLink(property);

    if (window.lucide) window.lucide.createIcons();

    // Refresh AOS animations since we just made the hidden wrapper visible
    if (window.AOS) {
        setTimeout(() => { window.AOS.refresh(); }, 100);
    }
};

let currentImageIndex = 0;
let propertyImages = [];

const setupGallery = (images) => {
    if (!images || images.length === 0) return;
    propertyImages = images;
    currentImageIndex = 0;

    const mainImage = document.getElementById('main-image');
    const thumbnailsContainer = document.getElementById('gallery-thumbnails');
    if (!mainImage || !thumbnailsContainer) return;

    mainImage.src = images[0];
    thumbnailsContainer.innerHTML = images.map((img, index) => `
        <button class="flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-colors thumbnail-btn ${index === 0 ? 'border-primary' : 'border-transparent hover:border-gray-300'}" 
                onclick="changeMainImage(${index})">
            <img src="${img}" class="w-full h-full object-cover" alt="Thumbnail ${index + 1}">
        </button>
    `).join('');

    // Update scroll buttons visibility
    setTimeout(updateScrollButtons, 100);
    thumbnailsContainer.addEventListener('scroll', updateScrollButtons);
    window.addEventListener('resize', updateScrollButtons);

    window.changeMainImage = (index) => {
        currentImageIndex = index;
        const src = propertyImages[currentImageIndex];
        mainImage.style.opacity = '0.5';
        setTimeout(() => {
            mainImage.src = src;
            mainImage.style.opacity = '1';
        }, 150);

        const buttons = thumbnailsContainer.querySelectorAll('.thumbnail-btn');
        buttons.forEach((b, i) => {
            if (i === index) {
                b.classList.remove('border-transparent');
                b.classList.add('border-primary');
                // Auto-scroll thumbnail into view
                b.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } else {
                b.classList.remove('border-primary');
                b.classList.add('border-transparent');
            }
        });
    };

    window.nextImage = () => {
        let nextIndex = (currentImageIndex + 1) % propertyImages.length;
        window.changeMainImage(nextIndex);
    };

    window.prevImage = () => {
        let prevIndex = (currentImageIndex - 1 + propertyImages.length) % propertyImages.length;
        window.changeMainImage(prevIndex);
    };

    window.scrollThumbnails = (direction) => {
        const scrollAmount = 300;
        if (direction === 'left') {
            thumbnailsContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            thumbnailsContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };
};

function updateScrollButtons() {
    const container = document.getElementById('gallery-thumbnails');
    const leftBtn = document.getElementById('scroll-left-btn');
    const rightBtn = document.getElementById('scroll-right-btn');

    if (!container || !leftBtn || !rightBtn) return;

    const hasScroll = container.scrollWidth > container.clientWidth;

    if (!hasScroll) {
        leftBtn.classList.add('opacity-0', 'pointer-events-none');
        rightBtn.classList.add('opacity-0', 'pointer-events-none');
        return;
    }

    // Show left button if not at start
    if (container.scrollLeft > 10) {
        leftBtn.classList.remove('opacity-0', 'pointer-events-none');
    } else {
        leftBtn.classList.add('opacity-0', 'pointer-events-none');
    }

    // Show right button if not at end
    if (container.scrollLeft + container.clientWidth < container.scrollWidth - 10) {
        rightBtn.classList.remove('opacity-0', 'pointer-events-none');
    } else {
        rightBtn.classList.add('opacity-0', 'pointer-events-none');
    }
}
