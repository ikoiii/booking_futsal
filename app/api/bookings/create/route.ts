import { NextRequest, NextResponse } from 'next/server'
import { LapanganHelpers, BookingHelpers } from '@/lib/database.helpers'
import { auth } from '@/lib/auth'
import type { User } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = request.headers.get('authorization')
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = session.replace('Bearer ', '')
    const user = await auth.getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate required fields
    const { lapangan_id, tanggal, jam_mulai, jam_selesai } = body
    
    if (!lapangan_id || !tanggal || !jam_mulai || !jam_selesai) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      )
    }

    // Check if lapangan exists and is active
    const lapangan = await LapanganHelpers.getLapanganById(lapangan_id)
    if (!lapangan) {
      return NextResponse.json(
        { error: 'Lapangan not found' }, 
        { status: 404 }
      )
    }

    // Check availability
    const availability = await BookingHelpers.checkAvailability(
      lapangan_id, 
      tanggal, 
      parseInt(jam_mulai), 
      parseInt(jam_selesai)
    )
    
    const conflictCount = availability ? (availability as any).conflict_count : 0
    if (conflictCount > 0) {
      return NextResponse.json(
        { error: 'Lapangan not available at this time' }, 
        { status: 409 }
      )
    }

    // Calculate total price
    const duration = parseInt(jam_selesai) - parseInt(jam_mulai)
    const total_harga = duration * (lapangan as any).harga_per_jam

    // Create booking
    const bookingData = {
      user_id: user.id,
      lapangan_id: lapangan_id,
      tanggal: tanggal,
      jam_mulai: parseInt(jam_mulai),
      jam_selesai: parseInt(jam_selesai),
      harga_per_jam: (lapangan as any).harga_per_jam,
    }

    const result = await BookingHelpers.createBooking(bookingData)
    
    return NextResponse.json({
      success: true,
      message: 'Booking created successfully',
      data: {
        id: (result as any).insertId || 0,
        ...bookingData,
        total_harga: total_harga,
        status: 'pending'
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Booking creation failed:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}