/**
 * NeuroBloom VisionEngine
 * Kamera API yönetimi, yüz hizalama kılavuz kontrolü ve ayna modu akışını yönetir.
 */
class VisionEngine {
  constructor() {
    this.stream = null;
  }

  async requestPermission() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      this.stop(); // İlk yetkilendirmeden sonra akışı kapat
      return true;
    } catch (err) {
      console.error("Kamera erişim hatası:", err);
      return false;
    }
  }

  async startMirrorMode(videoElementId) {
    const video = document.getElementById(videoElementId);
    if (!video) return;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" }
      });
      video.srcObject = this.stream;
      video.style.display = "block";
    } catch (err) {
      console.error("Ayna modu başlatılamadı:", err);
    }
  }

  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }
}

window.visionEngine = new VisionEngine();
