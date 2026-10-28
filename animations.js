const header = document.querySelector("body > header");
const sections = Array.from(document.querySelectorAll("main > section"));
const navLinks = Array.from(document.querySelectorAll("#header a[href]"));
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// PCB artwork moves only in response to scrolling.
const pcbLayer = document.querySelector(".pcb-layer");
const updateBackdrop = () => {
  const scroll = reducedMotion.matches ? 0 : Math.max(0, window.scrollY);
  // A full tile wraps seamlessly, keeping transforms bounded on long pages.
  pcbLayer.style.transform = `translate3d(0, -${(scroll * 0.12) % 640}px, 0)`;
};
reducedMotion.addEventListener("change", updateBackdrop);

// Keep anchor targets below the sticky header at every screen size.
const sizeHeader = () => {
  document.documentElement.style.setProperty(
    "--header-height",
    `${header.getBoundingClientRect().height}px`
  );
};
sizeHeader();
if ("ResizeObserver" in window) {
  new ResizeObserver(sizeHeader).observe(header);
} else {
  window.addEventListener("resize", sizeHeader);
}

navLinks.forEach((link, index) => {
  link.style.transitionDelay = reducedMotion.matches
    ? "0ms"
    : `${index * 100}ms`;
  requestAnimationFrame(() => link.classList.add("animation"));
});

// Native hash links handle smooth scrolling, deep links, and browser history.
// Scrolling updates the active link without adding browser-history entries.
let activeSection;
let scrollFrame;
const updateActiveSection = () => {
  scrollFrame = null;
  updateBackdrop();
  const headerHeight = header.getBoundingClientRect().height;
  const activationLine =
    headerHeight + (window.innerHeight - headerHeight) * 0.3;
  let active = sections[0];
  sections.forEach((section) => {
    if (section.getBoundingClientRect().top <= activationLine) active = section;
  });
  if (active === activeSection) return;
  activeSection = active;
  sections.forEach((section) => {
    document.body.classList.toggle(
      `${section.id}-background`,
      section === active
    );
  });
  navLinks.forEach((link) => {
    if (link.hash === `#${active.id}`)
      link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
};
const scheduleUpdate = () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateActiveSection);
};
window.addEventListener("scroll", scheduleUpdate, { passive: true });
window.addEventListener("resize", scheduleUpdate);
window.addEventListener("load", scheduleUpdate);
updateActiveSection();

// Reveal each item when it enters the viewport, including individual projects.
// Keep revealed content visible when scrolling back or following a deep link.
const revealGroups = [
  ["#first-name, #last-name, #profile-img, #home-summary", "opacity-animation"],
  [".projects-arrow", "opacity-animation"],
  [
    "#about-section-title, #projects-section-title, #contact-section-title",
    "opacity-animation",
  ],
  ["#bio-list > *, #contacts-list > *", "list-animation"],
  [".project", "opacity-animation"],
];
const revealClasses = new Map();
revealGroups.forEach(([selector, className]) => {
  document.querySelectorAll(selector).forEach((element, index) => {
    revealClasses.set(element, className);
    element.style.setProperty("--reveal-delay", `${Math.min(index, 3) * 80}ms`);
  });
});
const reveal = (element) => {
  element.classList.add(revealClasses.get(element), "scroll-visible");
};
if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0, rootMargin: "0px 0px -5% 0px" }
  );
  document.documentElement.classList.add("scroll-animations");
  revealClasses.forEach((_, element) => {
    element.classList.add("scroll-reveal");
    observer.observe(element);
  });
  // Keyboard navigation should never land on an invisible element.
  document.addEventListener("focusin", (event) => {
    const element = event.target.closest(".scroll-reveal");
    if (element) {
      reveal(element);
      observer.unobserve(element);
    }
  });
  reducedMotion.addEventListener("change", () => {
    if (!reducedMotion.matches) return;
    revealClasses.forEach((_, element) => reveal(element));
    observer.disconnect();
  });
} else {
  revealClasses.forEach((_, element) => reveal(element));
}
