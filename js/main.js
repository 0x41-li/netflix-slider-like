let parentUlTags = undefined;
let imgTags = undefined;
let imageTracker = 1;

let arrowRight = undefined;
let arrowLeft = undefined;
let loopTracker = 0;

let slider = undefined;
let activeSlider = undefined;
let sliderWithCurrentEvent = undefined;
let sliderStatus = false;

let speed = 1;

let progress = undefined;

let cycleTracker = 10;

let scrollBarWidth = undefined;

fetch("./data/data.json")
  .then((res) => res.json())
  .then((item) => {
    renderToBrowser(item);
  });

function renderToBrowser(item) {
  for (let i = 0; i < item.data.length; i++) {
    let section = item.data[i];
    createElement("section", "body", "", {
      class: "genreSection genreSection-" + i,
    });
    createElement("h2", ".genreSection-" + i, section.genre, {
      class: "genreTitle",
    });

    createElement("div", ".genreSection-" + i, "", {
      class: "slider-wrapper slider-wrapper-" + i + " 0",
    });

    createElement("div", ".genreSection-" + i, "", {
      class: "progressbar",
    });

    createElement("span", ".genreSection-" + i + " .progressbar", "", {
      class: "progress",
    });

    createElement("div", ".genreSection-" + i + " .slider-wrapper-" + i, "", {
      class: "slider",
    });

    createElement("span", ".genreSection-" + i + " .slider-wrapper-" + i, "", {
      class: "arrow-left",
    });

    createElement(
      "img",
      ".genreSection-" + i + " .slider-wrapper-" + i + " .arrow-left",
      "",
      {
        src: "images/left-arrow.png",
      }
    );

    createElement("span", ".genreSection-" + i + " .slider-wrapper-" + i, "", {
      class: "arrow-right",
    });

    createElement(
      "img",
      ".genreSection-" + i + " .slider-wrapper-" + i + " .arrow-right",
      "",
      {
        src: "images/right-arrow.png",
      }
    );

    for (let u = 0; u < section["release"].length; u++) {
      createElement("ul", ".genreSection-" + i + " .slider", "", {
        class: "ul-tags ul-" + section["release"][u].releaseId,
      });

      createElement(
        "li",
        ".genreSection-" +
          i +
          " .slider .ul-" +
          section["release"][u].releaseId,
        "",
        {
          class: "loading",
        }
      );

      createElement(
        "img",
        ".genreSection-" +
          i +
          " .slider  .ul-" +
          section["release"][u].releaseId +
          " li",
        "",
        {
          src: "./images/" + imageTracker + ".jpg",
        }
      );

      imageTracker++;

      if (imageTracker === section["release"].length + 1) {
        imageTracker = 1;
      }
    }
  }

  sliders = document.querySelectorAll(".genreSection");
  allUlTags = document.querySelectorAll(".ul-tags");
  imgTags = document.querySelectorAll(".ul-tags li img");
  arrowRight = document.querySelectorAll(".arrow-right");
  arrowLeft = document.querySelectorAll(".arrow-left");
  progress = document.querySelectorAll(".progressbar span");

  setupSizes();
  progressBarSetup(0, "setup", sliders);
  listenToClickEventsAndSliderFunc();
  hoverBox();
}

function progressBarSetup(pos, action, sliderWithAction) {
  if (pos < 10) {
    pos = parseInt(pos.toString().substring(0, 1));
  } else if (pos >= 10) {
    pos = parseInt(pos.toString().substring(1, 2));
  }

  if (action === "setup") {
    for (let z = 0; z < sliderWithAction.length; z++) {
      let ulTagsOfCurrentSlider = document.querySelectorAll(
        "." + sliderWithAction[z].classList[1] + " .ul-tags"
      );
      for (let x = 0; x < progress.length; x++) {
        let progressSpan = progress[x];
        progress[x].style.width =
          200 / Math.floor(ulTagsOfCurrentSlider.length / 6) + "px";
      }
    }
  } else if (action === "slide") {
    let ulTagsOfCurrentSlider = sliderWithAction.children[0].children;
    let progressSpanOfCurrentSlider =
      sliderWithAction.nextElementSibling.children[0];
    progressSpanOfCurrentSlider.style.left =
      (200 / Math.floor(ulTagsOfCurrentSlider.length / 6)) * pos + "px";
  }
}

function listenToClickEventsAndSliderFunc() {
  for (let a = 0; a < imgTags.length; a++) {
    imgTags[a].addEventListener("load", (e) => {
      liTag = e.target.parentElement;
      liTag.classList.remove("loading");
    });
  }

  for (let z = 0; z < arrowRight.length; z++) {
    arrowRight[z].addEventListener("click", (e) => {
      if (sliderStatus === false) {
        sliderStatus = true;

        let arrowLeftForActiveSlider = undefined;

        parentUlTags =
          e.currentTarget.previousElementSibling.previousElementSibling;
        sliderWithCurrentEvent = parentUlTags.parentNode;
        arrowLeftForActiveSlider = parentUlTags.nextElementSibling;

        if (activeSlider !== undefined) {
          if (activeSlider.className !== sliderWithCurrentEvent.className) {
            activeSlider.classList.replace(
              activeSlider.classList[2],
              loopTracker
            );
            loopTracker = sliderWithCurrentEvent.classList[2];
          }
        }

        loopTracker++;

        activeSlider = sliderWithCurrentEvent;

        parentUlTags.style.transition = "all +" + speed + "s";
        if (loopTracker === 1) {
          parentUlTags.style.left = -parentUlTags.clientWidth + 56 + "px";
        } else {
          parentUlTags.style.left =
            -parentUlTags.clientWidth - allUlTags[0].clientWidth + 52 + "px";
        }

        setTimeout(() => {
          parentUlTags.style.transition = "none";
          if (loopTracker === 1) {
            for (let s = 0; s < 5; s++) {
              parentUlTags.appendChild(parentUlTags.firstChild);
            }
            arrowLeftForActiveSlider.style.display = "block";
          } else {
            for (let s = 0; s < 6; s++) {
              parentUlTags.appendChild(parentUlTags.firstChild);
            }
          }

          sliderStatus = false;

          parentUlTags.style.left = -allUlTags[0].clientWidth - 4 + "px";

          progressBarSetup(loopTracker, "slide", sliderWithCurrentEvent);
        }, speed * 1000);
      }
    });
  }

  for (let c = 0; c < arrowLeft.length; c++) {
    arrowLeft[c].addEventListener("click", (e) => {
      if (sliderStatus === false) {
        sliderStatus = true;
        let arrowLeftForActiveSlider = undefined;

        parentUlTags = e.currentTarget.previousElementSibling;
        sliderWithCurrentEvent = parentUlTags.parentNode;
        arrowLeftForActiveSlider = parentUlTags.nextElementSibling;

        if (activeSlider !== undefined) {
          if (activeSlider.className !== sliderWithCurrentEvent.className) {
            activeSlider.classList.replace(
              activeSlider.classList[2],
              loopTracker
            );
            loopTracker = sliderWithCurrentEvent.classList[2];
          }
        }

        loopTracker--;

        activeSlider = sliderWithCurrentEvent;

        if (loopTracker === 0) {
          parentUlTags.style.transition = "none";
          for (let s = 0; s < 5; s++) {
            parentUlTags.insertBefore(
              parentUlTags.lastChild,
              parentUlTags.firstChild
            );
            parentUlTags.style.left = -parentUlTags.clientWidth + 56 + "px";
          }
          parentUlTags.style.transition = "all +" + speed + "s";
          parentUlTags.style.left = "0px";
          arrowLeftForActiveSlider.style.display = "none";
        } else {
          parentUlTags.style.transition = "none";
          for (let s = 0; s < 6; s++) {
            parentUlTags.insertBefore(
              parentUlTags.lastChild,
              parentUlTags.firstChild
            );
            parentUlTags.style.left =
              -parentUlTags.clientWidth - allUlTags[0].clientWidth + 52 + "px";
          }
          parentUlTags.style.transition = "all +" + speed + "s";
          parentUlTags.style.left = -allUlTags[0].clientWidth - 4 + "px";
          arrowLeftForActiveSlider.style.display = "block";
        }
        setTimeout(() => {
          sliderStatus = false;
          progressBarSetup(loopTracker, "slide", sliderWithCurrentEvent);
        }, speed * 1000);
      }
    });
  }

  document.querySelector("#seconds").addEventListener("input", () => {
    speed = document.querySelector("#seconds").value;
  });
}

function getScrollBarWidth() {
  scrollBarWidth = window.innerWidth - document.body.clientWidth;
}

function setupSizes() {
  getScrollBarWidth();

  for (let x = 0; x < allUlTags.length; x++) {
    const ul = allUlTags[x];
    ul.style.flex =
      "0 0 calc((100vw - " + (60 + scrollBarWidth + 60 + 20) + "px) / 6)";
    ul.style.height =
      "calc((100vw - " + (60 + scrollBarWidth + 60 + 20) + "px) / 6)";
  }

  for (let y = 0; y < arrowRight.length; y++) {
    const arrow = arrowRight[y];
    arrow.style.width = "60px";
  }

  for (let u = 0; u < arrowLeft.length; u++) {
    const arrow = arrowLeft[u];
    arrow.style.width = "60px";
  }
}


function hoverBox() {
  let imageBox = undefined;
  let hoveredBox = undefined;
  let id = undefined;
  let classForHoverBox = "hover-box";

  for (let x = 0; x < allUlTags.length; x++) {
    const ul = allUlTags[x];

    ul.addEventListener("mouseenter", () => {
      let parentCurrentUl = ul.parentElement.parentElement;
      imageBox = ul.firstChild.firstChild.getAttribute("src");
      
      if(loopTracker === 0) {
        let firstUl = parentCurrentUl.firstChild.firstChild;  
      }

      hoveredBox = createElement(
        "div",
        "." + parentCurrentUl.classList[1] + " ." + ul.classList[1],
        "",
        {
          class: classForHoverBox,
          style: "background-image: url(" + imageBox + ");",
        }
      );

      id = setTimeout(() => {
        boxAnim(hoveredBox, "show");
      }, 600);

    });

    ul.addEventListener("mouseleave", () => {
      boxAnim(hoveredBox, "leave");
      clearTimeout(id);
    });
    
  }
}

function boxAnim(box, action) {
  let ulWidth = allUlTags[0].clientWidth;
  let idAnim = undefined;

  if (action === "show") {
    let boxShowWidth = ulWidth;
    animationShow();
    function animationShow() {
      if (boxShowWidth <= ulWidth * 1.4) {
        boxShowWidth += 10;
        box.style.width = Math.min(boxShowWidth, ulWidth * 1.4) + "px";
        box.style.height = Math.min(boxShowWidth, ulWidth * 1.4) + "px";
        idAnim = requestAnimationFrame(animationShow);
      } else {
        cancelAnimationFrame(idAnim);
      }
    }
  } else if (action === "leave") {
    let boxShowWidth = box.style.width.replace("px", "");
    animationLeave();
    function animationLeave() {
      if (boxShowWidth >= ulWidth) {
        boxShowWidth -= 10;
        box.style.width = Math.max(boxShowWidth, ulWidth) + "px";
        box.style.height = Math.max(boxShowWidth, ulWidth) + "px";
        idAnim = requestAnimationFrame(animationLeave);
      } else {
        cancelAnimationFrame(idAnim);
        box.remove();
      }
    }
  }
}

