/*===============================
DOM Ready
===============================*/

document.addEventListener("DOMContentLoaded", () => {
  console.log("Portfolio site loaded successfully!");

  /* ========================
     Contact Form Submission
  ======================== */
  const form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const btn = form.querySelector("button[type=submit]");
      btn.disabled = true;
      btn.innerText = "⏳ Sending...";

      fetch("/contact", {
        method: "POST",
        body: new FormData(form),
      })
        .then((res) => res.text())
        .then(() => {
          alert("✅ Thank you for contacting me! I'll get back to you soon.");
          form.reset();
          btn.disabled = false;
          btn.innerText = "Submit";
        })
        .catch(() => {
          alert("❌ Something went wrong. Please try again.");
          btn.disabled = false;
          btn.innerText = "Submit";
        });
    });
  }

  /* ========================
     Copy Button for Code Blocks
  ======================== */
  document.querySelectorAll("pre code").forEach((codeBlock) => {
    const button = document.createElement("button");
    button.className = "copy-btn";
    button.innerHTML = '<i class="fa-solid fa-copy"></i>';

    button.addEventListener("click", () => {
      navigator.clipboard.writeText(codeBlock.innerText).then(() => {
        button.innerHTML = '<span class="copied-text">Copied!</span>';
        setTimeout(() => {
          button.innerHTML = '<i class="fa-solid fa-copy"></i>';
        }, 1500);
      });
    });

    const pre = codeBlock.parentNode;
    pre.style.position = "relative";
    pre.appendChild(button);
  });

  /* ========================
     Progress Bar Home Page
  ======================== */
  const timeline = document.querySelector(".timeline");
  if (timeline) {
    const items = document.querySelectorAll(".timeline-item");
    const progress = document.createElement("div");
    progress.classList.add("progress-line");
    timeline.appendChild(progress);

    function animateTimeline() {
      let windowHeight = window.innerHeight;
      let timelineTop = timeline.offsetTop;
      let scrollMid = window.scrollY + windowHeight / 2;

      let lastItem = items[items.length - 1];
      let maxProgress = lastItem.offsetTop;

      let progressHeight = 0;
      if (scrollMid > timelineTop) {
        progressHeight = Math.min(scrollMid - timelineTop, maxProgress);
      }

      progress.style.height = progressHeight + "px";

      items.forEach((item) => {
        let itemDotY = item.offsetTop;
        if (progressHeight >= itemDotY) {
          item.classList.add("active");
        } else {
          item.classList.remove("active");
        }
      });
    }

    window.addEventListener("scroll", animateTimeline);
    animateTimeline();
  }

  /* ========================
     Scroll Spy (Sidebar Doc Content)
  ======================== */
  const sections = document.querySelectorAll("article[id]");
  const sidebarLinks = document.querySelectorAll(".sidebar a");

  function activateLink() {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    sidebarLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", activateLink);

  /* ========================
     Smooth Scroll (Sidebar Doc Content)
  ======================== */
  sidebarLinks.forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });

  /* ========================
     Hamburger Menu
  ======================== */
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-links");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("open");
      navMenu.classList.toggle("active");
    });
  }

}); // End Line