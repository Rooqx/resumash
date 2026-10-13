import { test, expect } from '@playwright/test'

test('builder persists fields, step, and template across refresh', async ({ page }) => {
 await page.goto('/build-resume/')
 await page.getByRole('button',{name:'Build manually'}).click()
 await page.getByPlaceholder('Enter your full name').fill('Taylor Test Candidate')
 await page.getByPlaceholder('Enter your profession',{exact:true}).fill('Customer Support Specialist')
 await page.getByRole('button',{name:'Next step'}).click()
 await page.getByRole('button',{name:'Use template'}).nth(0).click()
 await page.reload()
 await expect(page.getByText('Step 2 of')).toBeVisible()
 await page.getByRole('button',{name:'Personal info'}).click()
 await expect(page.getByPlaceholder('Enter your full name')).toHaveValue('Taylor Test Candidate')
})

test('can view the real PDF and download a valid PDF', async ({ page }) => {
 await page.goto('/build-resume/')
 await page.getByRole('button',{name:'Build manually'}).click()
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

test('tailoring restores original uploaded PDF and clears it on request',async ({page})=>{
 await page.goto('/tailor-resume/')
 const description=page.getByRole('textbox',{name:'Job description'})
 await description.fill('Looking for a support professional with experience managing customer inquiries.')
 await page.locator('input[type="file"]').setInputFiles({
  name:'original-resume.pdf',
  mimeType:'application/pdf',
  buffer:Buffer.from('%PDF-1.4\n1 0 obj<</Type/Catalog>>endobj\n%%EOF'),
 })
 await expect(page.getByText('original-resume.pdf',{exact:true})).toBeVisible()
 // The debounce and the IndexedDB transaction both need to complete.
 await expect.poll(async()=>page.evaluate(()=>Boolean(localStorage.getItem('resumash:tailor:v1')))).toBe(true)
 await page.reload()
 await expect(description).toHaveValue(/Looking for a support professional/)
 await expect(page.getByText('original-resume.pdf',{exact:true})).toBeVisible()
 await page.getByRole('button',{name:'Clear local work'}).click()
 await expect(page.getByText('Choose your PDF resume')).toBeVisible()
 await page.reload()
 await expect(page.getByText('Choose your PDF resume')).toBeVisible()
 await expect(description).toHaveValue('')
})

test('anonymous tailoring survives refresh and fetches a completed resume with its token',async({page})=>{
 let submissionId=''
 let secret=''
 let statusChecks=0
 let finished=false
 const mockHeaders={'access-control-allow-origin':'*','access-control-allow-methods':'GET,POST,OPTIONS','access-control-allow-headers':'x-resume-job-id,x-resume-job-token,content-type'}
 await page.route('**/api/v1/resumes/tailor',async route=>{
  if(route.request().method()==='OPTIONS'){
   await route.fulfill({status:204,headers:mockHeaders})
   return
  }
  const request=route.request()
  submissionId=request.headers()['x-resume-job-id']??''
  secret=request.headers()['x-resume-job-token']??''
  expect(submissionId).toMatch(/^[0-9a-f-]{36}$/)
  expect(secret).toMatch(/^[0-9a-f]{64}$/)
  await route.fulfill({status:202,headers:mockHeaders,contentType:'application/json',body:JSON.stringify({jobId:submissionId,status:'queued'})})
 })
 await page.route('**/api/v1/resumes/tailor/*',async route=>{
  if(route.request().method()==='OPTIONS'){
   await route.fulfill({status:204,headers:mockHeaders})
   return
  }
  const request=route.request()
  expect(request.url()).toContain(submissionId)
  expect(request.headers()['x-resume-job-token']).toBe(secret)
  statusChecks++
  await route.fulfill({status:200,headers:mockHeaders,contentType:'application/json',body:JSON.stringify(
   finished?{jobId:submissionId,status:'completed',result:{inputValue:{fullName:'Synthetic Candidate'},fields:{},suggestions:[],requirements:[],missingRequirements:[],clarificationQuestions:[],writingNotes:[],requiresReview:true}}:{jobId:submissionId,status:'queued'}
  )})
 })
 await page.goto('/tailor-resume/')
 await page.getByRole('textbox',{name:'Job description'}).fill('A customer support role that requires handling incoming requests and documenting issues.')
 await page.locator('input[type="file"]').setInputFiles({
  name:'synthetic.pdf',mimeType:'application/pdf',
  buffer:Buffer.from('%PDF-1.4\n1 0 obj<</Type/Catalog>>endobj\n%%EOF'),
 })
 await page.getByRole('button',{name:'Tailor my resume'}).click()
 await expect.poll(()=>statusChecks).toBeGreaterThan(0)
 expect(submissionId).toBeTruthy()
 finished=true
 await page.reload()
 await expect(page.getByText('Evidence-backed review')).toBeVisible({timeout:15000})
 await page.getByRole('button',{name:'Update sources'}).click()
 await expect(page.getByRole('textbox',{name:'Job description'})).toHaveValue(/customer support role/)
})

test('global tailoring widget survives navigation without a blocking loader', async ({page}) => {
 let jobId = ''
 let token = ''
 let finished = false
 const headers = {'access-control-allow-origin':'*','access-control-allow-methods':'GET,POST,OPTIONS','access-control-allow-headers':'x-resume-job-id,x-resume-job-token,content-type'}
 await page.route('**/api/v1/resumes/tailor', async route => {
  if (route.request().method()==='OPTIONS') {await route.fulfill({status:204,headers});return}
  jobId = route.request().headers()['x-resume-job-id'] || ''
  token = route.request().headers()['x-resume-job-token'] || ''
  await route.fulfill({status:202,headers,contentType:'application/json',body:JSON.stringify({jobId,status:'queued'})})
 })
 await page.route('**/api/v1/resumes/tailor/*', async route => {
  if (route.request().method()==='OPTIONS') {await route.fulfill({status:204,headers});return}
  expect(route.request().headers()['x-resume-job-token']).toBe(token)
  await route.fulfill({status:200,headers,contentType:'application/json',body:JSON.stringify(
   finished ? {jobId,status:'completed',result:{inputValue:{fullName:'Synthetic Candidate'},fields:{},suggestions:[],requirements:[],missingRequirements:[],clarificationQuestions:[],writingNotes:[],requiresReview:true}}:{jobId,status:'processing'}
  )})
 })
 await page.goto('/tailor-resume/')
 await page.getByRole('textbox',{name:'Job description'}).fill('A customer support role with an emphasis on handling customer requests and documenting issues.')
 await page.locator('input[type="file"]').setInputFiles({name:'synthetic.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4\n%%EOF')})
 await page.getByRole('button',{name:'Tailor my resume'}).click()
 await expect(page.getByRole('dialog',{name:'Tailoring your resume'})).toBeVisible()
 await page.getByRole('button',{name:'Minimize'}).click()
 await page.getByRole('link',{name:'Build',exact:true}).click()
 await expect(page.getByText('Tailoring in progress')).toBeVisible()
 await page.waitForTimeout(3400)
 await expect(page.getByRole('status',{name:'Loading...'})).toHaveCount(0)
 finished = true
 await expect(page.getByText('Your tailored resume is ready')).toBeVisible({timeout:16000})
 await expect(page).toHaveURL(/tailor-resume/,{timeout:15000})
 await expect(page.getByText('Evidence-backed review')).toBeVisible()
})

test('cover letter can reuse saved resume facts and export a text PDF',async({page})=>{
 await page.goto('/build-resume/')
 await page.getByRole('button',{name:'Build manually'}).click()
 await page.getByPlaceholder('Enter your full name').fill('Cover Letter Candidate')
 await page.getByPlaceholder('Enter your profession',{exact:true}).fill('Product Designer')
 await page.getByRole('link',{name:'Cover letter'}).click()
 await page.getByRole('button',{name:'Use my resume'}).click()
 await expect(page.getByRole('textbox',{name:/Your name/})).toHaveValue('Cover Letter Candidate')
 await page.getByRole('textbox',{name:/Company/}).fill('Example Limited')
 await page.getByRole('textbox',{name:/Job description/}).fill('A product design role with a strong focus on accessible experiences.')
 await page.getByRole('textbox',{name:/Your real experience/}).fill('Designed accessible and responsive user interfaces for real projects.')
 await page.getByRole('textbox',{name:/Edit your cover letter/}).fill('Dear Hiring Team,\n\nI am applying for the Product Designer role. My experience includes designing responsive interfaces for users.\n\nKind regards,\nCover Letter Candidate.')
 const download = page.waitForEvent('download',{timeout:45000})
 await page.getByRole('button',{name:'Download PDF'}).click()
 expect((await download).suggestedFilename()).toMatch(/Cover_Letter\.pdf$/)
})
