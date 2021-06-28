// header animation
Array.from(document.getElementById("header").children).forEach((elem, ind) => {
	setTimeout(() => elem.classList.add("animation"), ind * 250);
});
// map of sections for IntersectionObserver
let sections = {};
// 
let updateByObserver = () => {
	// if home
	if (sections["home"].intersectionRatio > 0.77) {
		// set background
		document.getElementById("home-background").classList.remove("transparent");
		// trigger fade in animation
		sections["home"].target.children["first-name"].classList.add("name-animation");
		// delay fade in animation
		setTimeout(() => sections["home"].target.children["last-name"].classList.add("name-animation"), 500);
			
	}
	console.log(sections["about"].isIntersecting, sections["home"].intersectionRatio);
	// transition to about section
	if (sections["about"].isIntersecting && sections["home"].intersectionRatio < 0.23) {
		document.getElementById("home-background").classList.add("transparent");
	}
	// if contact
	if (sections["contact"].isIntersecting && sections["about"].intersectionRatio < 0.23) {
		document.getElementById("about-background").classList.add("transparent");
	} else {
		document.getElementById("about-background").classList.remove("transparent");
	}

};
// observer callback
let observerCallback = (entries) => {
	console.log(entries[0]);
	sections[entries[0].target.id] = entries[0];
	if (sections["home"] && sections["about"] && sections["contact"]) {
		updateByObserver();
	}
};
let observerOptions = {threshold: [0, 0.2, 0.8, 1]};
// on scroll animation
const homeObserver = new IntersectionObserver(observerCallback, observerOptions);
const aboutObserver = new IntersectionObserver(observerCallback, observerOptions);
const contactObserver = new IntersectionObserver(observerCallback, observerOptions);
homeObserver.observe(document.getElementById("home"));
aboutObserver.observe(document.getElementById("about"));
contactObserver.observe(document.getElementById("contact"));