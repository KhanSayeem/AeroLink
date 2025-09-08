// Rebuilt app script with complete flows (search, booking, seat map,
// auth, profile, staff/admin, and notifications). Exposes key helpers
// globally so payment.js can interact with them.

document.addEventListener('DOMContentLoaded', () => {
    // Sections and nav
    const sections = {
        search: document.getElementById('flight-search-section'),
        results: document.getElementById('flight-results-section'),
        booking: document.getElementById('booking-section'),
        seat: document.getElementById('seat-map-section'),
        payment: document.getElementById('payment-section'),
        login: document.getElementById('login-section'),
        register: document.getElementById('register-section'),
        profile: document.getElementById('profile-section'),
        staff: document.getElementById('staff-section'),
        admin: document.getElementById('admin-section'),
        notification: document.getElementById('notification-section'),
    };

    const navLinks = {
        search: document.getElementById('search-nav'),
        login: document.getElementById('login-nav'),
        register: document.getElementById('register-nav'),
        bookings: document.getElementById('bookings-nav'),
        profile: document.getElementById('profile-nav'),
        staff: document.getElementById('staff-nav'),
        admin: document.getElementById('admin-nav'),
    };

    // Auth elements
    const userDisplay = document.getElementById('user-display');
    const headerLogoutBtn = document.getElementById('logout-btn');

    // Elements
    const flightSearchForm = document.getElementById('flight-search-form');
    const flightResultsContainer = document.getElementById('flight-results');
    const availableFlightsContainer = document.getElementById('available-flights');
    const bookingForm = document.getElementById('booking-form');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const profileInfoContainer = document.getElementById('profile-info');
    const myBookingsContainer = document.getElementById('my-bookings');
    const bookingsBadge = document.getElementById('bookings-badge');
    const notificationsList = document.getElementById('notifications-list');
    const allBookingsContainer = document.getElementById('all-bookings');
    const allFlightsContainer = document.getElementById('all-flights');
    const addFlightForm = document.getElementById('add-flight-form');
    const savedPreferencesForm = document.getElementById('saved-preferences-form');
    const notificationMessage = document.getElementById('notification-message');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalMessage = document.getElementById('modal-message');
    const confirmBtn = document.getElementById('confirm-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const spinnerOverlay = document.getElementById('spinner-overlay');
    const seatMapContainer = document.getElementById('seat-map-container');
    const confirmSeatBtn = document.getElementById('confirm-seat-btn');
    const logoutBtn = document.getElementById('logout-btn');

    // State with localStorage persistence
    let state = {
        users: JSON.parse(localStorage.getItem('users')) || users || [],
        flights: JSON.parse(localStorage.getItem('flights')) || flights || [],
        bookings: JSON.parse(localStorage.getItem('bookings')) || bookings || [],
        notifications: JSON.parse(localStorage.getItem('notifications')) || {}, // { username: [ ... ] }
        unreadBookings: JSON.parse(localStorage.getItem('unreadBookings')) || {}, // { username: count }
        currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
        currentFlight: null,
        selectedSeat: null,
        currentBooking: null,
    };

    // Ensure demo flights and default users exist
    if (!state.flights || state.flights.length === 0) {
        state.flights = (typeof flights !== 'undefined' && Array.isArray(flights)) ? flights : [];
    }
    // ensure default users including passenger/admin with 1234
    const ensureUser = (username, password, role) => {
        if (!state.users.find(u => u.username === username)) {
            state.users.push({ username, password, role });
        } else {
            const u = state.users.find(u => u.username === username);
            u.password = password; u.role = role;
        }
    };
    ensureUser('passenger', '1234', 'passenger');
    ensureUser('admin', '1234', 'admin');

    function persist() {
        localStorage.setItem('users', JSON.stringify(state.users));
        localStorage.setItem('flights', JSON.stringify(state.flights));
        localStorage.setItem('bookings', JSON.stringify(state.bookings));
        localStorage.setItem('notifications', JSON.stringify(state.notifications));
        localStorage.setItem('unreadBookings', JSON.stringify(state.unreadBookings));
        localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
    }

    // Basic helpers
    function showSection(sectionName) {
        Object.values(sections).forEach(section => section.style.display = 'none');
        if (sections[sectionName]) sections[sectionName].style.display = 'block';
    }
    function showNotification(message, isError = false) {
        notificationMessage.textContent = message;
        notificationMessage.parentElement.style.backgroundColor = isError ? '#dc3545' : '#333';
        sections.notification.style.display = 'block';
        setTimeout(() => { sections.notification.style.display = 'none'; }, 3000);
    }
    function showSpinner() { spinnerOverlay.style.display = 'flex'; }
    function hideSpinner() { spinnerOverlay.style.display = 'none'; }
    function showModal(message, onConfirm) {
        modalMessage.textContent = message;
        modalOverlay.style.display = 'flex';
        confirmBtn.onclick = () => { hideModal(); onConfirm && onConfirm(); };
        cancelBtn.onclick = hideModal;
    }
    function hideModal() { modalOverlay.style.display = 'none'; }

    function notifyUser(username, text) {
        if (!username) return;
        if (!state.notifications[username]) state.notifications[username] = [];
        state.notifications[username].push({ id: Date.now(), text, ts: new Date().toISOString() });
        persist();
        if (state.currentUser && state.currentUser.username === username) renderNotifications();
    }

    function updateNav() {
        if (state.currentUser) {
            // Header auth section
            navLinks.login.style.display = 'none';
            headerLogoutBtn.style.display = 'inline-block';
            userDisplay.style.display = 'inline';
            userDisplay.textContent = `Welcome, ${state.currentUser.username} (${state.currentUser.role})`;
            
            // Navigation menu
            navLinks.register.style.display = 'none';
            navLinks.profile.style.display = 'block';
            navLinks.bookings.style.display = 'block';
            navLinks.staff.style.display = state.currentUser.role === 'staff' ? 'block' : 'none';
            navLinks.admin.style.display = state.currentUser.role === 'admin' ? 'block' : 'none';
        } else {
            // Header auth section
            navLinks.login.style.display = 'inline-block';
            headerLogoutBtn.style.display = 'none';
            userDisplay.style.display = 'none';
            
            // Navigation menu
            navLinks.register.style.display = 'block';
            navLinks.profile.style.display = 'none';
            navLinks.bookings.style.display = 'none';
            navLinks.staff.style.display = 'none';
            navLinks.admin.style.display = 'none';
        }
        updateUnreadBadge();
    }

    // Nav events
    navLinks.search.addEventListener('click', () => showSection('search'));
    navLinks.login.addEventListener('click', () => showSection('login'));
    navLinks.register.addEventListener('click', () => showSection('register'));
    navLinks.profile.addEventListener('click', () => { displayProfile(); showSection('profile'); });
    navLinks.bookings.addEventListener('click', () => { displayProfile(); showSection('profile'); clearUnread(); document.getElementById('my-bookings').scrollIntoView({behavior:'smooth'}); });
    navLinks.staff.addEventListener('click', () => { displayAllBookings(); showSection('staff'); });
    navLinks.admin.addEventListener('click', () => { displayAllFlights(); showSection('admin'); });

    // Search
    flightSearchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const origin = document.getElementById('origin').value.trim();
        const destination = document.getElementById('destination').value.trim();
        const date = document.getElementById('departure-date').value;
        const flightClass = document.getElementById('flight-class').value;

        if (!origin || !destination || !date) return;
        if (origin.toLowerCase() === destination.toLowerCase()) {
            showNotification('Origin and destination cannot be the same.', true);
            return;
        }

        showSpinner();
        setTimeout(() => {
            const results = state.flights.filter(f =>
                f.origin.toLowerCase() === origin.toLowerCase() &&
                f.destination.toLowerCase() === destination.toLowerCase() &&
                f.date === date &&
                f.classes.includes(flightClass) &&
                !f.cancelled
            );
            displayFlightResults(results);
            showSection('results');
            hideSpinner();
        }, 250);
    });

    function displayFlightResults(results) {
        flightResultsContainer.innerHTML = '';
        if (results.length === 0) {
            flightResultsContainer.innerHTML = '<p>No flights found.</p>';
            return;
        }
        results.forEach(flight => {
            const div = document.createElement('div');
            div.className = 'flight card';
            div.innerHTML = `
                <div class="price-badge">$${flight.price}</div>
                <div class="route">${flight.origin} → ${flight.destination}</div>
                <div class="meta">Flight ${flight.flightNumber}</div>
                <div class="meta">${flight.date} • ${flight.time}</div>
                <div class="meta">Aircraft: ${flight.aircraft}</div>
                <div class="meta">Seats: ${flight.seatsAvailable}</div>
                <div class="card-actions"><button class="book-btn">Book</button></div>
            `;
            div.querySelector('.book-btn').addEventListener('click', () => beginBooking(flight));
            flightResultsContainer.appendChild(div);
        });
    }

    // Public list of all flights on the home page
    function renderAvailableFlights() {
        if (!availableFlightsContainer) return;
        availableFlightsContainer.innerHTML = '';
        const list = state.flights.filter(f => !f.cancelled);
        if (list.length === 0) {
            availableFlightsContainer.innerHTML = '<p>No flights available.</p>';
            return;
        }
        list.forEach(flight => {
            const div = document.createElement('div');
            div.className = 'flight card';
            div.innerHTML = `
                <div class="price-badge">$${flight.price}</div>
                <div class="route">${flight.origin} → ${flight.destination}</div>
                <div class="meta">Flight ${flight.flightNumber}</div>
                <div class="meta">${flight.date} • ${flight.time}</div>
                <div class="meta">Aircraft: ${flight.aircraft}</div>
                <div class="meta">Seats: ${flight.seatsAvailable}</div>
                <div class="card-actions"><button class="book-btn">Book</button></div>
            `;
            div.querySelector('.book-btn').addEventListener('click', () => beginBooking(flight));
            availableFlightsContainer.appendChild(div);
        });
    }

    function beginBooking(flight) {
        state.currentFlight = flight;
        state.selectedSeat = null;
        buildSeatMap(flight);
        showSection('seat');
    }

    // Seat map
    function buildSeatMap(flight) {
        seatMapContainer.innerHTML = '';
        const seats = flight.seats || [];
        const perRow = 6; // simple grid with an aisle in middle
        const aisleIndex = 3;
        for (let i = 0; i < seats.length; i += perRow) {
            const row = document.createElement('div');
            row.className = 'seat-row';
            for (let j = 0; j < perRow; j++) {
                if (j === aisleIndex) {
                    const aisle = document.createElement('div');
                    aisle.className = 'aisle';
                    row.appendChild(aisle);
                }
                const seat = seats[i + j];
                if (!seat) continue;
                const btn = document.createElement('div');
                btn.className = `seat ${seat.isBooked ? 'booked' : 'available'}`;
                btn.textContent = seat.seatNumber;
                if (!seat.isBooked) {
                    btn.addEventListener('click', () => {
                        // clear previous selection
                        const prev = seatMapContainer.querySelector('.seat.selected');
                        if (prev) prev.classList.remove('selected');
                        btn.classList.add('selected');
                        state.selectedSeat = seat.seatNumber;
                    });
                }
                row.appendChild(btn);
            }
            seatMapContainer.appendChild(row);
        }
    }

    confirmSeatBtn.addEventListener('click', () => {
        if (!state.selectedSeat) {
            showNotification('Please select a seat.', true);
            return;
        }
        showSection('booking');
    });

    // Booking form
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!state.currentFlight || !state.selectedSeat) {
            showNotification('Select a flight and seat first.', true);
            return;
        }
        const passengerName = document.getElementById('passenger-name').value.trim();
        const passengerEmail = document.getElementById('passenger-email').value.trim();
        if (!passengerName || !passengerEmail) return;

        const booking = {
            bookingId: Date.now(),
            username: state.currentUser ? state.currentUser.username : 'guest',
            flightNumber: state.currentFlight.flightNumber,
            passengerName,
            passengerEmail,
            seat: state.selectedSeat,
            status: 'Pending Payment'
        };
        state.currentBooking = booking;
        window.currentBooking = booking; // expose for payment.js
        showSection('payment');
    });

    // Auth
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value.trim();
        const user = state.users.find(u => u.username === username && u.password === password);
        if (!user) return showNotification('Invalid credentials', true);
        state.currentUser = { username: user.username, role: user.role || 'passenger' };
        persist();
        updateNav();
        displayProfile();
        showSection('profile');
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value.trim();
        const password = document.getElementById('register-password').value.trim();
        if (state.users.some(u => u.username === username)) {
            return showNotification('Username already exists', true);
        }
        const newUser = { username, password, role: 'passenger', preferences: {} };
        state.users.push(newUser);
        state.currentUser = { username, role: 'passenger' };
        persist();
        updateNav();
        displayProfile();
        showSection('profile');
    });

    // Logout functionality
    const profileLogoutBtn = document.getElementById('profile-logout-btn');
    if (profileLogoutBtn) profileLogoutBtn.addEventListener('click', logout);
    if (headerLogoutBtn) headerLogoutBtn.addEventListener('click', logout);
    
    function logout() {
        state.currentUser = null;
        persist();
        updateNav();
        showSection('search');
    }

    // Unread bookings badge
    function updateUnreadBadge() {
        const count = state.currentUser ? (state.unreadBookings[state.currentUser.username] || 0) : 0;
        if (bookingsBadge) {
            if (count > 0) {
                bookingsBadge.textContent = String(count);
                bookingsBadge.style.display = 'inline-block';
            } else {
                bookingsBadge.style.display = 'none';
            }
        }
    }

    function incrementUnread(username) {
        if (!username) return;
        state.unreadBookings[username] = (state.unreadBookings[username] || 0) + 1;
        persist();
        updateUnreadBadge();
    }

    function clearUnread() {
        if (!state.currentUser) return;
        state.unreadBookings[state.currentUser.username] = 0;
        persist();
        updateUnreadBadge();
    }
    window.incrementUnread = incrementUnread;

    // Profile + preferences
    function displayProfile() {
        if (!state.currentUser) {
            profileInfoContainer.innerHTML = '<p>Please log in.</p>';
            myBookingsContainer.innerHTML = '';
            notificationsList.innerHTML = '';
            return;
        }
        profileInfoContainer.innerHTML = `<p><strong>User:</strong> ${state.currentUser.username}</p>`;
        renderNotifications();
        renderMyBookings();
    }
    window.displayProfile = displayProfile; // expose for payment.js

    function renderNotifications() {
        const list = state.notifications[state.currentUser?.username] || [];
        notificationsList.innerHTML = list.length ? '' : '<p>No notifications.</p>';
        list.slice().reverse().forEach(n => {
            const d = document.createElement('div');
            d.textContent = `${new Date(n.ts).toLocaleString()} - ${n.text}`;
            notificationsList.appendChild(d);
        });
    }

    function renderMyBookings() {
        const mine = state.bookings.filter(b => b.username === state.currentUser.username);
        myBookingsContainer.innerHTML = mine.length ? '' : '<p>No bookings yet.</p>';
        mine.slice().reverse().forEach(b => {
            const div = document.createElement('div');
            div.innerHTML = `
                <p><strong>${b.flightNumber}</strong> — Seat ${b.seat}</p>
                <p>Status: ${b.status}</p>
                <button data-act="ticket">Download Ticket/Invoice</button>
                <button data-act="cancel" ${b.status === 'Cancelled' || b.status === 'Refunded' ? 'disabled' : ''}>Cancel</button>
            `;
            div.querySelector('[data-act="ticket"]').addEventListener('click', () => downloadInvoice(b));
            div.querySelector('[data-act="cancel"]').addEventListener('click', () => cancelBooking(b));
            myBookingsContainer.appendChild(div);
        });
    }

    function downloadInvoice(booking) {
        const flight = state.flights.find(f => f.flightNumber === booking.flightNumber) || {};
        const html = `<!doctype html><html><head><meta charset="utf-8"><title>Invoice ${booking.bookingId}</title></head><body>
            <h2>AeroLink Invoice</h2>
            <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
            <p><strong>Passenger:</strong> ${booking.passengerName} (${booking.passengerEmail})</p>
            <p><strong>Flight:</strong> ${booking.flightNumber} — ${flight.origin || ''} → ${flight.destination || ''}</p>
            <p><strong>Date/Time:</strong> ${flight.date || ''} ${flight.time || ''}</p>
            <p><strong>Seat:</strong> ${booking.seat}</p>
            <p><strong>Status:</strong> ${booking.status}</p>
            <hr><p>Thank you for choosing AeroLink.</p>
        </body></html>`;
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `invoice_${booking.bookingId}.html`; a.click();
        URL.revokeObjectURL(url);
    }

    function cancelBooking(booking) {
        showModal('Cancel this booking?', () => {
            booking.status = 'Cancelled';
            const flight = state.flights.find(f => f.flightNumber === booking.flightNumber);
            if (flight) {
                const seat = flight.seats.find(s => s.seatNumber === booking.seat);
                if (seat) seat.isBooked = false;
                flight.seatsAvailable = Math.max(0, (flight.seatsAvailable || 0) + 1);
            }
            persist();
            notifyUser(booking.username, `Your booking ${booking.bookingId} has been cancelled.`);
            showNotification('Booking cancelled');
            displayProfile();
        });
    }

    // Staff: all bookings
    function displayAllBookings() {
        allBookingsContainer.innerHTML = '';
        state.bookings.slice().reverse().forEach(b => {
            const div = document.createElement('div');
            div.innerHTML = `
                <p><strong>${b.flightNumber}</strong> — ${b.passengerName} (${b.username}) — Seat ${b.seat}</p>
                <p>Status: ${b.status}</p>
                <button data-act="issue">Issue</button>
                <button data-act="reissue">Reissue</button>
                <button data-act="refund">Refund</button>
            `;
            div.querySelector('[data-act="issue"]').addEventListener('click', () => updateBookingStatus(b, 'Issued'));
            div.querySelector('[data-act="reissue"]').addEventListener('click', () => updateBookingStatus(b, 'Reissued'));
            div.querySelector('[data-act="refund"]').addEventListener('click', () => updateBookingStatus(b, 'Refunded'));
            allBookingsContainer.appendChild(div);
        });
    }

    function updateBookingStatus(booking, status) {
        booking.status = status;
        persist();
        notifyUser(booking.username, `Your booking ${booking.bookingId} status changed to ${status}.`);
        showNotification(`Booking ${booking.bookingId} → ${status}`);
        if (state.currentUser?.role === 'staff') displayAllBookings();
        if (state.currentUser?.username === booking.username) displayProfile();
    }

    // Admin: flights
    function displayAllFlights() {
        populateAircraftOptions();
        allFlightsContainer.innerHTML = '';
        state.flights.slice().forEach(f => {
            const div = document.createElement('div');
            div.innerHTML = `
                <p><strong>${f.flightNumber}</strong> ${f.origin} → ${f.destination} on ${f.date} ${f.time}</p>
                <p>Aircraft: ${f.aircraft} | Seats: ${f.seatsAvailable}/${f.seats?.length || 0} ${f.cancelled ? '(Cancelled)' : ''}</p>
                <button data-act="cancel" ${f.cancelled ? 'disabled' : ''}>Cancel Flight</button>
                <button data-act="delete">Delete</button>
            `;
            div.querySelector('[data-act="cancel"]').addEventListener('click', () => cancelFlight(f));
            div.querySelector('[data-act="delete"]').addEventListener('click', () => deleteFlight(f));
            allFlightsContainer.appendChild(div);
        });
    }

    function populateAircraftOptions() {
        const sel = document.getElementById('add-flight-aircraft');
        if (!sel) return;
        if (sel.options.length === 0) {
            aircrafts.forEach(a => {
                const opt = document.createElement('option');
                opt.value = a.name; opt.textContent = a.name; sel.appendChild(opt);
            });
        }
    }

    addFlightForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const num = document.getElementById('add-flight-number').value.trim();
        const origin = document.getElementById('add-flight-origin').value.trim();
        const dest = document.getElementById('add-flight-destination').value.trim();
        const date = document.getElementById('add-flight-date').value;
        const time = document.getElementById('add-flight-time').value;
        const price = parseFloat(document.getElementById('add-flight-price').value);
        const seats = parseInt(document.getElementById('add-flight-seats').value, 10);
        const aircraftName = document.getElementById('add-flight-aircraft').value;
        const newFlight = {
            flightNumber: num,
            origin,
            destination: dest,
            date,
            time,
            price,
            seatsAvailable: seats,
            aircraft: aircraftName,
            classes: ['economy', 'business', 'first'],
            seats: Array.from({length: seats}, (_, i) => ({ seatNumber: `${num[0] || 'S'}${i+1}`, isBooked: false }))
        };
        state.flights.push(newFlight);
        persist();
        showNotification('Flight added');
        displayAllFlights();
        renderAvailableFlights();
    });

    function cancelFlight(f) {
        showModal('Cancel this flight and refund passengers?', () => {
            f.cancelled = true;
            // Refund affected bookings
            state.bookings.filter(b => b.flightNumber === f.flightNumber && b.status !== 'Refunded')
                .forEach(b => { b.status = 'Refunded'; notifyUser(b.username, `Flight ${f.flightNumber} cancelled. You have been refunded.`); });
            persist();
            displayAllFlights();
            renderAvailableFlights();
        });
    }
    function deleteFlight(f) {
        showModal('Delete this flight?', () => {
            state.flights = state.flights.filter(x => x !== f);
            persist();
            displayAllFlights();
            renderAvailableFlights();
        });
    }

    // Preferences
    savedPreferencesForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!state.currentUser) return;
        const cls = document.getElementById('preferred-class').value;
        const u = state.users.find(u => u.username === state.currentUser.username);
        if (u) u.preferences = { preferredClass: cls };
        persist();
        showNotification('Preferences saved');
    });

    // Initial render
    updateNav();
    showSection('search');
    renderAvailableFlights();
    // expose helpers for payment.js
    window.showSection = showSection;
    window.showNotification = showNotification;
    Object.assign(window, { flights: state.flights, bookings: state.bookings, renderAvailableFlights });
});
