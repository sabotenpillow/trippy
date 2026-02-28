import { test, expect } from '@playwright/test';

test.describe('Trippy - Basic Flow', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/');
    
    // Check if the app title is visible
    await expect(page.locator('h1')).toContainText('Trippy');
    
    // Check if language switcher is visible
    await expect(page.locator('select#language-select')).toBeVisible();
    
    // Check if sign-in button is visible (when not authenticated)
    const signInButton = page.locator('button', { hasText: /sign in|ログイン/i });
    await expect(signInButton.first()).toBeVisible();
  });

  test('should switch language', async ({ page }) => {
    await page.goto('/');
    
    // Switch to English (US)
    await page.selectOption('select#language-select', 'en-US');
    await page.waitForURL('**/en-US');
    await expect(page.locator('button', { hasText: 'Edit Mode' })).toBeVisible();
    
    // Switch to Japanese
    await page.selectOption('select#language-select', 'ja');
    await page.waitForURL('**/ja');
    await expect(page.locator('button', { hasText: '編集モード' })).toBeVisible();
  });

  test('should create a basic trip plan', async ({ page }) => {
    await page.goto('/ja');
    
    // Enter trip title
    const titleInput = page.locator('input[placeholder*="旅行"]').first();
    await titleInput.fill('東京旅行');
    
    // Add first location
    const addLocationButton = page.locator('button', { hasText: '地点を追加' }).first();
    await addLocationButton.click();
    
    // Enter location name
    const locationInput = page.locator('input[placeholder*="場所"]').first();
    await locationInput.fill('東京駅');
    
    // Enter stay duration
    const durationInput = page.locator('input[type="number"]').first();
    await durationInput.fill('60');
    
    // Verify the location was added
    await expect(page.locator('text=東京駅')).toBeVisible();
  });

  test('should switch to preview mode', async ({ page }) => {
    await page.goto('/ja');
    
    // Enter a trip title
    await page.locator('input[placeholder*="旅行"]').first().fill('テスト旅行');
    
    // Click preview button
    await page.locator('button', { hasText: 'プレビュー' }).click();
    
    // Check if we're in preview mode
    await expect(page.locator('text=旅程')).toBeVisible();
  });

  test('should add multiple days', async ({ page }) => {
    await page.goto('/ja');
    
    // Add a new day
    const addDayButton = page.locator('button', { hasText: '日を追加' });
    await addDayButton.click();
    
    // Verify date inputs are visible for both days
    const dateInputs = page.locator('input[type="date"]');
    await expect(dateInputs).toHaveCount(2);
  });

  test('should copy share URL', async ({ page }) => {
    await page.goto('/ja');
    
    // Grant clipboard permissions
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    
    // Enter trip data
    await page.locator('input[placeholder*="旅行"]').first().fill('共有テスト');
    
    // Click share button
    const shareButton = page.locator('button', { hasText: '共有リンクをコピー' });
    await shareButton.click();
    
    // Verify the button text changed
    await expect(page.locator('button', { hasText: 'コピー済み' })).toBeVisible();
    
    // Verify clipboard contains URL
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toContain('plan=');
  });

  test('should load shared trip plan from URL', async ({ page }) => {
    // First create a trip and get the share URL
    await page.goto('/ja');
    
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    
    // Create a simple trip
    await page.locator('input[placeholder*="旅行"]').first().fill('URLテスト');
    
    // Add location
    const addLocationButton = page.locator('button', { hasText: '地点を追加' }).first();
    await addLocationButton.click();
    const locationInput = page.locator('input[placeholder*="場所"]').first();
    await locationInput.fill('渋谷');
    
    // Copy share URL
    const shareButton = page.locator('button', { hasText: '共有リンクをコピー' });
    await shareButton.click();
    
    const shareUrl = await page.evaluate(() => navigator.clipboard.readText());
    
    // Navigate to the shared URL
    await page.goto(shareUrl);
    
    // Verify the trip loaded correctly
    await expect(page.locator('text=URLテスト')).toBeVisible();
    await expect(page.locator('text=渋谷')).toBeVisible();
    
    // Should be in preview mode by default
    await expect(page.locator('button', { hasText: 'プレビュー' })).toHaveClass(/bg-blue-500/);
  });

  test('should delete a location', async ({ page }) => {
    await page.goto('/ja');
    
    // Add two locations
    const addLocationButton = page.locator('button', { hasText: '地点を追加' }).first();
    
    await addLocationButton.click();
    await page.locator('input[placeholder*="場所"]').first().fill('Location 1');
    
    await addLocationButton.click();
    await page.locator('input[placeholder*="場所"]').last().fill('Location 2');
    
    // Delete the first location
    const deleteButtons = page.locator('button[aria-label="削除"]');
    await deleteButtons.first().click();
    
    // Verify first location is gone
    await expect(page.locator('text=Location 1')).not.toBeVisible();
    // Second location should still be visible
    await expect(page.locator('text=Location 2')).toBeVisible();
  });

  test('should add multiple days with multiple locations', async ({ page }) => {
    await page.goto('/ja');
    
    // Set trip title
    await page.locator('input[placeholder*="旅行"]').first().fill('2日間旅行');
    
    // Day 1: Add location
    let addLocationButton = page.locator('button', { hasText: '地点を追加' }).first();
    await addLocationButton.click();
    await page.locator('input[placeholder*="場所"]').first().fill('Day 1 - Location 1');
    
    // Add Day 2
    await page.locator('button', { hasText: '日を追加' }).click();
    
    // Day 2: Add location
    addLocationButton = page.locator('button', { hasText: '地点を追加' }).last();
    await addLocationButton.click();
    await page.locator('input[placeholder*="場所"]').last().fill('Day 2 - Location 1');
    
    // Switch to preview
    await page.locator('button', { hasText: 'プレビュー' }).click();
    
    // Verify both days are shown
    await expect(page.locator('text=Day 1 - Location 1')).toBeVisible();
    await expect(page.locator('text=Day 2 - Location 1')).toBeVisible();
  });

  test('should show map toggle button when locations exist', async ({ page }) => {
    await page.goto('/ja');
    
    // Initially, map section should not be visible
    await expect(page.locator('text=マップ表示').or(page.locator('text=Map'))).not.toBeVisible();
    
    // Add a location
    const addLocationButton = page.locator('button', { hasText: '地点を追加' }).first();
    await addLocationButton.click();
    await page.locator('input[placeholder*="場所"]').first().fill('Tokyo');
    
    // Map toggle should now be visible
    await expect(page.locator('text=表示').or(page.locator('text=Show'))).toBeVisible();
  });
});

test.describe('Trippy - Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    
    await page.goto('/ja');
    
    // Check if mobile layout is working
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('button', { hasText: '編集' })).toBeVisible();
    
    // Add a location in mobile view
    const addLocationButton = page.locator('button', { hasText: '地点を追加' }).first();
    await addLocationButton.click();
    await page.locator('input[placeholder*="場所"]').first().fill('Mobile Location');
    
    await expect(page.locator('text=Mobile Location')).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    
    await page.goto('/ja');
    
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('button', { hasText: '編集モード' })).toBeVisible();
  });
});
