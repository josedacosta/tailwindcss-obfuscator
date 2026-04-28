// Simple counter functionality
let count = 0;
const countEl = document.getElementById("count");
const incrementBtn = document.getElementById("increment");
const resetBtn = document.getElementById("reset");

incrementBtn.addEventListener("click", () => {
  count++;
  countEl.textContent = count;
});

resetBtn.addEventListener("click", () => {
  count = 0;
  countEl.textContent = count;
});

// Dynamic class manipulation example
document.querySelectorAll(".bg-white").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.classList.add("ring-2", "ring-blue-500");
  });
  card.addEventListener("mouseleave", () => {
    card.classList.remove("ring-2", "ring-blue-500");
  });
});

console.log("Static HTML app loaded with Tailwind classes!");
