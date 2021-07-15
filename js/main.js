let parentUlTags = undefined;
let imgTags = undefined;
let imageTracker = 1;

let arrowRight = undefined;
let arrowLeft = undefined;
let slidesTracker = 0;

let slider = undefined;
let activeSlider = undefined;
let sliderWithCurrentEvent = undefined;
let sliderStatus = false;

let speed = 1;

let progress = undefined;

let cycleTracker = 10;

let scrollBarWidth = undefined;

let howManyUlShouldBeInAVsibleRow = 6;

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
      "slides-tracker": 0
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
  sliderFunc();
  hoverAUl();
}

function setupSizes() {
  getScrollBarWidth();

  let windowWidth = window.innerWidth;

  howManyUlShouldBeInAVsibleRow = 6;

  if (windowWidth < 430) {
    howManyUlShouldBeInAVsibleRow = 2;
  } else if (windowWidth < 560) {
    howManyUlShouldBeInAVsibleRow = 3;
  } else if (windowWidth < 770) {
    howManyUlShouldBeInAVsibleRow = 4;
  } else if (windowWidth < 1024) {
    howManyUlShouldBeInAVsibleRow = 5;
  }

  for (let x = 0; x < allUlTags.length; x++) {
    const ul = allUlTags[x];
    ul.style.flex =
      "0 0 calc((100vw - " +
      (60 + scrollBarWidth + 60 + (howManyUlShouldBeInAVsibleRow - 1) * 4) +
      "px) / " +
      howManyUlShouldBeInAVsibleRow;
    ul.style.height =
      "calc((100vw - " +
      (60 + scrollBarWidth + 60 + (howManyUlShouldBeInAVsibleRow - 1) * 4) +
      "px) / " +
      howManyUlShouldBeInAVsibleRow;
  }

  for (let y = 0; y < arrowRight.length; y++) {
    const arrow = arrowRight[y];
    arrow.style.width = "60px";
    arrow.style.height =
      "calc((100vw - " +
      (60 + scrollBarWidth + 60 + (howManyUlShouldBeInAVsibleRow - 1) * 4) +
      "px) / " +
      howManyUlShouldBeInAVsibleRow;
  }

  for (let u = 0; u < arrowLeft.length; u++) {
    const arrow = arrowLeft[u];
    arrow.style.width = "60px";
    arrow.style.height =
      "calc((100vw - " +
      (60 + scrollBarWidth + 60 + (howManyUlShouldBeInAVsibleRow - 1) * 4) +
      "px) / " +
      howManyUlShouldBeInAVsibleRow;
  }
}

function sliderFunc() {
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

        sliderWithCurrentEvent.setAttribute("slides-Tracker", slidesTracker + 1)

        if (activeSlider !== undefined) {
          if (activeSlider.className !== sliderWithCurrentEvent.className) {
            activeSlider.classList.replace(
              activeSlider.classList[2],
              slidesTracker
            );
            slidesTracker = sliderWithCurrentEvent.classList[2];
          }
        }

        slidesTracker++;

        activeSlider = sliderWithCurrentEvent;

        parentUlTags.style.transition = "all +" + speed + "s";
        if (slidesTracker === 1) {
          parentUlTags.style.left = -parentUlTags.clientWidth + 56 + "px";
        } else {
          parentUlTags.style.left =
            -parentUlTags.clientWidth - allUlTags[0].clientWidth + 52 + "px";
        }

        setTimeout(() => {
          parentUlTags.style.transition = "none";
          if (slidesTracker === 1) {
            for (let s = 0; s < howManyUlShouldBeInAVsibleRow - 1; s++) {
              parentUlTags.appendChild(parentUlTags.firstChild);
            }
            arrowLeftForActiveSlider.style.display = "block";
          } else {
            for (let s = 0; s < howManyUlShouldBeInAVsibleRow; s++) {
              parentUlTags.appendChild(parentUlTags.firstChild);
            }
          }

          sliderStatus = false;

          parentUlTags.style.left = -allUlTags[0].clientWidth - 4 + "px";

          progressBarSetup(slidesTracker, "slide", sliderWithCurrentEvent);
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

        sliderWithCurrentEvent.setAttribute("slides-Tracker", slidesTracker - 1)


        if (activeSlider !== undefined) {
          if (activeSlider.className !== sliderWithCurrentEvent.className) {
            activeSlider.classList.replace(
              activeSlider.classList[2],
              slidesTracker
            );
            slidesTracker = sliderWithCurrentEvent.classList[2];
          }
        }

        slidesTracker--;

        activeSlider = sliderWithCurrentEvent;

        if (slidesTracker === 0) {
          parentUlTags.style.transition = "none";
          for (let s = 0; s < howManyUlShouldBeInAVsibleRow - 1; s++) {
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
          for (let s = 0; s < howManyUlShouldBeInAVsibleRow; s++) {
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
          progressBarSetup(slidesTracker, "slide", sliderWithCurrentEvent);
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
        progressSpan.style.width =
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

function hoverAUl() {
  let imageBox = undefined;
  let hoveredBox = undefined;
  let id = undefined;
  let classForHoverBox = "hover-box";

  for (let x = 0; x < allUlTags.length; x++) {
    const ul = allUlTags[x];

    ul.addEventListener("mouseenter", () => {
      let parentSlider = ul.parentElement.parentElement;
      let slidesTrackerValueOnAttribute = parseInt(parentSlider.getAttribute("slides-Tracker"));
      imageBox = ul.firstChild.firstChild.getAttribute("src");
      classForHoverBox = "hover-box";

      if (slidesTrackerValueOnAttribute === 0) {
        let firstUl = parentSlider.firstChild.firstChild;
        if (ul === firstUl) {
          classForHoverBox = "hover-box-first-ul";
        } else {
          let ulTagsArrangementNow = parentSlider.firstChild.children;
          if (ul === ulTagsArrangementNow[howManyUlShouldBeInAVsibleRow - 1]) {
            classForHoverBox = "hover-box-last-ul";
          }
        }
      } else {
        let firstUl = parentSlider.firstChild.children[1];
        if (ul === firstUl) {
          classForHoverBox = "hover-box-first-ul";
        } else {
          let ulTagsArrangementNow = parentSlider.firstChild.children;
          if (ul === ulTagsArrangementNow[howManyUlShouldBeInAVsibleRow]) {
            classForHoverBox = "hover-box-last-ul";
          }
        }
      }

      hoveredBox = createElement(
        "div",
        "." + parentSlider.classList[1] + " ." + ul.classList[1],
        "",
        {
          class: classForHoverBox,
          style: "background-image: url(" + imageBox + ");",
        }
      );

      id = setTimeout(() => {
        hoverBoxAnim(hoveredBox, "show");
      }, 600);
    });

    ul.addEventListener("mouseleave", () => {
      hoverBoxAnim(hoveredBox, "leave");
      clearTimeout(id);
    });
  }
}

function hoverBoxAnim(box, action) {
  let ulWidth = allUlTags[0].clientWidth;
  let idAnim = undefined;
  let oneTime = true;

  if (action === "show") {
    let boxShowWidth = ulWidth;
    animationShow();
    function animationShow() {
      if (boxShowWidth <= ulWidth * 1.4) {
        if (oneTime === true) {
          showContentOfHoverBox(box);
          oneTime = false;
        }
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
    let boxContent = box.firstChild;
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

function showContentOfHoverBox(hoveredBox) {
  let contentHoverBox = createElement("div", "." + hoveredBox.className, "", {
    class: "content-hover-box",
  });

  let playSVG = createElement(
    "div",
    "." + hoveredBox.firstChild.className,
    "Play",
    {
      class: "content-hover-play",
    }
  );

  playSVG.innerHTML = `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 426.667 426.667" style="enable-background:new 0 0 426.667 426.667;" xml:space="preserve">
	<g>
		<g>
			<g>
				<polygon points="170.667,309.333 298.667,213.333 170.667,117.333 			" />
				<path d="M213.333,0C95.467,0,0,95.467,0,213.333s95.467,213.333,213.333,213.333S426.667,331.2,426.667,213.333
				S331.2,0,213.333,0z M213.333,384c-94.08,0-170.667-76.587-170.667-170.667S119.253,42.667,213.333,42.667
				S384,119.253,384,213.333S307.413,384,213.333,384z" />
			</g>
		</g>
	</g>
	<g></g>
	<g></g>
	<g></g>
	<g></g>
	<g></g>
	<g></g>
	<g></g>
	<g></g>
	<g></g>
	<g></g>
	<g></g>
	<g></g>
	<g></g>
	<g></g>
	<g></g>
</svg>`;

  let infoSVG = createElement(
    "div",
    "." + hoveredBox.firstChild.className,
    "info",
    {
      class: "content-hover-info",
    }
  );

  infoSVG.innerHTML = `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="408px" height="408px" viewBox="0 0 408 408" style="enable-background:new 0 0 408 408;" xml:space="preserve">
	<g>
		<g id="more-vert">
			<path d="M204,102c28.05,0,51-22.95,51-51S232.05,0,204,0s-51,22.95-51,51S175.95,102,204,102z M204,153c-28.05,0-51,22.95-51,51
			s22.95,51,51,51s51-22.95,51-51S232.05,153,204,153z M204,306c-28.05,0-51,22.95-51,51s22.95,51,51,51s51-22.95,51-51
			S232.05,306,204,306z" />
		</g>
	</g>
	<g></g>
	<g></g>
	<g></g>
	<g></g>
	<g></g>
	<g></g>
	<g></g>
	<g></g>
	<g></g>
	<g></g>
	<g></g>
	<g></g>
	<g></g>
	<g></g>
	<g></g>
</svg>`;

  infoSVG.addEventListener("click", (e) => {
    showBigBox(e.target);
  });
}

function showBigBox(clicked) {
  if (clicked.tagName === "DIV") {
    if (clicked.className.includes("play")) {
      console.log("play");
    } else if (clicked.className.includes("info")) {
      let ul = clicked.parentElement.parentElement;
      let backgroundImage = ul.style.backgroundImage;
      let bigBoxWrapper = createElement("div", "body", "", {
        class: "big-box-wrapper",
      });

      bigBoxWrapper.style.height = document.body.clientHeight + 120 + "px";

      let bigBox = createElement("div", "." + bigBoxWrapper.className, "", {
        class: "big-box",
      });

      document.body.style.setProperty(
        "--ul-size",
        allUlTags[0].clientHeight + "px"
      );
      document.body.style.setProperty(
        "--big-box-left",
        ul.getBoundingClientRect().left + 40 + "px"
      );
      document.body.style.setProperty(
        "--big-box-top",
        ul.getBoundingClientRect().top + 40 + "px"
      );

      ul.remove();

      createElement("div", "." + bigBox.className, "", {
        class: "bgi-for-big-box",
        style:
          "background-image: linear-gradient(to top,#1A1D29fe 50%, #00000000 52%, #00000000 60%) , " +
          backgroundImage +
          ";",
      });

      let closeWrapper = createElement("div", "." + bigBox.className, "", {
        class: "close-wrapper",
      });

      createElement("span", "." + closeWrapper.className, "", {});
      createElement("span", "." + closeWrapper.className, "", {});

      closeWrapper.addEventListener("click", () => {
        bigBoxWrapper.remove();
      });
    }
  }
}

window.addEventListener("resize", setupSizes);
