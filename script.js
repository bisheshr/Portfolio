// 1. Put the current year in the footer so you never have to update it.
document.getElementById("year").textContent = new Date().getFullYear();

// 2. "Copy email" button: copies the email address shown on the page.
const copyButton = document.getElementById("copy-email");
const emailLink = document.getElementById("email-link");

copyButton.addEventListener("click", async () => {
  const email = emailLink.textContent.trim();
  try {
    await navigator.clipboard.writeText(email);
    copyButton.textContent = "Copied";
  } catch (error) {
    // Clipboard can fail on some browsers or non-secure pages.
    copyButton.textContent = "Copy failed";
  }
  // Reset the label after 2 seconds.
  setTimeout(() => { copyButton.textContent = "Copy email"; }, 2000);
});

