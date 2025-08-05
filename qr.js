const canvas = document.getElementById('qrcode');
const inputText = document.getElementById('text');
let cleared = false;

// Clear default text when user types first time
inputText.addEventListener('input', () => {
  if (!cleared && inputText.value !== '') {
    inputText.value = inputText.value.replace('www.rawaniboy.site', '');
    cleared = true;
  }
});

function generateQR() {
  const text = inputText.value || ' ';
  const color = document.getElementById('color').value;

  QRCode.toCanvas(canvas, text, {
    color: {
      dark: color,
      light: "#ffffff" // fixed white background
    },
    width: 200,
    margin: 1
  }, function(error) {
    if (error) console.error(error);
  });
}

function downloadQR() {
  const link = document.createElement('a');
  link.download = '(rawaniboy.site).png';
  link.href = canvas.toDataURL();
  link.click();
}

// Generate default QR
generateQR();
