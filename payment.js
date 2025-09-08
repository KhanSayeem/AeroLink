
document.addEventListener('DOMContentLoaded', () => {
    const paymentForm = document.getElementById('payment-form');
    if (!paymentForm) return;

    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        try {
            if (!window.currentBooking) {
                showNotification('No booking in progress.', true);
                return;
            }
            const booking = window.currentBooking;
            const flight = (window.flights || []).find(f => f.flightNumber === booking.flightNumber);
            if (!flight) {
                showNotification('Flight not found.', true);
                return;
            }

            // Update seat availability
            const seat = flight.seats.find(s => s.seatNumber === booking.seat);
            if (seat && !seat.isBooked) {
                seat.isBooked = true;
                flight.seatsAvailable = Math.max(0, (flight.seatsAvailable || 0) - 1);
            }

            booking.status = 'Paid';
            (window.bookings || []).push(booking);

            // Persist to localStorage so the app state survives reloads
            localStorage.setItem('flights', JSON.stringify(window.flights || []));
            localStorage.setItem('bookings', JSON.stringify(window.bookings || []));

            showNotification(`Booking successful! Invoice generated for ${booking.flightNumber}.`);
            if (typeof window.incrementUnread === 'function' && window.currentBooking?.username && window.currentBooking.username !== 'guest') {
                window.incrementUnread(window.currentBooking.username);
            }
            if (typeof window.renderAvailableFlights === 'function') window.renderAvailableFlights();
            if (typeof displayProfile === 'function') displayProfile();
            showSection('profile');
        } catch (err) {
            console.error(err);
            showNotification('Payment failed. Please try again.', true);
        }
    });
});
