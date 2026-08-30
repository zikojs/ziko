const canvas2image = (canvas,format) => {}
class Canvas2Video {
    constructor(canvas,mimeType="video/webm") {
      this.canvas = canvas;
      this.videoSrc=null;
      this.mediaRecorder = new MediaRecorder(this.canvas.captureStream(), { mimeType: mimeType });
      this.chunks = [];
      this.mediaRecorder.ondataavailable = (e) => {
        this.chunks.push(e.data);
      };
      this.mediaRecorder.onstop = (e) => {
        const blob = new Blob(this.chunks, { type: mimeType });
        this.videoSrc = URL.createObjectURL(blob);
      };
    }
    start() {
      this.mediaRecorder.start();
      return this;
    }
    stop() {
      this.mediaRecorder.stop();
      return this;
    }
  }
const canvas2video=(canvas)=>new Canvas2Video(canvas)