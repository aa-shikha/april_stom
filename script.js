// --- DOM Elements ---
const navbar = document.getElementById('navbar');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;
const scrollTopBtn = document.getElementById('scrollToTop');
const searchInput = document.getElementById('destSearch');
const filterBtns = document.querySelectorAll('.tag');
const destCards = document.querySelectorAll('.destination-card');
const noResults = document.getElementById('noResults');

// --- 1. Theme Logic (Optimized) ---
// Sirf check karo agar elements exist karte hain taaki error na aaye
if (themeToggle) {
 themeToggle.addEventListener('click', () => {
body.classList.toggle('light-theme');
body.classList.toggle('dark-theme');

const isLight = body.classList.contains('light-theme');
if (themeIcon) {
themeIcon.classList.toggle('fa-moon', isLight);
 themeIcon.classList.toggle('fa-sun', !isLight);
 }
 });
}

// --- 2. Scroll Effects ---
window.addEventListener('scroll', () => {
 // Navbar
 if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);

// Scroll to Top
 if (scrollTopBtn) {
 scrollTopBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
}
});

if (scrollTopBtn) {
scrollTopBtn.addEventListener('click', () => {
 window.scrollTo({ top: 0, behavior: 'smooth' });
 });
}

// --- 3. Destination Filter (Refined) ---
function filterDestinations() {
if (!searchInput) return; // Guard clause

 const query = searchInput.value.toLowerCase();
const activeTag = document.querySelector('.tag.active-tag');
const activeFilter = activeTag ? activeTag.getAttribute('data-filter').toLowerCase() : 'all';

let visibleCount = 0;

 destCards.forEach(card => {
 const name = card.querySelector('.location-name').textContent.toLowerCase();
 const country = card.querySelector('.location-sub').textContent.toLowerCase();
 const category = card.getAttribute('data-category').toLowerCase();

const matchesSearch = name.includes(query) || country.includes(query);
const matchesTag = (activeFilter === 'all' || category === activeFilter);

 if (matchesSearch && matchesTag) {
 card.style.display = 'block';
 visibleCount++;
 } else {
 card.style.display = 'none';
 }
 });

 if (noResults) noResults.style.display = (visibleCount === 0) ? 'block' : 'none';
}

if (searchInput) searchInput.addEventListener('input', filterDestinations);

filterBtns.forEach(btn => {
 btn.addEventListener('click', () => {
 filterBtns.forEach(tag => tag.classList.remove('active-tag'));
 btn.classList.add('active-tag');
 filterDestinations();
 });
});

// --- 4. NEW: Booking Section Logic (Important!) ---
// Passengers Counter
function changePax(change) {
 const paxValueSpan = document.getElementById('pax-count-val');
if (paxValueSpan) {
 let currentPax = parseInt(paxValueSpan.innerText);
currentPax += change;
 if (currentPax < 1) currentPax = 1;
paxValueSpan.innerText = currentPax;
 }
}
document.addEventListener('DOMContentLoaded', () => {
 // --- DOM Elements ---
 const body = document.body;
 const paxValueSpan = document.getElementById('pax-count-val');
 const checkoutSection = document.getElementById('checkout-section');
 const modeBtns = document.querySelectorAll('.mode-btn');

 // Result Containers
 const containers = {
 flights: document.querySelector('.flight-results-container'),
 trains: document.getElementById('trains-list'),
 buses: document.getElementById('buses-list')
 };

 let selectedFlight = null;

// --- 1. Mode Switcher (Flights/Trains/Buses) ---
 modeBtns.forEach(btn => {
 btn.addEventListener('click', () => {
 const mode = btn.getAttribute('data-mode');

 // Toggle Active Class
 modeBtns.forEach(b => b.classList.remove('active'));
 btn.classList.add('active');

 // Switch Containers
Object.keys(containers).forEach(key => {
 if (containers[key]) {
 containers[key].style.display = (key === mode) ? 'block' : 'none';
 }
 });

 // Reset UI
if (checkoutSection) checkoutSection.classList.remove('active');
 resetSelectButtons();
 });
 });

 // --- 2. Passengers Counter ---
 window.changePax = function(change) {
if (!paxValueSpan) return;
 let currentPax = parseInt(paxValueSpan.innerText);
 currentPax += change;
 if (currentPax < 1) currentPax = 1; paxValueSpan.innerText = currentPax;

 // Update price if already selected
 updateCheckoutUI();
 };

 // --- 3. Selection & Checkout Logic (Global Event) ---

// Ye variable global hona chahiye taaki passengers badalne par price update ho sake
let selectedTransport = null; 

document.addEventListener('click', (e) => {
    // 1. Check agar click 'Select' button par hua hai
    if (e.target.classList.contains('select-btn')) {
        const btn = e.target;
        
        // Sabse important: closest '.flight-card' dhoondna (Humein flights/trains/buses teeno mein yahi class use ki hai)
        const card = btn.closest('.flight-card');
        if (!card) return;

        // 2. Data nikalna (Airline/Train ka naam aur Price)
        const name = card.querySelector('.airline-name').innerText;
        const priceText = card.querySelector('.amount').innerText;
        
        // Price mein se ₹ aur comma hata kar number mein convert karna
        const priceVal = parseInt(priceText.replace(/[₹,]/g, ''));

        // 3. Global variable mein save karna
        selectedTransport = { 
            name: name, 
            pricePerPerson: priceVal 
        };

        // 4. UI Reset: Saare buttons ko wapas "Select" karna
        // (Ye function aapne niche resetSelectButtons ke naam se banaya hai)
        resetSelectButtons();

        // 5. Clicked button ko "Selected" dikhana
        btn.innerText = "Selected ✓";
        btn.style.background = "#2ecc71"; // Success Green color

        // 6. Checkout Section (Proceed to Pay) dikhana
        updateCheckoutUI();
    }
});

// --- Helper: Update Checkout Box ---
function updateCheckoutUI() {
    const checkoutSection = document.getElementById('checkout-section');
    const paxValueSpan = document.getElementById('pax-count-val');
    
    // Agar koi transport select nahi hai ya element nahi mila toh return kar jao
    if (!selectedTransport || !checkoutSection) return;

    const paxCount = parseInt(paxValueSpan.innerText) || 1;
    const total = selectedTransport.pricePerPerson * paxCount;

    // Checkout labels update karna
    if (document.getElementById('display-airline')) {
        document.getElementById('display-airline').innerText = selectedTransport.name;
    }
    if (document.getElementById('display-pax')) {
        document.getElementById('display-pax').innerText = paxCount;
    }
    if (document.getElementById('display-total')) {
        document.getElementById('display-total').innerText = total.toLocaleString('en-IN');
    }

    // Checkout box ko visible karna
    checkoutSection.style.display = 'block'; 
    checkoutSection.classList.add('active');
    
    // Smoothly scroll karke user ko checkout box dikhana
    checkoutSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Helper: Reset all select buttons
 function resetSelectButtons() {
 document.querySelectorAll('.select-btn').forEach(b => {
 b.innerText = "Select";
 b.style.background = "#002b26";
});
}
});

let bookingState = {
guests: 2,
 price: 2490,
 pkgName: "Signature"
};

// 1. Update Guests
function updateGuests(val) {
 bookingState.guests += val;
 if (bookingState.guests < 1) bookingState.guests = 1;

 document.getElementById('guest-display').innerText = bookingState.guests;
 document.getElementById('sumGuests').innerText = bookingState.guests;
     calculateTotal();
}

// 2. Set Package
function setPackage(btn, price) {
 document.querySelectorAll('.pkg-btn').forEach(b => b.classList.remove('active'));
 btn.classList.add('active');

 bookingState.price = price;
 bookingState.pkgName = btn.innerText;

 document.getElementById('sumPkg').innerText = bookingState.pkgName;
 document.getElementById('sumPerPerson').innerText = "$" + price.toLocaleString();
 calculateTotal();
}

// 3. Sync Form Data
function syncBooking() {
const dest = document.getElementById('formDest').value;
 const date = document.getElementById('formDate').value;
 
 document.getElementById('sumDest').innerText = dest;
document.getElementById('sumDate').innerText = date || "—";
}

// 4. Calculate Total (Fixed for Indian Rupee)
function calculateTotal() {
    // Math: Guests aur Price ka multiply
    const total = bookingState.guests * bookingState.price;
    
    // UI Element dhoondna
    const sumTotal = document.getElementById('sumTotal');
    
    if (sumTotal) {
        // "$" ko hata kar "₹" kiya aur format 'en-IN' set kiya
        sumTotal.innerText = "₹" + total.toLocaleString('en-IN');
    }
}
// 5. Basic Validation
function validateForm() {
 const name = document.getElementById('formName').value;
const email = document.getElementById('formEmail').value;

 if (!name || !email) {
alert("Please fill in your details!");
// Yahan aap error class toggle kar sakte hain
} else {
 alert("Booking Confirmed for " + name + "!");
 }
}

// 1. Confirm Booking Function
function validateForm() {
// Calendar overlap aur default behavior rokne ke liye
event.preventDefault(); 
 event.stopPropagation(); 

 const name = document.getElementById('formName').value;
const email = document.getElementById('formEmail').value;
 const total = document.getElementById('sumTotal').innerText;

 if (!name || !email || email === "") {
 alert("Please fill your details first!");
 return;
 }

// Modal mein information set karna
 document.getElementById('displayEmail').innerText = email;
 document.getElementById('finalModalTotal').innerText = total;

 // Modal show karna
 document.getElementById('successModal').style.display = 'flex';
}

// 2. Modal Close Function
function closeModal() {
 document.getElementById('successModal').style.display = 'none';
}

// 3. Calendar Click Fix (Ensure it doesn't hijack other clicks)
document.querySelectorAll('input[type="date"]').forEach(el => {
 el.addEventListener('click', (e) => {
 // Sirf tabhi khule jab focus input par ho
 if (e.target.tagName !== 'INPUT') e.preventDefault();
 });
});  

let slideIndex = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const totalSlides = slides.length;

function showSlides(n) {
    if (n >= totalSlides) slideIndex = 0;
    if (n < 0) slideIndex = totalSlides - 1;

    // Move slider container
    const slider = document.getElementById('slider');
    slider.style.transform = `translateX(-${slideIndex * 100}%)`;

    // Update dots and active slide opacity
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    slides[slideIndex].classList.add('active');
    dots[slideIndex].classList.add('active');
}

function moveSlide(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

// AUTO PLAY - Har 3 second mein chalega
setInterval(() => {
    moveSlide(1);
}, 5000);


// Modal Functions
function openSignIn() {
    document.getElementById('signInModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeAuthModal(id) {
    document.getElementById(id).style.display = 'none';
    document.body.style.overflow = 'auto';
}

function switchModal(closeId, openId) {
    closeAuthModal(closeId);
    document.getElementById(openId).style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Navbar Profile Toggle Logic
const signInBtn = document.querySelector('.sign-in-btn');
const navBtns = document.querySelector('.nav-btns');

// Mock Login Action (Submit par navbar change hoga)
document.getElementById('loginForm').onsubmit = (e) => {
    e.preventDefault();
    closeAuthModal('signInModal');
    
    // Navbar update: Hide Sign-in, Show Info & Logout
    signInBtn.style.display = 'none';
    
    // Naya Account Info aur Logout icon add karna
    const accountInfo = `
        <button class="account-info-btn"><i class="fa-regular fa-user"></i> info</button>
        <button class="logout-btn" onclick="logout()"><i class="fa-solid fa-arrow-right-from-bracket"></i></button>
    `;
    navBtns.insertAdjacentHTML('afterbegin', accountInfo);
};

function logout() {
    location.reload(); // Simple refresh for logout
}

// Navbar Sign-in click event fix
if(signInBtn) {
    signInBtn.onclick = openSignIn;
}
// Mobile Menu Toggle Logic
const menuBtn = document.getElementById('menu-icon');
const navMenu = document.getElementById('nav-links');

if (menuBtn && navMenu) {
    // 1. Hamburger Click Toggle (Menu open/close)
    menuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = menuBtn.querySelector('i');
        
        // Icon toggle logic: Bars <-> Xmark
        if (navMenu.classList.contains('active')) {
            icon.classList.replace('fa-bars', 'fa-xmark');
        } else {
            icon.classList.replace('fa-xmark', 'fa-bars');
        }
    });

    // 2. Auto-Close: Menu ke kisi bhi link ya 'Book Now' par click karein
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            // Menu band karein
            navMenu.classList.remove('active');
            
            // Icon ko wapas Bars (3 lines) par le jayein
            const icon = menuBtn.querySelector('i');
            if (icon.classList.contains('fa-xmark')) {
                icon.classList.replace('fa-xmark', 'fa-bars');
            }
        });
    });
}