import { describe, it, expect } from 'vitest'
import {
  createEmptyTripPlan,
  encodeTripPlan,
  decodeTripPlan,
  formatDuration,
  formatDistance,
  getTravelModeLabel,
  getTravelModeEmoji,
  generateId,
} from '@/lib/trip-utils'
import { TripPlan } from '@/types/trip'

describe('trip-utils', () => {
  describe('createEmptyTripPlan', () => {
    it('should create an empty trip plan with one day', () => {
      const plan = createEmptyTripPlan()
      
      expect(plan).toHaveProperty('title')
      expect(plan).toHaveProperty('days')
      expect(plan.days).toHaveLength(1)
      expect(plan.days[0]).toHaveProperty('date')
      expect(plan.days[0]).toHaveProperty('locations')
      expect(plan.days[0].locations).toEqual([])
    })

    it('should have a date string in ISO format', () => {
      const plan = createEmptyTripPlan()
      const date = plan.days[0].date
      
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })
  })

  describe('encodeTripPlan and decodeTripPlan', () => {
    it('should encode and decode a simple trip plan', () => {
      const originalPlan: TripPlan = {
        title: 'Test Trip',
        days: [
          {
            date: '2026-03-01',
            locations: [
              {
                id: '1',
                name: 'Tokyo Station',
                stayDuration: 60,
              },
              {
                id: '2',
                name: 'Shibuya',
                stayDuration: 120,
                transport: {
                  method: 'Train',
                  duration: 30,
                },
              },
            ],
          },
        ],
      }

      const encoded = encodeTripPlan(originalPlan)
      expect(typeof encoded).toBe('string')
      expect(encoded.length).toBeGreaterThan(0)

      const decoded = decodeTripPlan(encoded)
      expect(decoded).toEqual(originalPlan)
    })

    it('should handle complex trip plans with multiple days', () => {
      const originalPlan: TripPlan = {
        title: 'Multi-day Trip',
        days: [
          {
            date: '2026-03-01',
            locations: [
              {
                id: '1',
                name: 'Location 1',
                stayDuration: 60,
              },
            ],
          },
          {
            date: '2026-03-02',
            locations: [
              {
                id: '2',
                name: 'Location 2',
                stayDuration: 90,
                transport: {
                  method: 'Bus',
                  duration: 45,
                },
              },
            ],
          },
        ],
      }

      const encoded = encodeTripPlan(originalPlan)
      const decoded = decodeTripPlan(encoded)
      
      expect(decoded).toEqual(originalPlan)
    })

    it('should handle special characters in location names', () => {
      const originalPlan: TripPlan = {
        title: 'Trip with 日本語 & Symbols!',
        days: [
          {
            date: '2026-03-01',
            locations: [
              {
                id: '1',
                name: '東京駅 (Tokyo Station) & 周辺',
                stayDuration: 60,
              },
            ],
          },
        ],
      }

      const encoded = encodeTripPlan(originalPlan)
      const decoded = decodeTripPlan(encoded)
      
      expect(decoded).toEqual(originalPlan)
    })

    it('should return null for invalid encoded string', () => {
      const invalid = 'invalid-base64-string'
      const decoded = decodeTripPlan(invalid)
      
      expect(decoded).toBeNull()
    })

    it('should handle empty locations array', () => {
      const originalPlan: TripPlan = {
        title: 'Empty Trip',
        days: [
          {
            date: '2026-03-01',
            locations: [],
          },
        ],
      }

      const encoded = encodeTripPlan(originalPlan)
      const decoded = decodeTripPlan(encoded)
      
      expect(decoded).toEqual(originalPlan)
    })
  })

  describe('formatDuration', () => {
    it('should format minutes correctly', () => {
      expect(formatDuration(30)).toBe('30m')
      expect(formatDuration(59)).toBe('59m')
    })

    it('should format hours and minutes correctly', () => {
      expect(formatDuration(60)).toBe('1h')
      expect(formatDuration(90)).toBe('1h 30m')
      expect(formatDuration(120)).toBe('2h')
      expect(formatDuration(185)).toBe('3h 5m')
    })

    it('should handle zero duration', () => {
      expect(formatDuration(0)).toBe('0m')
    })

    it('should handle large durations', () => {
      expect(formatDuration(1440)).toBe('24h') // 1 day
      expect(formatDuration(1500)).toBe('25h') // > 1 day
    })
  })

  describe('formatDistance', () => {
    it('should format meters correctly', () => {
      expect(formatDistance(100)).toBe('100m')
      expect(formatDistance(999)).toBe('999m')
    })

    it('should format kilometers correctly', () => {
      expect(formatDistance(1000)).toBe('1.0km')
      expect(formatDistance(1500)).toBe('1.5km')
      expect(formatDistance(2345)).toBe('2.3km')
      expect(formatDistance(10000)).toBe('10.0km')
    })

    it('should handle zero distance', () => {
      expect(formatDistance(0)).toBe('0m')
    })
  })

  describe('getTravelModeLabel', () => {
    it('should return correct labels for travel modes', () => {
      expect(getTravelModeLabel('DRIVING')).toBe('Driving')
      expect(getTravelModeLabel('WALKING')).toBe('Walking')
      expect(getTravelModeLabel('TRANSIT')).toBe('Transit')
      expect(getTravelModeLabel('BICYCLING')).toBe('Bicycling')
    })
  })

  describe('getTravelModeEmoji', () => {
    it('should return correct emojis for travel modes', () => {
      expect(getTravelModeEmoji('DRIVING')).toBe('🚗')
      expect(getTravelModeEmoji('WALKING')).toBe('🚶')
      expect(getTravelModeEmoji('TRANSIT')).toBe('🚆')
      expect(getTravelModeEmoji('BICYCLING')).toBe('🚴')
    })
  })

  describe('generateId', () => {
    it('should generate a unique ID', () => {
      const id1 = generateId()
      const id2 = generateId()
      
      expect(typeof id1).toBe('string')
      expect(typeof id2).toBe('string')
      expect(id1).not.toBe(id2)
    })

    it('should generate IDs of consistent length', () => {
      const id1 = generateId()
      const id2 = generateId()
      
      expect(id1.length).toBe(id2.length)
      expect(id1.length).toBeGreaterThan(0)
    })
  })
})
