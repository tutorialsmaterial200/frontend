import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
            <Card className="max-w-md w-full">
                <CardContent className="pt-6 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
                    <p className="text-muted-foreground mb-6">
                        Thank you for your purchase. Your order has been placed successfully.
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                        A confirmation email has been sent to your email address.
                    </p>
                    <div className="space-y-3">
                        <Link href="/" className="block">
                            <Button className="w-full">Continue Shopping</Button>
                        </Link>
                        <Link href="/orders" className="block">
                            <Button variant="outline" className="w-full">View Orders</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
