document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("register-form");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const fullName = document.getElementById("full-name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirm-password").value.trim();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        console.log("Registration successful:");
        console.log(`Full Name: ${fullName}`);
        console.log(`Email: ${email}`);

        alert("Registration successful! Please log in.");
        form.reset();
        window.location.href = "login.html";
    });

    const socialButtons = document.querySelectorAll(".social-btn");
    socialButtons.forEach((button) => {
        button.addEventListener("click", () => {
            alert(`Social media registration with ${button.textContent.trim()} is currently under development.`);
        });
    });
});
