import { NextRequest, NextResponse } from 'next/server'
import { shopConfig } from '../../shops/dogra-associates/config'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Cache for 1 hour

interface GoogleReview {
  author_name: string
  author_url?: string
  profile_photo_url?: string
  rating: number
  relative_time_description: string
  text: string
  time: number
}

interface GooglePlacesResponse {
  result: {
    name: string
    rating: number
    user_ratings_total: number
    reviews: GoogleReview[]
    url?: string
  }
  status: string
  error_message?: string
}

function getFallbackRating() {
  const badge = shopConfig.keywordBadges?.find((item) => item.toLowerCase().includes('google rating'))
  if (!badge) return 0

  const match = badge.match(/(\d+(\.\d+)?)/)
  return match ? Number.parseFloat(match[1]) : 0
}

function getFallbackResponse(message: string) {
  return NextResponse.json(
    {
      rating: getFallbackRating(),
      totalReviews: 0,
      reviews: [],
      googleUrl: shopConfig.google?.mapsUrl || shopConfig.google?.reviewsUrl,
      unavailable: true,
      message,
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    }
  )
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const placeId =
      searchParams.get('placeId') ||
      process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID ||
      process.env.GOOGLE_PLACE_ID

    if (!placeId) {
      return NextResponse.json(
        { error: 'Place ID is required', message: 'Set NEXT_PUBLIC_GOOGLE_PLACE_ID in Vercel.' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY

    if (!apiKey) {
      return getFallbackResponse('Google reviews are temporarily unavailable.')
    }

    // Fetch place details with reviews
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews,url&key=${apiKey}`

    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.statusText}`)
    }

    const data: GooglePlacesResponse = await response.json()

    if (data.status !== 'OK') {
      return getFallbackResponse(
        data.status === 'NOT_FOUND'
          ? 'Google reviews are unavailable for this location right now.'
          : data.status === 'REQUEST_DENIED'
            ? 'Google reviews are temporarily unavailable.'
            : 'Google reviews are temporarily unavailable.'
      )
    }

    const { rating, user_ratings_total, reviews, url: placeUrl } = data.result

    // Return up to 5 reviews (API limit)
    const limitedReviews = reviews?.slice(0, 5) || []

    return NextResponse.json(
      {
        rating,
        totalReviews: user_ratings_total,
        reviews: limitedReviews,
        googleUrl: placeUrl,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching Google Reviews:', error)
    return getFallbackResponse('Google reviews are temporarily unavailable.')
  }
}
