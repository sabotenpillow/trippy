import '@testing-library/jest-dom'
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock CSS imports to avoid Tailwind CSS issues
vi.mock('*/globals.css', () => ({}))

// Mock environment variables
process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 'test-api-key'
