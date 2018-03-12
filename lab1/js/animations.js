// *** setup ***

const defaultScrollDuration = 225; //ms
const defaultScrollOffset = 0; //px
zenscroll.setup(defaultScrollDuration, defaultScrollOffset);


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
    }, 385);
    zenscroll.to(resultsSection);
});

// mouse devices - additional hover effects
seeResultsBtn.addEventListener('mouseenter', () => {
    seeResultsBtn.classList.add('is-active');
});
seeResultsBtn.addEventListener('mouseleave', () => {
    seeResultsBtn.classList.remove('is-active');
});
