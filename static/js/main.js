/*===============================
DOM Ready
===============================*/
document.addEventListener("DOMContentLoaded", () => {
  console.log("Portfolio site loaded successfully!");

  /* ================================
     Contact Form Submission
  ================================ */
  const form = document.querySelector(".contact-form");
  const toast = document.getElementById("toast");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector("button[type=submit]");
      btn.disabled = true;
      btn.style.opacity = "0.6";

      fetch("/contact", { method: "POST", body: new FormData(form) })
        .then((res) => res.text())
        .then(() => {
          showToast("✅ Message sent successfully!", "#0A8A46");
          form.reset();
        })
        .catch(() => showToast("❌ Something went wrong!", "#B80000"))
        .finally(() => {
          btn.disabled = false;
          btn.style.opacity = "1";
        });
    });
  }

  function showToast(message, bgColor) {
    toast.textContent = message;
    toast.style.background = bgColor;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3500);
  }

  /* ================================
     Copy Button for Code Blocks
  ================================ */
  document.querySelectorAll("pre code").forEach((codeBlock) => {
    const pre = codeBlock.parentNode;
    const wrapper = document.createElement("div");
    wrapper.className = "pre-wrapper";
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const button = document.createElement("button");
    button.className = "copy-btn";
    button.innerHTML = '<i class="fa-solid fa-copy"></i>';

    button.addEventListener("click", () => {
      navigator.clipboard.writeText(codeBlock.innerText).then(() => {
        button.innerHTML = '<span class="copied-text">Copied!</span>';
        setTimeout(() => (button.innerHTML = '<i class="fa-solid fa-copy"></i>'), 1500);
      });
    });

    wrapper.appendChild(button);
  });

  /* ================================
     Timeline Progress Bar
  ================================ */
  const timeline = document.querySelector(".timeline");
  if (timeline) {
    const items = document.querySelectorAll(".timeline-item");
    const progress = document.createElement("div");
    progress.classList.add("progress-line");
    timeline.appendChild(progress);

    const DOT_RADIUS = 10;

    function animateTimeline() {
      const windowMid = window.scrollY + window.innerHeight / 2;
      const timelineRect = timeline.getBoundingClientRect();
      const timelineTop = window.scrollY + timelineRect.top;

      const lastItem = items[items.length - 1];
      const lastItemRect = lastItem.getBoundingClientRect();
      const lastItemDot =
        window.scrollY + lastItemRect.top + lastItemRect.height / 2 - timelineTop - DOT_RADIUS;

      const progressHeight = windowMid > timelineTop ? Math.min(windowMid - timelineTop, lastItemDot) : 0;
      progress.style.height = progressHeight + "px";

      items.forEach((item) => {
        const itemRect = item.getBoundingClientRect();
        const itemDot = window.scrollY + itemRect.top + itemRect.height / 2 - timelineTop;
        item.classList.toggle("active", progressHeight >= itemDot - DOT_RADIUS);
      });
    }

    window.addEventListener("scroll", animateTimeline);
    animateTimeline();
  }

  /* ================================
     Scroll Spy & Smooth Scroll
  ================================ */
  const sections = document.querySelectorAll("article[id]");
  const sidebarLinks = document.querySelectorAll(".sidebar a");

  function activateLink() {
    let current = "";
    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 100) current = section.id;
    });

    sidebarLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === "#" + current));
  }

  window.addEventListener("scroll", activateLink);

  sidebarLinks.forEach((anchor) =>
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute("href"));
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    })
  );

  /* ================================
     Navbar Hamburger
  ================================ */
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-links");

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("open");
      navMenu?.classList.toggle("active");
    });
  }

  /* ================================
     Docs Sidebar Hamburger
  ================================ */
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const docSidebar = document.getElementById("docSidebar");
  const docOverlay = document.querySelector(".sidebar-overlay");

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener("click", () => {
      hamburgerBtn.classList.toggle("active");
      docSidebar?.classList.toggle("active");
      docOverlay?.classList.toggle("show");
    });
  }

  docOverlay?.addEventListener("click", () => {
    docSidebar?.classList.remove("active");
    docOverlay.classList.remove("show");
    hamburgerBtn?.classList.remove("active");
  });

  /* ================================
     Tutorial Popup
  ================================ */
  document.querySelectorAll(".open-tutorial-btn").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.preventDefault();
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
      modal.addEventListener("click", (e) => e.target === modal && closePopup());
      document.addEventListener(
        "keydown",
        function escClose(e) {
          if (e.key === "Escape") {
            closePopup();
            document.removeEventListener("keydown", escClose);
          }
        }
      );
    })
  );

  /* ================================
     Dark / Light Mode Toggle
  ================================ */
  const toggleSwitch = document.getElementById("theme-toggle");

  // Apply saved theme
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    toggleSwitch.checked = true;
  }

  toggleSwitch.addEventListener("change", () => {
    const isDark = toggleSwitch.checked;
    document.body.classList.toggle("dark-mode", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
});