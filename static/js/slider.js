const BUTTONS = document.getElementsByClassName("button");
const SLIDES = document.getElementById("portfolio").getElementsByClassName("item");
let WIDTH  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
let slideIndex = 1;

const handleWidth = () => {
    WIDTH  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    handleSlides();
}

const changeAllSlides = (displaySetting) => {
    for (let i = 0; i < SLIDES.length; i++) {
        SLIDES[i].style.display = displaySetting;
    }
}

const changeCarouselButtons = (displaySetting) => {
    for (let i = 0; i < BUTTONS.length; i++) {
        BUTTONS[i].style.display = displaySetting;
    }
}

const changeSlide = (n) => {
    showSlide(slideIndex += n);
};

const showSlide = (n) => {
    if (n > SLIDES.length) slideIndex = 1;
    if (n < 1) slideIndex = SLIDES.length;
    changeAllSlides("none");
    SLIDES[slideIndex-1].style.display = "block";
}

const handleSlides = () => {
    if (WIDTH <= 414) {
        changeCarouselButtons("block");
        showSlide(slideIndex);
    } else {
        changeAllSlides("block");
        changeCarouselButtons("none");
    }
}

window.onresize = handleWidth;
handleSlides();
