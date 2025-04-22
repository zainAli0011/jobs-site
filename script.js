// Function to show the ad overlay when a user clicks "Apply Now"
function showAd(jobId) {
    // Store the job ID for later use (when the user closes the ad and proceeds to apply)
    localStorage.setItem('currentJobApplication', jobId);
    
    // Display the ad overlay
    const adOverlay = document.getElementById('ad-overlay');
    adOverlay.style.display = 'flex';
    
    // Log the ad impression for analytics (you would implement this with your ad provider)
    console.log(`Ad impression for job application: ${jobId}`);
    
    // Simulate loading the ad
    loadAd();
}

// Function to close the ad overlay
function closeAd() {
    // Hide the ad overlay
    const adOverlay = document.getElementById('ad-overlay');
    adOverlay.style.display = 'none';
    
    // Get the job ID from localStorage
    const jobId = localStorage.getItem('currentJobApplication');
    
    // Log that the user closed the ad
    console.log(`User closed ad for job application: ${jobId}`);
    
    // Here you would normally redirect to the application form
    // For this demo, we'll just alert that they're proceeding to apply
    alert(`You are now proceeding to apply for the job. Job ID: ${jobId}`);
}

// Function to simulate loading the ad (in a real implementation, this would be handled by the ad provider)
function loadAd() {
    console.log('Loading advertisement...');
    // In a real implementation, the ad provider's script would handle this
}

// Function to get URL parameters (for job detail page)
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Add event listeners for responsiveness
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle (for responsive design)
    const menuToggle = document.createElement('div');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '☰';
    document.querySelector('header .container').prepend(menuToggle);
    
    menuToggle.addEventListener('click', function() {
        const nav = document.querySelector('nav');
        nav.classList.toggle('active');
    });
    
    // Add search functionality
    const searchButton = document.querySelector('.search-box button');
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const keyword = document.querySelector('.search-box input').value;
            const category = document.querySelector('.search-box select:nth-of-type(1)').value;
            const location = document.querySelector('.search-box select:nth-of-type(2)').value;
            
            // Log the search parameters (in a real app, this would trigger a search)
            console.log(`Searching for: ${keyword}, Category: ${category}, Location: ${location}`);
            
            // Redirect to jobs page with search parameters
            window.location.href = `jobs.html?keyword=${encodeURIComponent(keyword)}&category=${encodeURIComponent(category)}&location=${encodeURIComponent(location)}`;
        });
    }
    
    // Add filter functionality
    const filterSelects = document.querySelectorAll('.filter select');
    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            // In a real app, this would filter the job listings
            console.log(`Filter changed: ${this.previousElementSibling.textContent} - ${this.value}`);
        });
    });
    
    // Make the pagination functional
    const paginationLinks = document.querySelectorAll('.pagination a');
    paginationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from current active link
            document.querySelector('.pagination a.active').classList.remove('active');
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // In a real app, this would load the corresponding page of job listings
            console.log(`Pagination: Loading page ${this.textContent}`);
        });
    });
    
    // Check if we're on the job detail page
    if (window.location.pathname.includes('job-detail.html')) {
        // Get the job ID from the URL
        const jobId = getUrlParameter('id');
        console.log(`Loading job details for job ID: ${jobId}`);
        
        // In a real application, we would use this ID to fetch the job details from a server
        // For this demo, the content is already in the HTML
    }
}); 