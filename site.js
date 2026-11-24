import { mountRing } from "./ring.js";
import { traces } from "./traces.js";

mountRing(document.querySelector("#ring"), document.querySelector("#playback"), document.querySelector("#replay"));

const example = document.querySelector("#example");
const input = document.querySelector("#trace-input");
const verdict = document.querySelector("#trace-verdict");
const output = document.querySelector("#trace-output");
const steps = [...document.querySelectorAll("[data-step]")];
const explanations = [
  "The lexer recognizes the Markdown tokens.",
  "The stack confirms the formatting closes in the right order.",
  "The resolver checks reference links and emits HTML.",
];
let currentStep = 0;

function renderTrace() {
  const sample = traces[example.value];
  const step = sample.steps[currentStep];
  input.textContent = sample.markdown;
  for (const button of steps) {
    button.setAttribute("aria-pressed", String(Number(button.dataset.step) === currentStep));
  }

  if (!step) {
    verdict.dataset.state = "skipped";
    verdict.textContent = "Skipped";
    output.textContent = "The pipeline stopped when the previous stage rejected the input.";
    return;
  }
  verdict.dataset.state = step.accepted ? "accepted" : "rejected";
  verdict.textContent = step.accepted ? "Accepted" : "Rejected";
  output.textContent = step.accepted
    ? currentStep === 2 ? sample.html : explanations[currentStep]
    : step.reason;
}

for (const button of steps) {
  button.disabled = false;
  button.addEventListener("click", () => {
    currentStep = Number(button.dataset.step);
    renderTrace();
  });
}
example.disabled = false;
example.addEventListener("change", () => {
  currentStep = 0;
  renderTrace();
});
renderTrace();

const copy = document.querySelector("#copy");
const email = document.querySelector("#email");
const copyStatus = document.querySelector("#copy-status");
let copyTimer;
if (navigator.clipboard?.writeText) {
  copy.hidden = false;
  copy.addEventListener("click", async () => {
    clearTimeout(copyTimer);
    try {
      await navigator.clipboard.writeText(email.textContent.trim());
      copy.textContent = "Copied";
      copyStatus.textContent = "Email address copied.";
    } catch {
      copy.textContent = "Copy unavailable";
      copyStatus.textContent = "Could not copy the address. Use the email link to get in touch.";
    }
    copyTimer = setTimeout(() => {
      copy.textContent = "Copy email";
      copyStatus.textContent = "";
    }, 2600);
  });
}
document.querySelector("#year").textContent = new Date().getFullYear();
