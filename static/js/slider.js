const BUTTONS = document.getElementsByClassName("button");
const SLIDES = document.getElementsByClassName("slide");
let WIDTH  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
let slideIndex = 1;

const handleWidth = () => {
    WIDTH  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}

const changeAllSlides = (displaySetting) => {
    console.log("changing slides");
    for (let i = 0; i < SLIDES.length; i++) {
        SLIDES[i].style.display = displaySetting;
    }
}

const changeCarouselButtons = (displaySetting) => {
    console.log("changing buttons");
    for (let i = 0; i < BUTTONS.length; i++) {
        BUTTONS[i].style.display = displaySetting;
    }
}

const changeSlide = (n) => {
    console.log("showing slide");
    showSlide(slideIndex += n);
};

const showSlide = (n) => {
    if (n > SLIDES.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = SLIDES.length;
    }
    SLIDES[slideIndex-1].style.display = "block";
}

const handleSlides = () => {
    if (WIDTH <= 360) {
        console.log("width correct");
        changeAllSlides("none");
        changeCarouselButtons("none");
        showSlide(slideIndex);
    } else {
        changeAllSlides("block");
        changeCarouselButtons("block");
    }
}

window.onresize = handleWidth;
//handleSlides();
changeSlide(1);