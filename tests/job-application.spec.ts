import { test, expect } from '@playwright/test';
import path from 'node:path';

// Simple wait helper (1 second default)
async function wait(seconds: number = 1) {
  return new Promise(res => setTimeout(res, seconds * 1000));
}

// Configuration
const name = process.env.NAME || 'Mustafa Muhammed';
const email = process.env.EMAIL || 'qa.engineer505@gmail.com';
const phone = process.env.PHONE || '+43 68xxxxxx';
const cvPath = path.resolve(__dirname, '../assets/Mustafa_Professional_Profile.pdf');
const coverLetterPath = path.resolve(__dirname, '../assets/Mustafa_Cover_Letter_Pineapple.pdf');

test('QA Engineer Application', async ({ page }) => {
  test.setTimeout(120000);

  // 1. Navigate to job page
  await page.goto('https://pineapple-recruiting.at/');
  await wait(2);
  
  await page.getByRole('link', { name: 'Jobs' }).click();
  await wait();
  
  await page.getByRole('link', { name: 'QA Engineer - Test Automation' }).click();
  await wait(2);

  // 2. Start application
  await page.getByRole('button', { name: 'Apply', exact: true }).click();
  await wait(2);

  // 3. Fill personal info with simple scrolling
  const fullNameField = page.getByRole('textbox', { name: 'Full name' });
  await fullNameField.scrollIntoViewIfNeeded();
  await wait();
  await fullNameField.fill(name);
  await wait();

  const emailField = page.getByRole('textbox', { name: 'Email address' });
  await emailField.scrollIntoViewIfNeeded();
  await wait();
  await emailField.fill(email);
  await wait();

  const phoneField = page.getByRole('textbox', { name: 'Phone number' });
  await phoneField.scrollIntoViewIfNeeded();
  await wait();
  await phoneField.fill(phone);
  await wait(2);

  // 4. Handle CV upload
  const cvUpload = page.locator('input[name="candidate.cv"]');
  await cvUpload.scrollIntoViewIfNeeded();
  await wait();
  await cvUpload.setInputFiles(cvPath);
  await wait(3);
  await expect(page.locator('text=Mustafa_Professional_Profile.pdf')).toBeVisible();

  // 5. Cover letter
  const coverLetterInput = page.locator('input[type="file"]').nth(1);
  if (await coverLetterInput.count() > 0) {
    await coverLetterInput.scrollIntoViewIfNeeded();
    await wait();
    await coverLetterInput.setInputFiles(coverLetterPath);
    await wait(3);
    await expect(page.locator('text=Mustafa_Cover_Letter_Pineapple.pdf')).toBeVisible();
  }

  // 6. Complete application
  const termsCheckbox = page.locator('[id="input-candidate.agreements.0.consent-16-0"]');
  await termsCheckbox.scrollIntoViewIfNeeded();
  await wait();
  await page.mouse.wheel(0, 100); // Small additional scroll to ensure visibility
  await termsCheckbox.click();
  await wait(2);

  // 7. Final submit
  const submitBtn = page.getByTestId('submit-application-form-button');
  await submitBtn.scrollIntoViewIfNeeded();
  await wait(3);
  
  // Submit the application
  await submitBtn.click();
  await wait(2);
});