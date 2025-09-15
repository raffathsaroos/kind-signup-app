// ===== Signup Form =====
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const messageElement = document.getElementById('message');

        try {
            const response = await fetch('http://localhost:3000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                messageElement.textContent = `User ${data.username} signed up successfully!`;
                messageElement.style.color = 'green';
            } else {
                messageElement.textContent = 'Signup failed. Please try again.';
                messageElement.style.color = 'red';
            }
        } catch (error) {
            messageElement.textContent = 'An error occurred. Check your network connection.';
            messageElement.style.color = 'red';
            console.error('Error:', error);
        }
        messageElement.classList.remove('hidden');
    });
}

// ===== Signin Form =====
const signinForm = document.getElementById('signin-form');
if (signinForm) {
    signinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const messageElement = document.getElementById('message');

        try {
            const response = await fetch('http://localhost:3000/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                // Redirect to dashboard if login successful
                window.location.href = 'dashboard.html';
            } else {
                messageElement.textContent = 'Invalid credentials';
                messageElement.style.color = 'red';
                messageElement.classList.remove('hidden');
            }
        } catch (error) {
            messageElement.textContent = 'Network error';
            messageElement.style.color = 'red';
            messageElement.classList.remove('hidden');
            console.error('Error:', error);
        }
    });
}
