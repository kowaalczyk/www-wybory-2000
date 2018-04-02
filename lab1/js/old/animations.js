// *** setup ***
const animationSettings = {
    longTime: 385,
    standardTime: 225,
    shortTime: 185,
    scrollOffset: 0
};

zenscroll.setup(animationSettings.standardTime, animationSettings.scrollOffset);


// *** hamburger menu animations ***

let hamburgerMenuBtn = document.getElementById('hamburger-menu-btn');

hamburgerMenuBtn.addEventListener('click', () => {
    hamburgerMenuBtn.classList.toggle('is-active');
});


// *** action button and scrolling animations ***

let seeResultsBtn = document.getElementById('see-results-btn');
let resultsSection = document.getElementById('wyniki');

// mouse and touch devices
seeResultsBtn.addEventListener('mousedown', () => {
    seeResultsBtn.classList.add('is-active');

});
seeResultsBtn.addEventListener('mouseup', (e) => {
    e.preventDefault();
    setTimeout(() => {
        seeResultsBtn.classList.remove('is-active');
    }, animationSettings.longTime);
    zenscroll.to(resultsSection);
});

// mouse devices - additional hover effects
seeResultsBtn.addEventListener('mouseenter', () => {
    seeResultsBtn.classList.add('is-active');
});
seeResultsBtn.addEventListener('mouseleave', () => {
    seeResultsBtn.classList.remove('is-active');
});
