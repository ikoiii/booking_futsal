'use client'

import * as React from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface BookingCalendarProps {
  lapanganId: number
  onBookingSuccess?: () => void
}

export function BookingCalendar({ lapanganId, onBookingSuccess }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date())
  const [jamMulai, setJamMulai] = React.useState('16')
  const [jamSelesai, setJamSelesai] = React.useState('17')
  const [isLoading, setIsLoading] = React.useState(false)

  const handleBooking = async () => {
    try {
      setIsLoading(true)
      
      const bookingData = {
        lapangan_id: lapanganId,
        tanggal: selectedDate?.toISOString().split('T')[0],
        jam_mulai: jamMulai,
        jam_selesai: jamSelesai
      }

      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('user_id') || ''}`
        },
        body: JSON.stringify(bookingData)
      })

      const result = await response.json()

      if (response.ok) {
        alert('Booking Berhasil! Lapangan telah dipesan berhasil!')
        onBookingSuccess?.()
      } else {
        alert(`Booking Gagal: ${result.error || 'Terjadi kesalahan'}`)
      }
    } catch (error) {
      alert('Booking Gagal: Terjadi kesalahan jaringan')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Calendar</CardTitle>
        <CardDescription>Pilih tanggal dan waktu untuk booking lapangan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="date">Tanggal</Label>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="jam_mulai">Jam Mulai</Label>
            <Input
              type="number"
              id="jam_mulai"
              value={jamMulai}
              onChange={(e) => setJamMulai(e.target.value)}
              min="15"
              max="23"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jam_selesai">Jam Selesai</Label>
            <Input
              type="number"
              id="jam_selesai"
              value={jamSelesai}
              onChange={(e) => setJamSelesai(e.target.value)}
              min="15"
              max="23"
              className="w-full"
            />
          </div>
        </div>

        <Button 
          onClick={handleBooking} 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Memproses...' : 'Booking Lapangan'}
        </Button>
      </CardContent>
    </Card>
  )
}
