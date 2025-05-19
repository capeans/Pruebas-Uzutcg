
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".carousel-container").forEach(container => {
    const track = container.querySelector(".carousel-track");
    const left = container.querySelector(".carousel-btn.left");
    const right = container.querySelector(".carousel-btn.right");

    let scrollStep = 300;

    left?.addEventListener("click", () => {
      if (track.scrollLeft <= 0) {
        track.scrollLeft = track.scrollWidth;
      } else {
        track.scrollBy({ left: -scrollStep, behavior: "smooth" });
      }
    });

    right?.addEventListener("click", () => {
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
        track.scrollLeft = 0;
      } else {
        track.scrollBy({ left: scrollStep, behavior: "smooth" });
      }
    });
  });
});
