// Application Form Functionality
document.addEventListener('DOMContentLoaded', function() {
    const applicationForm = document.getElementById('application-form');
    const successMessage = document.getElementById('success-message');
    const adOverlay = document.getElementById('ad-overlay');
    const closeAdBtn = document.getElementById('close-ad-btn');
    const fileInputs = document.querySelectorAll('input[type="file"]');
    const resetBtn = document.getElementById('reset-form');

    // File input handling
    if (fileInputs) {
        fileInputs.forEach(input => {
            const fileInfo = input.parentElement.querySelector('.file-info');
            
            input.addEventListener('change', function() {
                if (this.files.length > 0) {
                    const fileName = this.files[0].name;
                    const fileSize = (this.files[0].size / 1024).toFixed(2) + ' KB';
                    fileInfo.textContent = `Selected: ${fileName} (${fileSize})`;
                } else {
                    fileInfo.textContent = 'No file selected';
                }
            });
        });
    }

    // Reset form button
    if (resetBtn) {
        resetBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to reset the form? All entered data will be lost.')) {
                applicationForm.reset();
                // Reset file info text
                document.querySelectorAll('.file-info').forEach(info => {
                    info.textContent = 'No file selected';
                });
                // Remove validation errors
                document.querySelectorAll('.form-group.error').forEach(group => {
                    group.classList.remove('error');
                });
                document.querySelectorAll('.error-message').forEach(message => {
                    message.remove();
                });
            }
        });
    }

    // Form submission
    if (applicationForm) {
        applicationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form validation
            if (!validateForm()) {
                return;
            }
            
            // Show ad overlay before final submission
            showAdOverlay();
            
            // Simulate form submission (in a real app, you would submit to a server here)
            const submitBtn = applicationForm.querySelector('.submit-application-btn');
            const originalBtnText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<span class="loading-spinner"></span> Submitting...';
            submitBtn.disabled = true;
            
            // Simulate server response after 3 seconds
            setTimeout(function() {
                applicationForm.style.display = 'none';
                successMessage.style.display = 'block';
                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth' });
                
                // Reset button state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }, 3000);
        });
    }

    // Form validation function
    function validateForm() {
        let isValid = true;
        const requiredFields = applicationForm.querySelectorAll('[required]');
        
        // Clear previous error messages
        document.querySelectorAll('.error-message').forEach(message => {
            message.remove();
        });
        document.querySelectorAll('.form-group.error').forEach(group => {
            group.classList.remove('error');
        });
        
        // Check required fields
        requiredFields.forEach(field => {
            const formGroup = field.closest('.form-group');
            
            if (!field.value.trim()) {
                isValid = false;
                formGroup.classList.add('error');
                const errorMsg = document.createElement('span');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'This field is required';
                formGroup.appendChild(errorMsg);
            } else if (field.type === 'email' && !validateEmail(field.value)) {
                isValid = false;
                formGroup.classList.add('error');
                const errorMsg = document.createElement('span');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Please enter a valid email address';
                formGroup.appendChild(errorMsg);
            } else if (field.type === 'tel' && !validatePhone(field.value)) {
                isValid = false;
                formGroup.classList.add('error');
                const errorMsg = document.createElement('span');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Please enter a valid phone number';
                formGroup.appendChild(errorMsg);
            }
        });
        
        return isValid;
    }
    
    // Email validation helper
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Phone validation helper
    function validatePhone(phone) {
        const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return re.test(String(phone));
    }
    
    // Show ad overlay
    function showAdOverlay() {
        if (adOverlay) {
            adOverlay.style.display = 'flex';
        }
    }
    
    // Close ad overlay
    if (closeAdBtn) {
        closeAdBtn.addEventListener('click', function() {
            adOverlay.style.display = 'none';
        });
    }
});

// Apply Now Button Ad Overlay
document.addEventListener('DOMContentLoaded', function() {
    const applyNowBtns = document.querySelectorAll('.apply-now-btn');
    
    if (applyNowBtns.length > 0) {
        applyNowBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get the ad overlay
                const adOverlay = document.getElementById('ad-overlay');
                
                if (adOverlay) {
                    // Show the ad overlay
                    adOverlay.style.display = 'flex';
                    
                    // Get the job URL from the button's href
                    const jobUrl = this.getAttribute('href');
                    
                    // Store the URL to redirect after the ad
                    if (jobUrl) {
                        sessionStorage.setItem('redirectAfterAd', jobUrl);
                    }
                    
                    // Set a timeout to redirect after 5 seconds (typical ad view time)
                    setTimeout(function() {
                        const redirectUrl = sessionStorage.getItem('redirectAfterAd');
                        if (redirectUrl) {
                            window.location.href = redirectUrl;
                            sessionStorage.removeItem('redirectAfterAd');
                        }
                    }, 5000); // 5 seconds
                }
            });
        });
    }
}); 