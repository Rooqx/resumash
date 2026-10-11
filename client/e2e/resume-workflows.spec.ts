import { test, expect } from '@playwright/test'

test('builder persists fields, step, and template across refresh', async ({ page }) => {
 await page.goto('/build-resume/')
 await page.getByPlaceholder('Enter your full name').fill('Taylor Test Candidate')
 await page.getByPlaceholder('Enter your profession').fill('Customer Support Specialist')
 await page.getByRole('button',{name:'Next step'}).click()
 await page.getByRole('button',{name:'Use template'}).nth(0).click()
 await page.reload()
 await expect(page.getByText('Step 2 of')).toBeVisible()
 await page.getByRole('button',{name:'Personal info'}).click()
 await expect(page.getByPlaceholder('Enter your full name')).toHaveValue('Taylor Test Candidate')
})

test('can view the real PDF and download a valid PDF', async ({ page }) => {
 await page.goto('/build-resume/')
 await page.getByPlaceholder('Enter your full name').fill('Taylor Test Candidate')
 await page.getByRole('button',{name:'Inspect actual PDF pages'}).click()
 await expect(page.getByRole('dialog',{name:'Real PDF page preview'})).toBeVisible()
 await expect(page.getByTitle('Selectable A4 resume PDF')).toBeVisible({timeout:30000})
 await page.getByRole('button',{name:'Close'}).click()
 const download=page.waitForEvent('download',{timeout:45000})
 await page.getByRole('button',{name:'Download PDF'}).click()
 const file=await download
 expect(file.suggestedFilename()).toMatch(/\.pdf$/)
})

test('mobile A4 view fits and zoom works', async ({ page }) => {
 await page.setViewportSize({width:390,height:844})
 await page.goto('/build-resume/')
 await page.getByRole('button',{name:'Preview',exact:true}).click()
 await expect(page.getByRole('button',{name:'Fit A4 to available width'})).toBeVisible()
 const before=await page.locator('[aria-label="Resume preview"]').locator('..').getByText(/A4 ·/).textContent()
 await page.getByRole('button',{name:'Zoom in'}).click()
 const after=await page.locator('[aria-label="Resume preview"]').locator('..').getByText(/A4 ·/).textContent()
 expect(after).not.toBe(before)
})
