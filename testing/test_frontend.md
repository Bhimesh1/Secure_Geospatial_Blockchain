# Frontend Testing Guide

## Manual Testing Steps

1. **Home Page**
   - [ ] Verify all text is displayed correctly
   - [ ] Check "Get Started" button navigates to Dashboard
   - [ ] Verify responsive layout on different screen sizes

2. **Navigation**
   - [ ] Test sidebar navigation links
   - [ ] Verify current page is highlighted in navigation
   - [ ] Test "Connect Wallet" button functionality

3. **Dashboard Page**
   - [ ] Check data IDs are displayed (if any)
   - [ ] Verify file list shows available files
   - [ ] Test file selection functionality
   - [ ] Verify map visualization displays when geospatial data is selected

4. **Data Management Page**
   - [ ] Test file upload with various file types
   - [ ] Verify file selection from the file list
   - [ ] Test encryption with and without RSA
   - [ ] Verify blockchain storage functionality
   - [ ] Check for proper error messages and success notifications

5. **Blockchain Management Page**
   - [ ] Test data retrieval with valid and invalid data IDs
   - [ ] Verify access control functionality (grant, check, revoke)
   - [ ] Test with valid and invalid Ethereum addresses
   - [ ] Check for proper error messages and success notifications

## Cross-Browser Testing

Test the application in the following browsers:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## Responsive Design Testing

Test the application on the following device sizes:
- [ ] Desktop (1920×1080)
- [ ] Laptop (1366×768)
- [ ] Tablet (768×1024)
- [ ] Mobile (375×667)