'use client';
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
    MapPin, Navigation, Clock, Car, Users, 
    DollarSign, Star, Shield, Zap 
} from 'lucide-react';

export default function RidePage() {
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropoffLocation, setDropoffLocation] = useState('');
    const [selectedRide, setSelectedRide] = useState<string | null>(null);

    const rideOptions = [
        {
            id: 'economy',
            name: 'Economy',
            icon: Car,
            time: '2 mins',
            capacity: '4 seats',
            price: 12.50,
            description: 'Affordable rides',
            color: 'bg-blue-500'
        },
        {
            id: 'comfort',
            name: 'Comfort',
            icon: Car,
            time: '3 mins',
            capacity: '4 seats',
            price: 18.75,
            description: 'Premium sedans',
            color: 'bg-purple-500'
        },
        {
            id: 'xl',
            name: 'XL',
            icon: Users,
            time: '4 mins',
            capacity: '6 seats',
            price: 24.99,
            description: 'Extra space',
            color: 'bg-green-500'
        }
    ];

    const features = [
        { icon: Shield, text: 'Safe & Insured' },
        { icon: Star, text: '4.8+ Rating' },
        { icon: Zap, text: 'Fast Pickup' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
                <div className="container mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold mb-2">Book a Ride</h1>
                    <p className="text-muted-foreground">Fast, safe, and affordable transportation</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Booking Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Location Input Card */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="flex flex-col items-center gap-2 pt-3">
                                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                                            <div className="w-0.5 h-12 bg-border"></div>
                                            <MapPin className="w-4 h-4 text-destructive" />
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <Label htmlFor="pickup">Pickup Location</Label>
                                                <div className="relative mt-2">
                                                    <Input
                                                        id="pickup"
                                                        placeholder="Enter pickup address"
                                                        value={pickupLocation}
                                                        onChange={(e) => setPickupLocation(e.target.value)}
                                                        className="pl-3"
                                                    />
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="absolute right-1 top-1/2 -translate-y-1/2"
                                                    >
                                                        <Navigation className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div>
                                                <Label htmlFor="dropoff">Drop-off Location</Label>
                                                <Input
                                                    id="dropoff"
                                                    placeholder="Enter destination"
                                                    value={dropoffLocation}
                                                    onChange={(e) => setDropoffLocation(e.target.value)}
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Ride Options */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Choose Your Ride</h2>
                            <div className="space-y-3">
                                {rideOptions.map((ride) => (
                                    <Card
                                        key={ride.id}
                                        className={`cursor-pointer transition-all ${
                                            selectedRide === ride.id
                                                ? 'ring-2 ring-primary shadow-md'
                                                : 'hover:shadow-md'
                                        }`}
                                        onClick={() => setSelectedRide(ride.id)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className={`${ride.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                                                        <ride.icon className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-semibold">{ride.name}</h3>
                                                            <Badge variant="secondary" className="text-xs">
                                                                <Clock className="w-3 h-3 mr-1" />
                                                                {ride.time}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">{ride.description}</p>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            <Users className="w-3 h-3 inline mr-1" />
                                                            {ride.capacity}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold">रू {ride.price}</p>
                                                    <p className="text-xs text-muted-foreground">Estimated</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Book Button */}
                        <Button
                            size="lg"
                            className="w-full"
                            disabled={!pickupLocation || !dropoffLocation || !selectedRide}
                        >
                            <Car className="w-5 h-5 mr-2" />
                            Confirm Ride
                        </Button>
                    </div>

                    {/* Right Column - Info & Features */}
                    <div className="space-y-6">
                        {/* Features Card */}
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-4">Why Choose Us</h3>
                                <div className="space-y-4">
                                    {features.map((feature, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <feature.icon className="w-5 h-5 text-primary" />
                                            </div>
                                            <span className="font-medium">{feature.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Info */}
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-4">Payment</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Base Fare</span>
                                        <span className="font-medium">रू 500</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Distance</span>
                                        <span className="font-medium">
                                            {selectedRide ? `रू${rideOptions.find(r => r.id === selectedRide)?.price || 0 - 5}` : 'रू 0'}
                                        </span>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold">Total</span>
                                        <span className="text-xl font-bold">
                                            रू {selectedRide ? rideOptions.find(r => r.id === selectedRide)?.price.toFixed(0) : '0'}
                                        </span>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full mt-4">
                                    <DollarSign className="w-4 h-4 mr-2" />
                                    Payment Method
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Promo Card */}
                        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-2">First Ride Offer</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Get 50% off on your first ride. Use code: FIRST50
                                </p>
                                <Button variant="secondary" size="sm" className="w-full">
                                    Apply Code
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
