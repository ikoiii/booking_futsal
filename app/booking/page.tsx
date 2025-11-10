"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

export default function BookingPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (!response.ok) {
        return;
      }

      const userData = await response.json();
      const userId = userData.user.id;

      const bookingsResponse = await fetch(`/api/bookings/user/${userId}`);
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData.bookings || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    try {
      const response = await fetch('/api/bookings/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Booking Cancelled",
          description: "Your booking has been cancelled successfully.",
        });
        fetchBookings(); // Refresh bookings list
      } else {
        toast({
          title: "Cancellation Failed",
          description: result.message || "Failed to cancel booking.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Error",
        description: "An error occurred while cancelling the booking.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded-md mb-8 w-1/4"></div>
          <div className="space-y-4">
            <div className="h-32 bg-muted rounded-lg"></div>
            <div className="h-32 bg-muted rounded-lg"></div>
            <div className="h-32 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-muted-foreground">Manage your futsal field reservations</p>
        </div>
        <Button onClick={() => window.location.href = '/lapangan'}>
          Book New Lapangan
        </Button>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v4M5 11H5m0 0h6m-6 0a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2v-6a2 2 0 00-2-2m0 0V9a2 2 0 012-2M9 13a2 2 0 10-4 0 2 2 0 014 0m8 0a2 2 0 10-4 0 2 2 0 014 0" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">No Bookings Yet</h3>
          <p className="text-gray-600 mb-4">You haven't booked any futsal fields yet.</p>
          <Button onClick={() => window.location.href = '/lapangan'}>
            Find Lapangan Now
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking: any) => (
            <Card key={booking.id}>
              <CardHeader>
                <CardTitle className="text-lg">{booking.lapangan_name}</CardTitle>
                <CardDescription>
                  {new Date(booking.tanggal).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    <p>Jam: {booking.jam_mulai}:00 - {booking.jam_selesai}:00</p>
                    <p>Durasi: {booking.jam_selesai - booking.jam_mulai} jam</p>
                  </div>
                  <Badge 
                    variant={
                      booking.status === 'confirmed' ? 'default' :
                      booking.status === 'pending' ? 'secondary' :
                      booking.status === 'cancelled' ? 'destructive' : 'outline'
                    }
                  >
                    {booking.status === 'confirmed' ? 'Confirmed' :
                     booking.status === 'pending' ? 'Pending' :
                     booking.status === 'cancelled' ? 'Cancelled' : booking.status}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">
                    Total: Rp {(booking.harga_per_jam * (booking.jam_selesai - booking.jam_mulai)).toLocaleString('id-ID')}
                  </div>
                  {booking.status === 'pending' && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
