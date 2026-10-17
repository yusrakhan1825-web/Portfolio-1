
"use strict";

// ==================================
// 1. MOBILE NAVIGATION
// ==================================

const menuToggle = document.querySelector("#menuToggle");
const navLinks = document.querySelector("#navLinks");

menuToggle.addEventListener("click", function () {
    navLinks.classList.toggle("active");

    const isOpen = navLinks.classList.contains("active");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
    );

    menuToggle.textContent = isOpen ? "✕" : "☰";
});

// Close the mobile menu after clicking a link
const navigationLinks = document.querySelectorAll(".nav-links a");

navigationLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        navLinks.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        menuToggle.textContent = "☰";
    });
});


// ==================================
// 2. DARK / LIGHT MODE
// ==================================

const themeToggle = document.querySelector("#themeToggle");
const body = document.body;

function applyTheme(theme) {
    const isLight = theme === "light";

    body.classList.toggle("light-theme", isLight);

    themeToggle.textContent = isLight ? "☾" : "☀";

    themeToggle.setAttribute(
        "aria-label",
        isLight ? "Switch to dark mode" : "Switch to light mode"
    );
}

// Load the previously selected theme
let savedTheme = "dark";

try {
    savedTheme = localStorage.getItem("portfolio-theme") || "dark";
} catch (error) {
    // Theme switching still works if storage is unavailable.
}

applyTheme(savedTheme);

themeToggle.addEventListener("click", function () {
    const newTheme = body.classList.contains("light-theme")
        ? "dark"
        : "light";

    applyTheme(newTheme);

    try {
        localStorage.setItem("portfolio-theme", newTheme);
    } catch (error) {
        // The theme remains active for this page session.
    }
});


// ==================================
// 3. SCROLL REVEAL ANIMATIONS
// ==================================

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
        function (entries, currentObserver) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    currentObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach(function (element) {
        observer.observe(element);
    });
} else {
    // Fallback for older browsers
    revealElements.forEach(function (element) {
        element.classList.add("visible");
    });
}


// ==================================
// 4. AUTOMATIC FOOTER YEAR
// ==================================

document.querySelector("#year").textContent =
    new Date().getFullYear();


// ==================================
// 5. EMAILJS CONFIGURATION
// ==================================

// Create an account at https://www.emailjs.com/
// Create an email service and an email template.
// Replace these three placeholder values with your own IDs.

const EMAILJS_PUBLIC_KEY = "JmGzgGrGm2nD6pBDe";
const EMAILJS_SERVICE_ID = "service_fz2ksbp";
const EMAILJS_TEMPLATE_ID = "template_3as0v1v";
const EMAILJS_REPLY_TEMPLATE_ID = "template_3w03q56";

const emailIsConfigured =
    typeof emailjs !== "undefined" &&
    EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY" &&
    EMAILJS_SERVICE_ID !== "YOUR_SERVICE_ID" &&
    EMAILJS_TEMPLATE_ID !== "YOUR_TEMPLATE_ID";
     EMAILJS_REPLY_TEMPLATE_ID !== "YOUR_REPLY_TEMPLATE_ID";

if (emailIsConfigured) {
    emailjs.init({
        publicKey: EMAILJS_PUBLIC_KEY
    });
}



// ==================================
// 6. CONTACT FORM
// ==================================

const contactForm = document.querySelector("#contactForm");
const formStatus = document.querySelector("#formStatus");
const submitBtn = document.querySelector("#submitBtn");

function showFormStatus(message, type) {
    formStatus.textContent = message;
    formStatus.className = "form-status " + type;
}

contactForm.addEventListener("submit", async function (event) {
    // Stop the browser from reloading the page
    event.preventDefault();

    // Check built-in HTML form validation
    if (!contactForm.reportValidity()) {
        return;
    }

    // Read values from the form
    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const subject = document.querySelector("#subject").value.trim();
    const message = document.querySelector("#message").value.trim();

    if (!name || !email || !subject || !message) {
        showFormStatus(
            "Please complete all fields before sending.",
            "error"
        );
        return;
    }

    // Do not pretend a message was sent if EmailJS isn't configured.
    if (!emailIsConfigured) {
        showFormStatus(
            "Email is not configured yet. Add your EmailJS IDs in app.js.",
            "error"
        );
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    showFormStatus("Sending your message...", "");

    try {
        // These names must match your EmailJS template variables.
        const templateParams = {
            from_name: name,
            from_email: email,
            subject: subject,
            message: message,
            reply_to: email
        };

        // Send the form through EmailJS
        await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams
        );
        await emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_REPLY_TEMPLATE_ID,
    {
        to_email: email,
        to_name: name
    }
);

        showFormStatus(
            "Your message was sent successfully. Thank you!",
            "success"
        );

        contactForm.reset();

    } catch (error) {
        console.error("Email sending failed:", error);

        showFormStatus(
            "Sorry, your message could not be sent. Please try again.",
            "error"
        );

    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message <span>↗</span>';
    }
});
