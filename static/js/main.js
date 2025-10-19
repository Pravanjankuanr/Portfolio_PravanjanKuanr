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
  const pre = codeBlock.parentNode;

  // create a wrapper for pre + button
  const wrapper = document.createElement("div");
  wrapper.className = "pre-wrapper";
  pre.parentNode.insertBefore(wrapper, pre);
  wrapper.appendChild(pre);

  // create copy button outside the scrollable pre
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

  // append button to wrapper, not pre
  wrapper.appendChild(button);
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

  const DOT_RADIUS = 10; // since your ::before dot is 20px

  function animateTimeline() {
    let windowHeight = window.innerHeight;
    let scrollMid = window.scrollY + windowHeight / 2;

    // Timeline bounding box
    let timelineRect = timeline.getBoundingClientRect();
    let timelineTop = window.scrollY + timelineRect.top;

    // Last item (so progress bar doesn't overshoot)
    let lastItem = items[items.length - 1];
    let lastItemRect = lastItem.getBoundingClientRect();
    let lastItemDot =
      window.scrollY +
      lastItemRect.top +
      lastItemRect.height / 2 -
      timelineTop -
      DOT_RADIUS;

    // Progress height
    let progressHeight = 0;
    if (scrollMid > timelineTop) {
      progressHeight = Math.min(scrollMid - timelineTop, lastItemDot);
    }

    progress.style.height = progressHeight + "px";

    // ✅ Trigger items when progress bar bottom reaches their dot
    items.forEach((item) => {
      let itemRect = item.getBoundingClientRect();
      let itemDot =
        window.scrollY +
        itemRect.top +
        itemRect.height / 2 -
        timelineTop;

      if (progressHeight >= itemDot - DOT_RADIUS) {
        item.classList.add("active"); // box appears
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
   MAIN NAVBAR HAMBURGER
======================== */
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-links");

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("open");
    if (navMenu) navMenu.classList.toggle("active");
  });
}


/* ========================
   DOCS FLOATING HAMBURGER
======================== */
const hamburgerBtn = document.getElementById("hamburgerBtn");
const docSidebar = document.getElementById("docSidebar");
const docOverlay = document.querySelector(".sidebar-overlay"); // renamed to avoid confusion

if (hamburgerBtn) {
  hamburgerBtn.addEventListener("click", () => {
    hamburgerBtn.classList.toggle("active");
    if (docSidebar && docOverlay) {
      docSidebar.classList.toggle("active");
      docOverlay.classList.toggle("show");
    }
  });
}

// Close sidebar when clicking docs overlay
if (docOverlay) {
  docOverlay.addEventListener("click", () => {
    if (docSidebar) docSidebar.classList.remove("active");
    docOverlay.classList.remove("show");
    hamburgerBtn.classList.remove("active");
  });
}


/* ========================
   Open Tutorial Popup
======================== */
const openTutorialBtns = document.querySelectorAll(".open-tutorial-btn");
openTutorialBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault(); // prevent page reload or navigation
    const modal = document.createElement("div");
    modal.className = "popup-overlay";
    modal.innerHTML = `
      <div class="popup-box">
        <button class="popup-close">&times;</button>
        <h2>Working in progress</h2>
        <p>It will be available soon!</p>
      </div>
    `;
    document.body.appendChild(modal);
    const closePopup = () => modal.remove();
    modal.querySelector(".popup-close").addEventListener("click", closePopup);
    modal.querySelector(".popup-ok").addEventListener("click", closePopup);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closePopup();
    });
    document.addEventListener("keydown", function escClose(e) {
      if (e.key === "Escape") {
        closePopup();
        document.removeEventListener("keydown", escClose);
      }
    });
  });
});

}); // End Line