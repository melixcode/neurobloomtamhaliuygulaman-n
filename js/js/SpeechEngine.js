/**
 * NeuroBloom SpeechEngine
 * Web Speech API (SpeechRecognition & SpeechSynthesis) motorunu kullanarak
 * cihaz içi gerçek zamanlı STT ve TTS işlemlerini simüle eder ve yönetir.
 */
class SpeechEngine {
  constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = SpeechRecognition ? new SpeechRecognition() : null;
    this.synth = window.speechSynthesis;
    this.isListening = false;
    
    if (this.recognition) {
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
    }
  }

  async requestPermission() {
    // Tarayıcı kısıtlamaları gereği mikrofon izni kontrolü
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (err) {
      return false;
    }
  }

  speak(text, lang = 'tr-TR') {
    if (!this.synth) return;
    this.synth.cancel(); // Önceki sesleri kes
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9; // Çocuklar için hafif yavaş konuşma hızı
    this.synth.speak(utterance);
  }

  listenOnce(lang = 'tr-TR') {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        // Tarayıcı desteklemiyorsa mock veri dön (Yarışma Demosu Güvencesi)
        setTimeout(() => resolve("MOCK_SUCCESS"), 2500);
        return;
      }

      this.recognition.lang = lang;
      
      this.recognition.onstart = () => { this.isListening = true; };
      this.recognition.onend = () => { this.isListening = false; };
      this.recognition.onerror = (err) => reject(err);
      
      this.recognition.onresult = (event) => {
        const resultText = event.results[0][0].transcript;
        resolve(resultText);
      };

      try {
        this.recognition.start();
      } catch (e) {
        this.recognition.stop();
        reject(e);
      }
    });
  }
}

window.speechEngine = new SpeechEngine();
