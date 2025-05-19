
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".carousel-container").forEach(container => {
    const track = container.querySelector(".carousel-track");
    const leftBtn = container.querySelector(".carousel-btn.left");
    const rightBtn = container.querySelector(".carousel-btn.right");

    if (!track || !leftBtn || !rightBtn) return;

    leftBtn.addEventListener("click", () => {
      const scrollAmount = track.clientWidth * 0.8;
      if (track.scrollLeft <= 0) {
        track.scrollLeft = track.scrollWidth;
      } else {
        track.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    });

    rightBtn.addEventListener("click", () => {
      const scrollAmount = track.clientWidth * 0.8;
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 5) {
        track.scrollLeft = 0;
      } else {
        track.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    });
  });
});
