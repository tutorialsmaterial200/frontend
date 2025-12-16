// `components/RideBooking.tsx`
import React, { useState } from 'react';
import { MapPin, Clock, CreditCard } from 'lucide-react';

export function RideBooking() {
    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');
    const [when, setWhen] = useState('');
    const [payment, setPayment] = useState('Card');

    return (
        <div className="max-w-md  my-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6">
            <h1 className="text-3xl font-bold mb-4">Where to?</h1>

            <label className="block mb-3">
                <span className="text-sm text-neutral-600">Pickup</span>
                <div className="mt-1 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-neutral-500" />
                    <input
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                        placeholder="Enter pickup location"
                        className="flex-1 border rounded-md px-3 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        aria-label="pickup"
                    />
                </div>
            </label>

            <label className="block mb-3">
                <span className="text-sm text-neutral-600">Drop-off</span>
                <div className="mt-1 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-neutral-500 rotate-45" />
                    <input
                        value={dropoff}
                        onChange={(e) => setDropoff(e.target.value)}
                        placeholder="Enter destination"
                        className="flex-1 border rounded-md px-3 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        aria-label="dropoff"
                    />
                </div>
            </label>

            <div className="flex gap-3 mb-4">
                <div className="flex-1">
                    <label className="block text-sm text-neutral-600">When</label>
                    <div className="mt-1 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-neutral-500" />
                        <input
                            value={when}
                            onChange={(e) => setWhen(e.target.value)}
                            placeholder="Now"
                            className="flex-1 border rounded-md px-3 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            aria-label="when"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-neutral-600">Pay</label>
                    <div className="mt-1 flex items-center gap-2 border rounded-md px-3 h-10 text-sm">
                        <CreditCard className="w-4 h-4 text-neutral-500" />
                        <select
                            value={payment}
                            onChange={(e) => setPayment(e.target.value)}
                            className="bg-transparent outline-none"
                            aria-label="payment"
                        >
                            <option>Card</option>
                            <option>Cash</option>
                        </select>
                    </div>
                </div>
            </div>

            <button
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition"
                disabled={!pickup || !dropoff}
            >
                Request Ride
            </button>

            <div className="mt-4 text-xs text-neutral-500">
                Estimated fare appears after you provide pickup & drop-off.
            </div>
        </div>
    );
}
