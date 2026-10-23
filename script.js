// 1. Put the current year in the footer so you never have to update it.
document.getElementById("year").textContent = new Date().getFullYear();

// 2. "Copy email" button: copies the email address shown on the page.
const copyButton = document.getElementById("copy-email");
const emailLink = document.getElementById("email-link");
let resetTimer;

copyButton.addEventListener("click", async () => {
  const email = emailLink.textContent.trim();
  try {
    await navigator.clipboard.writeText(email);
    copyButton.textContent = "Copied";
  } catch (error) {
    // Clipboard can fail on some browsers or non-secure pages.
    copyButton.textContent = "Copy failed";
  }
  clearTimeout(resetTimer);
  resetTimer = setTimeout(() => { copyButton.textContent = "Copy email"; }, 2000);
});

// 3. Highlight the nav link for the section currently on screen.
const navLinks = document.querySelectorAll("nav a");
const sections = [...navLinks]
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const active = link.getAttribute("href") === "#" + entry.target.id;
          if (active) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((section) => observer.observe(section));
}
