const video = document.getElementById('video');

// Akses kamera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    alert('Tidak bisa mengakses kamera: ' + err);
  });

// Fungsi kirim frame ke backend
async function captureFrame() {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));

  const formData = new FormData();
  formData.append('image', blob, 'frame.jpg');

  // Ganti URL di bawah dengan ngrok dari Colab
  const response = await fetch('https://<NGROK-URL-KAMU>/detect', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  document.getElementById('result').innerText = `Mobil terdeteksi: ${data.car_count}`;
}