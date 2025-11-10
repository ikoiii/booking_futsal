import { NextRequest, NextResponse } from 'next/server'
import { dbHelpers } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tanggal = searchParams.get('tanggal')
    const jamMulai = searchParams.get('jam_mulai')
    const jamSelesai = searchParams.get('jam_selesai')

    if (!tanggal || !jamMulai || !jamSelesai) {
      return NextResponse.json(
        { error: 'Missing required parameters: tanggal, jam_mulai, jam_selesai' }, 
        { status: 400 }
      )
    }

    // Get all lapangans
    const lapangans = await dbHelpers.getAllLapangans()
    
    if (!lapangans || !Array.isArray(lapangans) || lapangans.length === 0) {
      return NextResponse.json({
        success: true,
        data: []
      }, { status: 200 })
    }

    // Check availability for each lapangan
    const availableLapangans = []
    
    for (const lapangan of lapangans) {
      const availability = await dbHelpers.checkAvailability(
        (lapangan as any).id,
        tanggal,
        parseInt(jamMulai),
        parseInt(jamSelesai)
      )
      
      const conflictCount = availability ? (availability as any).conflict_count : 0
      
      if (conflictCount === 0) {
        availableLapangans.push(lapangan)
      }
    }

    return NextResponse.json({
      success: true,
      data: availableLapangans
    }, { status: 200 })

  } catch (error) {
    console.error('Check availability failed:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
