const WIDTH  = window.innerWidth || document.documentElement.clientWidth ||
document.body.clientWidth;

let slideIndex = 1;

const changeSlide = (n) => {
    showSlide(slideIndex += n);
};

const showSlide = (n) => {
    const X = document.getElementsByClassName("slide");
    let i;

    if (n > X.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = X.length }
    for (let i = 0; i < X.length; i++) {
        X[i].style.display = "none";
    }
    X[slideIndex-1].style.display = "block";
}

showSlide(slideIndex);