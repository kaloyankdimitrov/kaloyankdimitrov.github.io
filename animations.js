// header animation
Array.from(document.getElementById("header").children).forEach((elem, ind) => {
	setTimeout(() => elem.classList.add("animation"), ind * 250);
});
// map of sections for IntersectionObserver
let isIntersecting = {};
// on scroll animation
const observer = new IntersectionObserver((entries) => {
	const body = document.getElementsByTagName("body")[0];
	entries.forEach((entry) => {
		isIntersecting[entry.target.id] = entry.isIntersecting;
	});
	// if home
	if (isIntersecting["home"]) {
		// set background
		body.className = "home-background";
		// trigger fade in animation
		document.getElementById("home").children["first-name"].classList.add("opacity-animation");
		// delay fade in animation
		setTimeout(() => document.getElementById("home").children["last-name"].classList.add("opacity-animation"), 500);
		setTimeout(() => { 
			Array.from(document.getElementsByClassName("qualifications")).forEach((wrapper) => {
				Array.from(wrapper.getElementsByTagName("h3")).forEach((element, ind) => setTimeout(() => element.classList.add("opacity-animation"), ind * 100))
			});
		}, 1000);
	} else {
		// reset all animations
		document.getElementById("home").children["first-name"].classList.remove("opacity-animation");
		document.getElementById("home").children["last-name"].classList.remove("opacity-animation");
		Array.from(document.getElementsByClassName("qualifications")).forEach((wrapper) => {
			Array.from(wrapper.getElementsByTagName("h3")).forEach((element) => element.classList.remove("opacity-animation"))
		});
	}
	// if about
	if (!isIntersecting["home"] && isIntersecting["about"]) {
		body.className = "about-background";
	}
	// if contact
	if (!isIntersecting["about"] && isIntersecting["contact"]) {
		body.className = "contact-background";
	}

});
observer.observe(document.getElementById("home"));
observer.observe(document.getElementById("about"));
observer.observe(document.getElementById("contact"));