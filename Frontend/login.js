document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!email || !password) {
            alert("Please fill in all fields!");
            return;
        }

        console.log("Login successful:");
        console.log(`Email: ${email}`);

        alert("Login successful!");
        window.location.href = "dashboard.html"; // Redirect to the dashboard
    });

    const socialButtons = document.querySelectorAll(".social-btn");
    socialButtons.forEach((button) => {
        button.addEventListener("click", () => {
            alert(`Social media login with ${button.textContent.trim()} is currently under development.`);
        });
    });
});
