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

    // Application Form Validation and Submission
    const applicationForm = document.getElementById('applicationForm');
    if (!applicationForm) return;

    // Form validation
    applicationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const requiredFields = applicationForm.querySelectorAll('[required]');
        
        // Reset previous error states
        applicationForm.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
            const errorMessage = group.querySelector('.error-message');
            if (errorMessage) errorMessage.remove();
        });
        
        // Validate required fields
        requiredFields.forEach(field => {
            const formGroup = field.closest('.form-group');
            
            if (!field.value.trim()) {
                isValid = false;
                formGroup.classList.add('error');
                
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'This field is required';
                formGroup.appendChild(errorMsg);
            }
            
            // Email validation
            if (field.type === 'email' && field.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value.trim())) {
                    isValid = false;
                    formGroup.classList.add('error');
                    
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = 'Please enter a valid email address';
                    formGroup.appendChild(errorMsg);
                }
            }
            
            // Phone validation
            if (field.id === 'phone' && field.value.trim()) {
                const phoneRegex = /^\+?[0-9\s\-\(\)]+$/;
                if (!phoneRegex.test(field.value.trim())) {
                    isValid = false;
                    formGroup.classList.add('error');
                    
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = 'Please enter a valid phone number';
                    formGroup.appendChild(errorMsg);
                }
            }
        });
        
        // Check consent checkbox
        const consentCheckbox = document.getElementById('consent');
        if (consentCheckbox && !consentCheckbox.checked) {
            isValid = false;
            const formGroup = consentCheckbox.closest('.form-group');
            formGroup.classList.add('error');
            
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'You must agree to the terms before submitting';
            formGroup.appendChild(errorMsg);
        }
        
        // If valid, simulate form submission
        if (isValid) {
            const formData = new FormData(applicationForm);
            submitApplication(formData);
        } else {
            // Scroll to first error
            const firstError = applicationForm.querySelector('.form-group.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
    
    // Reset button functionality
    const resetButton = applicationForm.querySelector('.reset-btn');
    if (resetButton) {
        resetButton.addEventListener('click', function(e) {
            e.preventDefault();
            applicationForm.reset();
            
            // Clear all error states
            applicationForm.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('error');
                const errorMessage = group.querySelector('.error-message');
                if (errorMessage) errorMessage.remove();
            });
        });
    }
    
    // File input validation and preview
    const resumeInput = document.getElementById('resume');
    const resumeFileInfo = document.getElementById('resumeFileInfo');
    
    if (resumeInput && resumeFileInfo) {
        resumeInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const fileSizeMB = file.size / (1024 * 1024);
                const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                
                if (fileSizeMB > 5) {
                    resumeFileInfo.textContent = 'File is too large. Maximum size is 5MB.';
                    resumeFileInfo.style.color = '#e74c3c';
                    this.value = '';
                } else if (!allowedTypes.includes(file.type)) {
                    resumeFileInfo.textContent = 'Invalid file type. Please upload PDF or Word document.';
                    resumeFileInfo.style.color = '#e74c3c';
                    this.value = '';
                } else {
                    resumeFileInfo.textContent = `Selected file: ${file.name} (${Math.round(fileSizeMB * 100) / 100}MB)`;
                    resumeFileInfo.style.color = '#4a89dc';
                }
            } else {
                resumeFileInfo.textContent = '';
            }
        });
    }
    
    // Show overlay ad on form submit button hover
    const submitBtn = applicationForm.querySelector('.submit-application-btn');
    if (submitBtn) {
        submitBtn.addEventListener('mouseenter', function() {
            // Delay ad showing to prevent accidental triggers
            setTimeout(() => {
                const adOverlay = document.getElementById('adOverlay');
                if (adOverlay) adOverlay.style.display = 'flex';
            }, 300);
        });
    }
});

// Function to simulate application submission
function submitApplication(formData) {
    // Get the form element
    const applicationForm = document.getElementById('applicationForm');
    if (!applicationForm) return;
    
    // Show loading state
    applicationForm.classList.add('form-loading');
    const loader = document.createElement('div');
    loader.className = 'loader';
    applicationForm.appendChild(loader);
    
    // Simulate API call with timeout
    setTimeout(() => {
        // Hide form and show success message
        applicationForm.style.display = 'none';
        const successMessage = document.querySelector('.success-message');
        if (successMessage) {
            successMessage.style.display = 'block';
        } else {
            // Create success message if it doesn't exist
            const message = document.createElement('div');
            message.className = 'success-message';
            message.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <h3>Application Submitted Successfully!</h3>
                <p>Thank you for applying for the Senior Frontend Developer position at TechCorp Inc.</p>
                <p>We have received your application and will review it shortly.</p>
                <p>You will receive a confirmation email with further details.</p>
                <a href="jobs.html" class="btn btn-primary mt-4">Back to Job Listings</a>
            `;
            
            applicationForm.parentNode.appendChild(message);
        }
        
        // Remove loading state
        applicationForm.classList.remove('form-loading');
        loader.remove();
        
        // Scroll to success message
        const successElement = document.querySelector('.success-message');
        if (successElement) {
            successElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // Log form data (in a real app, this would be sent to server)
        console.log('Application submitted with the following data:');
        for (const [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
    }, 2000);
}

// Close ad overlay functionality
document.addEventListener('DOMContentLoaded', function() {
    const closeAdButton = document.getElementById('closeAdButton');
    const adOverlay = document.getElementById('adOverlay');
    
    if (closeAdButton && adOverlay) {
        closeAdButton.addEventListener('click', function() {
            adOverlay.style.display = 'none';
        });
        
        // Also close if clicked outside the ad content
        adOverlay.addEventListener('click', function(e) {
            if (e.target === adOverlay) {
                adOverlay.style.display = 'none';
            }
        });
    }
}); 