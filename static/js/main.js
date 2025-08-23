document.addEventListener("DOMContentLoaded", () => {
  console.log("Portfolio site loaded successfully!");

  /* ========================
     Contact Form Handler
  ======================== */
  const form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Thank you for contacting me! I'll get back to you soon.");
      form.reset();
    });
  }

  /* ========================
     Copy Button for Code Blocks
  ======================== */
  document.querySelectorAll("pre code").forEach((codeBlock) => {
    const button = document.createElement("button");
    button.className = "copy-btn";
    button.innerText = "📋";

    button.addEventListener("click", () => {
      navigator.clipboard.writeText(codeBlock.innerText).then(() => {
        button.innerText = "✅";
        setTimeout(() => (button.innerText = "📋"), 1500);
      });
    });

    const pre = codeBlock.parentNode;
    pre.style.position = "relative"; // ensure button positioning
    pre.appendChild(button);
  });

  /* ========================
     Scroll Animation (Timeline Items)
  ======================== */
  const items = document.querySelectorAll(".timeline-item");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.2 }
  );

  items.forEach((item) => observer.observe(item));
});

  // const items = document.querySelectorAll(".timeline-item");

  // const observer = new IntersectionObserver(entries => {
  //   entries.forEach(entry => {
  //     if (entry.isIntersecting) {
  //       entry.target.classList.add("show");
  //     }
  //   });
  // }, { threshold: 0.2 });

  // items.forEach(item => observer.observe(item));



document.addEventListener("DOMContentLoaded", () => {
  const timeline = document.querySelector(".timeline");
  const items = document.querySelectorAll(".timeline-item");
  const progressLine = document.querySelector(".timeline::after"); // pseudo can't be selected directly

  // Instead, create a real progress line element
  const progress = document.createElement("div");
  progress.classList.add("progress-line");
  timeline.appendChild(progress);

  function animateTimeline() {
    let windowHeight = window.innerHeight;
    let timelineTop = timeline.getBoundingClientRect().top;
    let timelineHeight = timeline.offsetHeight;

    // Calculate how far user scrolled into timeline
    let scrollPos = windowHeight - timelineTop;
    let progressHeight = Math.min(scrollPos, timelineHeight);

    progress.style.height = progressHeight + "px";

    // Reveal items when progress passes them
    items.forEach(item => {
      let itemPos = item.getBoundingClientRect().top;
      if (itemPos < windowHeight - 100) {
        item.classList.add("show");
      }
    });
  }

  window.addEventListener("scroll", animateTimeline);
  animateTimeline(); // run on load
});
