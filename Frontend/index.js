document.addEventListener("DOMContentLoaded", () => {
    console.log("Welcome to the Smart Expense Tracker!");

    // Example: Handle smooth scroll for "Learn More" button
    const learnMoreButton = document.querySelector(".cta-buttons button:nth-child(2)");
    learnMoreButton.addEventListener("click", (event) => {
        event.preventDefault();
        document.querySelector("#features").scrollIntoView({ behavior: "smooth" });
    });

    // Placeholder for adding dynamic content like testimonials or features from a database
    console.log("Dynamic functionality can be implemented here!");
});
