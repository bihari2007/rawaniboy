const imageInput = document.getElementById("imageInput");
const cropImage = document.getElementById("cropImage");
const cropContainer = document.getElementById("cropContainer");
const croppedPreview = document.getElementById("croppedPreview");
const cropBtn = document.getElementById("cropBtn");
const ratioSelect = document.getElementById("ratioSelect");
const sizeSelect = document.getElementById("sizeSelect");
const formatSelect = document.getElementById("formatSelect");
const downloadBtn = document.getElementById("downloadBtn");
const themeToggle = document.getElementById("themeToggle");

let cropper;
let finalDataURL;

/* Load Image */
imageInput.onchange = e => {
  const reader = new FileReader();
  reader.onload = ev => {
    cropImage.src = ev.target.result;
    cropContainer.style.display = "block";

    if (cropper) cropper.destroy();

    cropper = new Cropper(cropImage, {
      viewMode: 1,
      autoCropArea: 1,
      background: false,
      responsive: true
    });
  };
  reader.readAsDataURL(e.target.files[0]);
};

/* Change Ratio */
ratioSelect.onchange = () => {
  if (!cropper) return;
  if (ratioSelect.value === "free") cropper.setAspectRatio(NaN);
  else cropper.setAspectRatio(eval(ratioSelect.value));
};

/* Crop */
cropBtn.onclick = () => {
  const canvas = cropper.getCroppedCanvas();
  finalDataURL = canvas.toDataURL("image/jpeg", 1);
  croppedPreview.src = finalDataURL;
  croppedPreview.style.display = "block";
  downloadBtn.disabled = false;
};

/* Resize Image */
sizeSelect.onchange = () => {
  if (!finalDataURL) return;

  if (sizeSelect.value === "original") {
    croppedPreview.src = finalDataURL;
  } else {
    const img = new Image();
    img.onload = () => {
      finalDataURL = resizeToKB(img, +sizeSelect.value);
      croppedPreview.src = finalDataURL;
    };
    img.src = finalDataURL;
  }
};

/* Download */
downloadBtn.onclick = () => {
  if (formatSelect.value === "pdf") {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(finalDataURL);
    const w = pdf.internal.pageSize.getWidth();
    const h = imgProps.height * w / imgProps.width;
    pdf.addImage(finalDataURL, "JPEG", 0, 0, w, h);
    pdf.save("image.pdf");
  } else {
    const a = document.createElement("a");
    a.href = finalDataURL;
    a.download = "image.jpg";
    a.click();
  }
};

/* Resize Logic */
function resizeToKB(img, targetKB) {
  let quality = 1, w = img.width, h = img.height;
  const c = document.createElement("canvas");
  let data;
  while (true) {
    c.width = w;
    c.height = h;
    c.getContext("2d").drawImage(img, 0, 0, w, h);
    data = c.toDataURL("image/jpeg", quality);
    if ((data.length * 0.75) / 1024 <= targetKB) break;
    if (quality > 0.1) quality -= 0.05;
    else { w *= 0.9; h *= 0.9; quality = 1; }
  }
  return data;
}

/* ✅ Light/Dark Toggle */
themeToggle.onclick = () => {
  const body = document.body;
  if (body.dataset.theme === "light") {
    body.dataset.theme = "dark";
    themeToggle.textContent = "☀️";
  } else {
    body.dataset.theme = "light";
    themeToggle.textContent = "🌙";
  }
};