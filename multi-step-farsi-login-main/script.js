// Initialize Lucide icons
lucide.createIcons();

// Global state
let currentFlow = 1;
let currentStep = 1;
let maxSteps = 4;
let userData = {};
let resendTimer = 0;
let resendInterval = null;

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
html.classList.toggle('dark', currentTheme === 'dark');

themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    const newTheme = html.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    lucide.createIcons();
});

// Flow management
function startFlow(flowNumber) {
    currentFlow = flowNumber;
    currentStep = 1;
    
    switch(flowNumber) {
        case 1: maxSteps = 4; break;
        case 2: maxSteps = 4; break;
        case 3: maxSteps = 3; break;
    }
    
    document.getElementById('flow-selection').classList.add('hidden');
    document.getElementById('login-container').classList.remove('hidden');
    
    updateStepper();
    renderStep();
}

function goBack() {
    if (currentStep > 1) {
        currentStep--;
        updateStepper();
        renderStep();
    } else {
        document.getElementById('login-container').classList.add('hidden');
        document.getElementById('flow-selection').classList.remove('hidden');
        resetForm();
    }
}

function resetForm() {
    currentFlow = 1;
    currentStep = 1;
    userData = {};
    clearResendTimer();
}

// Stepper management
function updateStepper() {
    for (let i = 1; i <= 4; i++) {
        const step = document.getElementById(`step-${i}`);
        const connector = document.getElementById(`connector-${i}`);
        
        if (i <= currentStep) {
            step.classList.remove('bg-gray-300', 'dark:bg-gray-600', 'text-gray-600', 'dark:text-gray-400');
            step.classList.add('bg-primary', 'text-white');
            
            if (i < currentStep) {
                step.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i>';
            } else {
                step.textContent = i;
            }
        } else {
            step.classList.remove('bg-primary', 'text-white');
            step.classList.add('bg-gray-300', 'dark:bg-gray-600', 'text-gray-600', 'dark:text-gray-400');
            step.textContent = i;
        }
        
        if (connector) {
            connector.classList.remove('active', 'completed');
            if (i < currentStep) {
                connector.classList.add('completed');
            } else if (i === currentStep) {
                connector.classList.add('active');
            }
        }
        
        if (i > maxSteps) {
            step.style.display = 'none';
            if (connector) connector.style.display = 'none';
        } else {
            step.style.display = 'flex';
            if (connector && i < maxSteps) connector.style.display = 'block';
        }
    }
    
    const backBtn = document.getElementById('back-btn');
    backBtn.classList.toggle('hidden', currentStep === 1);
    
    lucide.createIcons();
}

// Step rendering
function renderStep() {
    const content = document.getElementById('step-content');
    content.classList.remove('animate-fade-slide-in');
    
    setTimeout(() => {
        content.innerHTML = getStepContent();
        content.classList.add('animate-fade-slide-in');
        lucide.createIcons();
        
        const firstInput = content.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }, 50);
}

function getStepContent() {
    const flowStep = `${currentFlow}-${currentStep}`;
    
    switch(flowStep) {
        case '1-1': return getEmailStep();
        case '1-2': return getPasswordStep();
        case '1-3': return getOTPStep();
        case '1-4': return getSuccessStep();
        case '2-1': return getEmailStep();
        case '2-2': return getMethodSelectionStep();
        case '2-3': return getPasswordlessOTPStep();
        case '2-4': return getSuccessStep();
        case '3-1': return getSocialStep();
        case '3-2': return getPasswordStep();
        case '3-3': return getSuccessStep();
        default: return '<div>Error loading step</div>';
    }
}

// Step content functions
function getEmailStep() {
    return `
        <div class="text-center mb-6">
            <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i data-lucide="mail" class="w-8 h-8 text-primary"></i>
            </div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Enter your email</h2>
            <p class="text-gray-600 dark:text-gray-400 text-sm">If you don't have an account, sign up.</p>
        </div>
        
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email or mobile number</label>
                <input 
                    type="text" 
                    id="email-input"
                    class="w-full h-12 px-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    placeholder="example@domain.com or 09123456789"
                    oninput="validateEmail()"
                >
                <div id="email-error" class="text-destructive text-xs mt-1 hidden"></div>
            </div>
            
            <button 
                id="continue-btn"
                onclick="continueFromEmail()"
                disabled
                class="w-full h-12 bg-primary text-white rounded-xl font-medium disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-gray-600 dark:disabled:text-gray-400 hover:bg-primary/90 transition-all duration-200 focus-ring"
            >
                <span class="btn-text">Continue</span>
            </button>
        </div>
        
        <div class="text-center mt-6">
            <a href="#" class="text-sm text-gray-500 hover:text-primary transition-colors">Sign up</a>
            <span class="mx-2 text-gray-300">•</span>
            <a href="#" class="text-sm text-gray-500 hover:text-primary transition-colors">Recover account</a>
        </div>
    `;
}

function getPasswordStep() {
    return `
        <div class="text-center mb-6">
            <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i data-lucide="lock" class="w-8 h-8 text-primary"></i>
            </div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Password</h2>
            <p class="text-gray-600 dark:text-gray-400 text-sm">For <span class="font-medium">${userData.email || 'user@example.com'}</span></p>
        </div>
        
        <div class="space-y-4">
            <div>
                <div class="flex justify-between items-center mb-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                    <a href="#" class="text-sm text-primary hover:text-primary/80 transition-colors">Forgot password?</a>
                </div>
                <div class="relative">
                    <input 
                        type="password" 
                        id="password-input"
                        class="w-full h-12 px-4 pl-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        placeholder="Enter your password"
                        oninput="validatePassword()"
                    >
                    <button 
                        type="button"
                        onclick="togglePassword()"
                        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <i data-lucide="eye" id="password-eye" class="w-5 h-5"></i>
                    </button>
                </div>
                <div id="password-error" class="text-destructive text-xs mt-1 hidden"></div>
            </div>
            
            <button 
                id="login-btn"
                onclick="continueFromPassword()"
                disabled
                class="w-full h-12 bg-primary text-white rounded-xl font-medium disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-gray-600 dark:disabled:text-gray-400 hover:bg-primary/90 transition-all duration-200 focus-ring"
            >
                <span class="btn-text">Login</span>
            </button>
        </div>
    `;
}

function getMethodSelectionStep() {
    return `
        <div class="text-center mb-6">
            <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i data-lucide="smartphone" class="w-8 h-8 text-primary"></i>
            </div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Choose login method</h2>
            <p class="text-gray-600 dark:text-gray-400 text-sm">For <span class="font-medium">${userData.email || 'user@example.com'}</span></p>
        </div>
        
        <div class="space-y-3">
            <button onclick="selectMethod('sms')" class="w-full p-4 text-left rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-primary/5 transition-all duration-200 method-btn">
                <div class="flex items-center justify-between">
                    <div class="text-left">
                        <h3 class="font-medium text-gray-900 dark:text-white">SMS Code</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Send 6-digit code to mobile number</p>
                    </div>
                    <div class="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                        <i data-lucide="message-square" class="w-5 h-5 text-blue-600 dark:text-blue-400"></i>
                    </div>
                </div>
            </button>
            
            <button onclick="selectMethod('email')" class="w-full p-4 text-left rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-primary/5 transition-all duration-200 method-btn">
                <div class="flex items-center justify-between">
                    <div class="text-left">
                        <h3 class="font-medium text-gray-900 dark:text-white">Email Code</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Send 6-digit code to email</p>
                    </div>
                    <div class="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                        <i data-lucide="mail" class="w-5 h-5 text-green-600 dark:text-green-400"></i>
                    </div>
                </div>
            </button>
            
            <button onclick="selectMethod('magic')" class="w-full p-4 text-left rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-primary/5 transition-all duration-200 method-btn">
                <div class="flex items-center justify-between">
                    <div class="text-left">
                        <h3 class="font-medium text-gray-900 dark:text-white">Magic Link</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Send login link to email</p>
                    </div>
                    <div class="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                        <i data-lucide="link" class="w-5 h-5 text-purple-600 dark:text-purple-400"></i>
                    </div>
                </div>
            </button>
        </div>
    `;
}

function getSocialStep() {
    return `
        <div class="text-center mb-6">
            <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i data-lucide="zap" class="w-8 h-8 text-primary"></i>
            </div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Quick Login</h2>
            <p class="text-gray-600 dark:text-gray-400 text-sm">Sign in with one of the methods below</p>
        </div>
        
        <div class="space-y-3">
            <button onclick="socialLogin('google')" class="social-btn w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200">
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span class="ml-3 text-gray-700 dark:text-gray-300 font-medium">Continue with Google</span>
            </button>
            
            <button onclick="socialLogin('apple')" class="social-btn w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span class="ml-3 text-gray-700 dark:text-gray-300 font-medium">Continue with Apple</span>
            </button>
        </div>
    `;
}

function getOTPStep() {
    return `
        <div class="text-center mb-6">
            <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i data-lucide="shield-check" class="w-8 h-8 text-primary"></i>
            </div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Enter 6-digit code</h2>
            <p class="text-gray-600 dark:text-gray-400 text-sm">Code sent to <span class="font-medium font-mono">${maskContact(userData.email)}</span></p>
        </div>
        
        <div class="space-y-6">
            <div class="flex justify-center">
                <div class="flex gap-3">
                    ${Array.from({length: 6}, (_, i) => `
                        <input 
                            type="text" 
                            maxlength="1"
                            class="otp-input w-12 h-12 text-center text-lg font-mono border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                            id="otp-${i}"
                            oninput="handleOTPInput(${i})"
                            onkeydown="handleOTPKeydown(${i}, event)"
                            onpaste="handleOTPPaste(event)"
                        >
                    `).join('')}
                </div>
            </div>
            
            <div class="text-center">
                <button 
                    id="resend-btn"
                    onclick="resendOTP()"
                    disabled
                    class="text-sm text-gray-500 hover:text-primary transition-colors disabled:cursor-not-allowed"
                >
                    <span id="resend-text">Resend (00:30)</span>
                </button>
            </div>
            
            <button 
                id="verify-btn"
                onclick="verifyOTP()"
                disabled
                class="w-full h-12 bg-primary text-white rounded-xl font-medium disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-gray-600 dark:disabled:text-gray-400 hover:bg-primary/90 transition-all duration-200 focus-ring"
            >
                <span class="btn-text">Verify Code</span>
            </button>
        </div>
    `;
}

function getPasswordlessOTPStep() {
    const method = userData.method;
    let title, subtitle, icon;
    
    if (method === 'magic') {
        title = 'Link sent';
        subtitle = `Login link sent to <span class="font-medium font-mono">${maskContact(userData.email)}</span>`;
        icon = 'mail-check';
    } else {
        title = 'Enter 6-digit code';
        subtitle = `Code sent to <span class="font-medium font-mono">${maskContact(userData.email)}</span>`;
        icon = method === 'sms' ? 'smartphone' : 'mail';
    }
    
    if (method === 'magic') {
        return `
            <div class="text-center mb-6">
                <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <i data-lucide="${icon}" class="w-8 h-8 text-primary"></i>
                </div>
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">${title}</h2>
                <p class="text-gray-600 dark:text-gray-400 text-sm">${subtitle}</p>
            </div>
            
            <div class="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 mb-6">
                <div class="flex items-start">
                    <i data-lucide="info" class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3"></i>
                    <div class="text-sm text-blue-700 dark:text-blue-300">
                        <p class="font-medium mb-1">Check your email</p>
                        <p>Click the link sent to you to sign in. If you don't see the email, check your spam folder.</p>
                    </div>
                </div>
            </div>
            
            <div class="text-center">
                <button 
                    id="resend-magic-btn"
                    onclick="resendMagicLink()"
                    disabled
                    class="text-sm text-gray-500 hover:text-primary transition-colors disabled:cursor-not-allowed"
                >
                    <span id="resend-magic-text">Resend (00:60)</span>
                </button>
            </div>
        `;
    } else {
        return getOTPStep();
    }
}

function getSuccessStep() {
    return `
        <div class="text-center">
            <div class="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-success-bounce">
                <svg class="w-10 h-10 text-success success-checkmark animate" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Welcome!</h2>
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-8">Successfully signed in</p>
            
            <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
                <label class="flex items-center justify-between cursor-pointer">
                    <div class="text-left">
                        <span class="text-sm font-medium text-gray-900 dark:text-white">Remember this device</span>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">No password needed for the next 30 days</p>
                    </div>
                    <div class="relative">
                        <input type="checkbox" id="remember-device" class="sr-only">
                        <div class="w-11 h-6 bg-gray-300 dark:bg-gray-600 rounded-full shadow-inner transition-colors duration-200 ease-in-out toggle-bg"></div>
                        <div class="absolute w-4 h-4 bg-white rounded-full shadow top-1 left-1 transition-transform duration-200 ease-in-out toggle-dot"></div>
                    </div>
                </label>
            </div>
            
            <button 
                onclick="goToDashboard()"
                class="w-full h-12 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 focus-ring"
            >
                Go to Dashboard
            </button>
        </div>
    `;
}

// Helper functions
function maskContact(contact) {
    if (!contact) return '***@example.com';
    
    if (contact.includes('@')) {
        const [username, domain] = contact.split('@');
        return `${username.substring(0, 2)}***@${domain}`;
    } else {
        return `***${contact.substring(contact.length - 2)}`;
    }
}

// Validation functions
function validateEmail() {
    const input = document.getElementById('email-input');
    const error = document.getElementById('email-error');
    const continueBtn = document.getElementById('continue-btn');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^09\d{9}$/;
    
    const isValid = emailRegex.test(input.value) || phoneRegex.test(input.value);
    
    if (input.value.length > 0 && !isValid) {
        error.textContent = 'Invalid email or mobile number format.';
        error.classList.remove('hidden');
        input.classList.add('border-destructive');
    } else {
        error.classList.add('hidden');
        input.classList.remove('border-destructive');
    }
    
    continueBtn.disabled = !isValid;
}

function validatePassword() {
    const input = document.getElementById('password-input');
    const error = document.getElementById('password-error');
    const loginBtn = document.getElementById('login-btn');
    
    const isValid = input.value.length >= 1;
    
    if (input.value.length > 0 && input.value.length < 8) {
        error.textContent = 'Password must be at least 8 characters.';
        error.classList.remove('hidden');
        input.classList.add('border-destructive');
    } else {
        error.classList.add('hidden');
        input.classList.remove('border-destructive');
    }
    
    loginBtn.disabled = !isValid;
}

// Action functions
function continueFromEmail() {
    const emailInput = document.getElementById('email-input');
    userData.email = emailInput.value;
    
    showButtonLoading('continue-btn', 'Checking...');
    
    setTimeout(() => {
        hideButtonLoading('continue-btn', 'Continue');
        currentStep++;
        updateStepper();
        renderStep();
    }, 1500);
}

function continueFromPassword() {
    const passwordInput = document.getElementById('password-input');
    
    if (Math.random() < 0.3) {
        showPasswordError();
        return;
    }
    
    showButtonLoading('login-btn', 'Signing in...');
    
    setTimeout(() => {
        hideButtonLoading('login-btn', 'Login');
        currentStep++;
        updateStepper();
        renderStep();
        
        if (currentFlow === 1) {
            startResendTimer();
        }
    }, 1500);
}

function selectMethod(method) {
    userData.method = method;
    
    if (method === 'magic') {
        startResendTimer(60);
    } else {
        startResendTimer(30);
    }
    
    currentStep++;
    updateStepper();
    renderStep();
}

function socialLogin(provider) {
    if (Math.random() < 0.3) {
        alert(`Error signing in with ${provider}. Please continue with email.`);
        return;
    }
    
    userData.email = `user@${provider}.com`;
    currentStep = maxSteps;
    updateStepper();
    renderStep();
}

function showPasswordError() {
    const form = document.getElementById('step-content');
    const error = document.getElementById('password-error');
    const input = document.getElementById('password-input');
    
    error.textContent = 'Incorrect password.';
    error.classList.remove('hidden');
    input.classList.add('border-destructive');
    
    form.classList.add('animate-shake');
    setTimeout(() => {
        form.classList.remove('animate-shake');
    }, 120);
}

function togglePassword() {
    const input = document.getElementById('password-input');
    const eye = document.getElementById('password-eye');
    
    if (input.type === 'password') {
        input.type = 'text';
        eye.setAttribute('data-lucide', 'eye-off');
    } else {
        input.type = 'password';
        eye.setAttribute('data-lucide', 'eye');
    }
    
    lucide.createIcons();
}

// OTP handling
function handleOTPInput(index) {
    const input = document.getElementById(`otp-${index}`);
    const value = input.value;
    
    if (!/^\d$/.test(value)) {
        input.value = '';
        return;
    }
    
    if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
    }
    
    checkOTPComplete();
}

function handleOTPKeydown(index, event) {
    const input = document.getElementById(`otp-${index}`);
    
    if (event.key === 'Backspace' && !input.value && index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
    }
}

function handleOTPPaste(event) {
    event.preventDefault();
    const paste = event.clipboardData.getData('text');
    const digits = paste.replace(/\D/g, '').substring(0, 6);
    
    for (let i = 0; i < digits.length; i++) {
        const input = document.getElementById(`otp-${i}`);
        if (input) {
            input.value = digits[i];
        }
    }
    
    checkOTPComplete();
}

function checkOTPComplete() {
    let otp = '';
    for (let i = 0; i < 6; i++) {
        const input = document.getElementById(`otp-${i}`);
        otp += input.value;
    }
    
    const verifyBtn = document.getElementById('verify-btn');
    verifyBtn.disabled = otp.length !== 6;
    
    if (otp.length === 6) {
        setTimeout(() => verifyOTP(), 500);
    }
}

function verifyOTP() {
    let otp = '';
    for (let i = 0; i < 6; i++) {
        otp += document.getElementById(`otp-${i}`).value;
    }
    
    if (Math.random() < 0.2) {
        showOTPError();
        return;
    }
    
    showButtonLoading('verify-btn', 'Verifying...');
    
    setTimeout(() => {
        hideButtonLoading('verify-btn', 'Verify Code');
        clearResendTimer();
        currentStep++;
        updateStepper();
        renderStep();
    }, 1500);
}

function showOTPError() {
    const inputs = Array.from({length: 6}, (_, i) => document.getElementById(`otp-${i}`));
    const form = document.getElementById('step-content');
    
    inputs.forEach(input => {
        input.classList.add('border-destructive');
        input.value = '';
    });
    
    inputs[0].focus();
    
    form.classList.add('animate-shake');
    setTimeout(() => {
        form.classList.remove('animate-shake');
        inputs.forEach(input => input.classList.remove('border-destructive'));
    }, 2000);
}

function startResendTimer(seconds = 30) {
    resendTimer = seconds;
    updateResendButton();
    
    resendInterval = setInterval(() => {
        resendTimer--;
        updateResendButton();
        
        if (resendTimer <= 0) {
            clearResendTimer();
        }
    }, 1000);
}

function updateResendButton() {
    const resendBtn = document.getElementById('resend-btn');
    const resendText = document.getElementById('resend-text');
    const magicBtn = document.getElementById('resend-magic-btn');
    const magicText = document.getElementById('resend-magic-text');
    
    const minutes = Math.floor(resendTimer / 60);
    const seconds = resendTimer % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    if (resendBtn) {
        resendBtn.disabled = resendTimer > 0;
        resendText.textContent = resendTimer > 0 ? `Resend (${timeString})` : 'Resend';
    }
    
    if (magicBtn) {
        magicBtn.disabled = resendTimer > 0;
        magicText.textContent = resendTimer > 0 ? `Resend (${timeString})` : 'Resend';
    }
}

function clearResendTimer() {
    if (resendInterval) {
        clearInterval(resendInterval);
        resendInterval = null;
    }
    resendTimer = 0;
}

function resendOTP() {
    startResendTimer();
    alert('New code sent');
}

function resendMagicLink() {
    startResendTimer(60);
    alert('New link sent');
}

function goToDashboard() {
    alert('Login successful! Redirecting to dashboard...');
    setTimeout(() => {
        resetForm();
        document.getElementById('login-container').classList.add('hidden');
        document.getElementById('flow-selection').classList.remove('hidden');
    }, 2000);
}

// Loading state helpers
function showButtonLoading(buttonId, text) {
    const button = document.getElementById(buttonId);
    const textElement = button.querySelector('.btn-text');
    
    button.disabled = true;
    button.classList.add('btn-loading');
    textElement.textContent = text;
}

function hideButtonLoading(buttonId, text) {
    const button = document.getElementById(buttonId);
    const textElement = button.querySelector('.btn-text');
    
    button.disabled = false;
    button.classList.remove('btn-loading');
    textElement.textContent = text;
}

// Initialize
lucide.createIcons();
