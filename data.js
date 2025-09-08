const flights = [
    {
        flightNumber: "AL101",
        origin: "New York",
        destination: "London",
        date: "2025-10-15",
        time: "10:00",
        price: 500,
        seatsAvailable: 150,
        aircraft: "Boeing 747",
        classes: ["economy", "business"],
        seats: Array.from({length: 150}, (_, i) => ({ seatNumber: `A${i+1}`, isBooked: false }))
    },
    {
        flightNumber: "AL102",
        origin: "London",
        destination: "New York",
        date: "2025-10-20",
        time: "14:00",
        price: 550,
        seatsAvailable: 120,
        aircraft: "Airbus A380",
        classes: ["economy", "first"],
        seats: Array.from({length: 120}, (_, i) => ({ seatNumber: `B${i+1}`, isBooked: false }))
    },
    {
        flightNumber: "AL203",
        origin: "Paris",
        destination: "Tokyo",
        date: "2025-11-01",
        time: "08:30",
        price: 1200,
        seatsAvailable: 100,
        aircraft: "Boeing 777",
        classes: ["business", "first"],
        seats: Array.from({length: 100}, (_, i) => ({ seatNumber: `C${i+1}`, isBooked: false }))
    },
    {
        flightNumber: "AL304",
        origin: "Sydney",
        destination: "Los Angeles",
        date: "2025-11-10",
        time: "19:00",
        price: 1500,
        seatsAvailable: 200,
        aircraft: "Boeing 787",
        classes: ["economy", "business", "first"],
        seats: Array.from({length: 200}, (_, i) => ({ seatNumber: `D${i+1}`, isBooked: false }))
    },
    {
        flightNumber: "AL405",
        origin: "Dubai",
        destination: "Singapore",
        date: "2025-11-15",
        time: "22:00",
        price: 800,
        seatsAvailable: 180,
        aircraft: "Airbus A350",
        classes: ["economy", "business"],
        seats: Array.from({length: 180}, (_, i) => ({ seatNumber: `E${i+1}`, isBooked: false }))
    },
    {
        flightNumber: "AL506",
        origin: "New York",
        destination: "London",
        date: "2025-10-15",
        time: "22:00",
        price: 600,
        seatsAvailable: 50,
        aircraft: "Boeing 747",
        classes: ["economy"],
        seats: Array.from({length: 50}, (_, i) => ({ seatNumber: `F${i+1}`, isBooked: false }))
    }
];

const users = [
    {
        username: "passenger",
        password: "1234",
        role: "passenger"
    },
    {
        username: "staff",
        password: "password",
        role: "staff"
    },
    {
        username: "admin",
        password: "1234",
        role: "admin"
    }
];

let bookings = [
    {
        bookingId: 1678886400000,
        username: "passenger1",
        flightNumber: "AL101",
        passengerName: "John Doe",
        passengerEmail: "john.doe@example.com",
        seat: "A1",
        status: "Paid"
    },
    {
        bookingId: 1678972800000,
        username: "passenger2",
        flightNumber: "AL203",
        passengerName: "Jane Smith",
        passengerEmail: "jane.smith@example.com",
        seat: "B2",
        status: "Issued"
    }
];

const aircrafts = [
    { 
        name: "Boeing 747", 
        seats: 416, 
        seatLayout: [
            ['s','s','s', 'a', 's','s','s','s', 'a', 's','s','s'],
            ['s','s','s', 'a', 's','s','s','s', 'a', 's','s','s'],
            ['s','s','s', 'a', 's','s','s','s', 'a', 's','s','s'],
            ['s','s','s', 'a', 's','s','s','s', 'a', 's','s','s']
        ]
    },
    { 
        name: "Airbus A380", 
        seats: 853, 
        seatLayout: [
            ['s','s','s', 'a', 's','s','s','s', 'a', 's','s','s'],
            ['s','s','s', 'a', 's','s','s','s', 'a', 's','s','s'],
            ['s','s','s', 'a', 's','s','s','s', 'a', 's','s','s'],
            ['s','s','s', 'a', 's','s','s','s', 'a', 's','s','s']
        ]
    },
    { 
        name: "Boeing 777", 
        seats: 396, 
        seatLayout: [
            ['s','s','s', 'a', 's','s','s','s','s', 'a', 's','s','s'],
            ['s','s','s', 'a', 's','s','s','s','s', 'a', 's','s','s'],
            ['s','s','s', 'a', 's','s','s','s','s', 'a', 's','s','s']
        ]
    },
    { 
        name: "Boeing 787", 
        seats: 242, 
        seatLayout: [
            ['s','s','s', 'a', 's','s','s', 'a', 's','s','s'],
            ['s','s','s', 'a', 's','s','s', 'a', 's','s','s'],
            ['s','s','s', 'a', 's','s','s', 'a', 's','s','s']
        ]
    },
    { 
        name: "Airbus A350", 
        seats: 350, 
        seatLayout: [
            ['s','s','s', 'a', 's','s','s','s','s', 'a', 's','s','s'],
            ['s','s','s', 'a', 's','s','s','s','s', 'a', 's','s','s'],
            ['s','s','s', 'a', 's','s','s','s','s', 'a', 's','s','s']
        ]
    }
];
