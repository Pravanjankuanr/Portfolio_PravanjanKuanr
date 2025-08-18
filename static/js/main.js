document.addEventListener("DOMContentLoaded", () => {
  console.log("Portfolio site loaded successfully!");

  // Simple form handler
  const form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Thank you for contacting me! I'll get back to you soon.");
      form.reset();
    });
  }
});