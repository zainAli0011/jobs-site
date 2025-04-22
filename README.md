# JobFinder - Job Listing Website

A responsive job listing website with Google Ads integration. This project includes a job board with categories, search functionality, and ad placements.

## Features

- **Job Listings**: Browse through job listings with detailed information
- **Search Functionality**: Search for jobs based on keywords, categories, and locations
- **Category Browsing**: Browse jobs by different categories
- **Google Ad Integration**: 
  - Sidebar ads on both sides of the job listings
  - Interstitial ads that appear when users click "Apply Now"
- **Responsive Design**: Fully responsive layout that works on all devices

## Technical Details

This website is built with:
- HTML5
- CSS3 (with Flexbox and Grid for layouts)
- Vanilla JavaScript (no frameworks)
- Google AdSense integration

## Setup Instructions

1. **Google AdSense Integration**:
   - Replace `YOUR_PUBLISHER_ID` in the index.html file with your actual Google AdSense publisher ID
   - Replace `LEFT_AD_SLOT`, `RIGHT_AD_SLOT`, and `OVERLAY_AD_SLOT` with your actual ad slot IDs

2. **Customization**:
   - Update the job listings in the index.html file
   - Modify the categories in the index.html file
   - Customize the styling in the styles.css file

3. **Deployment**:
   - Upload all files to your web hosting provider
   - Ensure all files are in the same directory
   - No build process is required since this is a static website

## Directory Structure

```
/
├── index.html     # Main HTML file
├── jobs.html      # Jobs listing page
├── job-detail.html # Job detail page
├── categories.html # Categories page
├── about.html     # About us page
├── contact.html   # Contact page
├── styles.css     # CSS styles
├── script.js      # JavaScript functionality
└── README.md      # This file
```

## Ad Implementation Details

### Sidebar Ads

The sidebar ads are implemented as fixed elements on the left and right sides of the job listings. These ad containers stay in place while users scroll through the job listings.

### Apply Button Ads

When a user clicks on the "Apply Now" button:
1. An overlay appears with an ad
2. User must close the ad to proceed to the application
3. After closing the ad, the user would normally be redirected to the application form

## License

This project is open source and available under the [MIT License](LICENSE). 