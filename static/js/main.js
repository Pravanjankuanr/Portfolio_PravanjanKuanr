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

// copy button
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("pre code").forEach((codeBlock) => {
    const button = document.createElement("button");
    button.className = "copy-btn";
    button.innerText = "📋";

    button.addEventListener("click", () => {
      navigator.clipboard.writeText(codeBlock.innerText).then(() => {
        button.innerText = "✅";
        setTimeout(() => button.innerText = "📋", 1500);
      });
    });

    const pre = codeBlock.parentNode;
    pre.style.position = "relative"; // ensure positioning works
    pre.appendChild(button);
  });
});