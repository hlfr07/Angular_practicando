import { Component } from '@angular/core';
import * as ort from 'onnxruntime-web';

@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.css']
})
export class ModelsComponent {

  session: ort.InferenceSession | null = null;
  modelPath = 'assets/models/bria.onnx';
  selectedFile: File | null = null;

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log("📁 Archivo seleccionado:", this.selectedFile);
  }

  async loadModel() {
    if (!this.session) {
      console.log("📌 Configurando ruta WASM...");
      ort.env.wasm.wasmPaths = 'assets/module/';

      console.log("📌 Cargando modelo desde:", this.modelPath);
      this.session = await ort.InferenceSession.create(this.modelPath, {
        executionProviders: ['wasm']
      });

      console.log("✔ Modelo cargado correctamente");
    }
  }

  async processImage(file: File) {
    console.log("🧪 Procesando archivo:", file.name);

    if (!this.session) await this.loadModel();

    // Cargar imagen original
    const bitmap = await createImageBitmap(file);
    const origWidth = bitmap.width;
    const origHeight = bitmap.height;
    console.log("📌 Imagen original:", origWidth, "x", origHeight);

    // Canvas para redimensionar a 1024x1024
    const size = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(bitmap, 0, 0, size, size);

    // Convertir a Float32Array para ONNX
    const imageData = ctx.getImageData(0, 0, size, size);
    const data = new Float32Array(3 * size * size);
    let idx = 0;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = (y * size + x) * 4;
        data[idx] = imageData.data[i] / 255;             // R
        data[idx + size * size] = imageData.data[i + 1] / 255; // G
        data[idx + 2 * size * size] = imageData.data[i + 2] / 255; // B
        idx++;
      }
    }

    const tensor = new ort.Tensor('float32', data, [1, 3, size, size]);
    const output = await this.session!.run({ input: tensor });
    const maskData = output[Object.keys(output)[0]].data as Float32Array;

    console.log("📌 Mascara generada, length:", maskData.length);

    // Crear canvas para la máscara
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = size;
    maskCanvas.height = size;
    const maskCtx = maskCanvas.getContext('2d')!;
    const maskImage = maskCtx.createImageData(size, size);

    for (let i = 0; i < maskData.length; i++) {
      const alpha = Math.min(Math.max(Math.pow(maskData[i], 2.2) * 255, 0), 255);
      const idx4 = i * 4;
      maskImage.data[idx4] = 255;
      maskImage.data[idx4 + 1] = 255;
      maskImage.data[idx4 + 2] = 255;
      maskImage.data[idx4 + 3] = alpha;
    }
    maskCtx.putImageData(maskImage, 0, 0);

    // Redimensionar máscara al tamaño original
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = origWidth;
    finalCanvas.height = origHeight;
    const finalCtx = finalCanvas.getContext('2d')!;

    // Pintar imagen original
    finalCtx.drawImage(bitmap, 0, 0, origWidth, origHeight);
    // Pintar máscara sobre la imagen
    finalCtx.globalCompositeOperation = 'destination-in';
    finalCtx.drawImage(maskCanvas, 0, 0, origWidth, origHeight);

    // Mostrar resultado
    const resultUrl = finalCanvas.toDataURL('image/png');
    const imgEl = document.getElementById('result') as HTMLImageElement;
    imgEl.src = resultUrl;

    // Descargar automáticamente
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = 'resultado.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    console.log("✔ Imagen procesada y descargada");
  }

  onRemoveBackground() {
    if (this.selectedFile) {
      this.processImage(this.selectedFile);
    } else {
      alert('Selecciona primero una imagen!');
    }
  }
}
