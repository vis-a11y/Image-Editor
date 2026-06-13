const filters = {
    brightness: {
        value: 100,
        max: 200,
        min: 0,
        unit: "%"
    },
    contrast: {
        value: 100,
        min: 0,
        max: 200,
        unit: "%"
    },
    exposure: {
        value: 100,
        min: 0,
        max: 200,
        unit: "%"
    },
    saturation: {
        value: 100,
        min: 0,
        max: 200,
        unit: "%"
    },
    hueRotation: {
        value: 0,
        min: 0,
        max: 360,
        unit: "deg"
    },
    blur: {
        value: 0,
        min: 0,
        max: 20,
        unit: "px"
    },
    grayscale: {
        value: 0,
        min: 0,
        max: 100,
        unit: "%"
    },
    sepia: {
        value: 0,
        min: 0,
        max: 100,
        unit: "%"
    },
    opacity: {
        value: 100,
        min: 0,
        max: 100,
        unit: "%"
    },
    invert: {
        value: 0,
        min: 0,
        max: 100,
        unit: "%"
    }
};

const filtersContainer = document.querySelector(".filters");

const imageCanvas = document.querySelector("#image-canvas");
const imgInput = document.querySelector("#image-input");

const resetBtn = document.querySelector("#reset-btn");
const downloadBtn = document.querySelector("#download-btn");

const canvasCtx = imageCanvas.getContext("2d");

let currentImage = null;

function createFilterElement(
    name,
    unit = "%",
    value,
    min,
    max
) {

    const div = document.createElement("div");
    div.classList.add("filter");

    const p = document.createElement("p");
    p.innerText = `${name}: ${value}${unit}`;

    const input = document.createElement("input");
    input.type = "range";
    input.min = min;
    input.max = max;
    input.value = value;
    input.id = name;

    div.appendChild(p);
    div.appendChild(input);

    input.addEventListener("input", () => {

        filters[name].value = input.value;

        p.innerText =
            `${name}: ${input.value}${unit}`;

        applyFilters();
    });

    return div;
}

function applyFilters() {

    if (!currentImage) return;

    const filterString = `
        brightness(${filters.brightness.value}%)
        contrast(${filters.contrast.value}%)
        brightness(${filters.exposure.value}%)
        saturate(${filters.saturation.value}%)
        hue-rotate(${filters.hueRotation.value}deg)
        blur(${filters.blur.value}px)
        grayscale(${filters.grayscale.value}%)
        sepia(${filters.sepia.value}%)
        opacity(${filters.opacity.value}%)
        invert(${filters.invert.value}%)
    `;

    canvasCtx.clearRect(
        0,
        0,
        imageCanvas.width,
        imageCanvas.height
    );

    canvasCtx.filter = filterString;

    canvasCtx.drawImage(
        currentImage,
        0,
        0,
        imageCanvas.width,
        imageCanvas.height
    );
}

Object.keys(filters).forEach(key => {

    const filterElement = createFilterElement(
        key,
        filters[key].unit,
        filters[key].value,
        filters[key].min,
        filters[key].max
    );

    filtersContainer.appendChild(
        filterElement
    );
});

imgInput.addEventListener("change", (event) => {

    const file = event.target.files[0];
    if (!file) return;

    const imagePlaceholder =
    document.querySelector(".placeholder");
    imagePlaceholder.style.display = "none";
    imageCanvas.style.display = "block";
    const img = new Image();

    img.src = URL.createObjectURL(file);
    img.onload = () => {

        imageCanvas.width = img.width;
        imageCanvas.height = img.height;

        currentImage = img;
        applyFilters();
        URL.revokeObjectURL(img.src);
    };
});

resetBtn.addEventListener("click", () => {
    Object.keys(filters).forEach(key => {

        if (
            key === "brightness" ||
            key === "contrast" ||
            key === "exposure" ||
            key === "saturation" ||
            key === "opacity"
        ) {
            filters[key].value = 100;
        } else {
            filters[key].value = 0;
        }

        const slider =
            document.getElementById(key);
        if (slider) {
            slider.value =
                filters[key].value;
        }
    });

    const labels =
        document.querySelectorAll(".filter p");
    labels.forEach((label, index) => {
        const key =
            Object.keys(filters)[index];
        label.innerText =
            `${key}: ${filters[key].value}${filters[key].unit}`;
    });
    applyFilters();
});

downloadBtn.addEventListener("click", () => {
    if (!currentImage) return;
    const link =
        document.createElement("a");
    link.download =
        "edited-image.png";
    link.href =
        imageCanvas.toDataURL("image/png");

    link.click();
});