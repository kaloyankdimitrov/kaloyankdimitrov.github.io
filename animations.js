// header animation
Array.from(document.getElementById("header").children).forEach((elem, ind) => {
	setTimeout(() => elem.classList.add("animation"), ind * 250);
});
// map of sections for IntersectionObserver
let sections = {};
let observerOptions = {threshold: [0, 0.2, 0.8, 1]};
// on scroll animation
const observer = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		sections[entry.target.id] = entry;
	});
	// transition to home
	if (sections["home"].isIntersecting && sections["about"].intersectionRatio < 0.23) {
		// set background
		document.getElementById("home-background").classList.remove("transparent");
		// trigger fade in animation
		sections["home"].target.children["first-name"].classList.add("opacity-animation");
		// delay fade in animation
		setTimeout(() => sections["home"].target.children["last-name"].classList.add("opacity-animation"), 500);
		setTimeout(() => { 
			Array.from(document.getElementsByClassName("qualifications")).forEach((wrapper) => {
				Array.from(wrapper.getElementsByTagName("h3")).forEach((element, ind) => setTimeout(() => element.classList.add("opacity-animation"), ind * 100))
			});
		}, 1000);
	}
	// transition to about section
	if (sections["home"].intersectionRatio < 0.23) {
		document.getElementById("home-background").classList.add("transparent");
	}
	// transition to contact
	if (sections["contact"].isIntersecting && sections["about"].intersectionRatio < 0.23) {
		document.getElementById("about-background").classList.add("transparent");
	} else {
		document.getElementById("about-background").classList.remove("transparent");
	}

}, observerOptions);
observer.observe(document.getElementById("home"));
observer.observe(document.getElementById("about"));
observer.observe(document.getElementById("contact"));