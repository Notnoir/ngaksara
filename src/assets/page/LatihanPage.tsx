import { useRef, useState, useEffect } from 'react';
import axios from 'axios';

const aksaraNgalagena = [
  { char: 'ᮊ', name: 'KA' },
  { char: 'ᮋ', name: 'QA' },
  { char: 'ᮠ', name: 'HA' },
  { char: 'ᮕ', name: 'PA' },
  { char: 'ᮖ', name: 'FA' },
  { char: 'ᮗ', name: 'VA' },
  { char: 'ᮔ', name: 'NA' },
  { char: 'ᮌ', name: 'GA' },
  { char: 'ᮍ', name: 'NGA' },
  { char: 'ᮎ', name: 'CA' },
  { char: 'ᮝ', name: 'WA' },
  { char: 'ᮜ', name: 'LA' },
  { char: 'ᮛ', name: 'RA' },
  { char: 'ᮞ', name: 'SA' },
  { char: 'ᮟ', name: 'XA' },
  { char: 'ᮚ', name: 'YA' },
  { char: 'ᮒ', name: 'TA' },
  { char: 'ᮙ', name: 'MA' },
  { char: 'ᮓ', name: 'DA' },
  { char: 'ᮏ', name: 'JA' },
  { char: 'ᮘ', name: 'BA' },
  { char: 'ᮑ', name: 'NGA' },
  { char: 'ᮐ', name: 'ZA' },
];

const aksaraSwara = [
  { char: 'ᮃ', name: 'A' },
  { char: 'ᮄ', name: 'E' },
  { char: 'ᮅ', name: 'EU' },
  { char: 'ᮆ', name: 'I' },
  { char: 'ᮇ', name: 'O' },
  { char: 'ᮈ', name: 'U' },
  { char: 'ᮉ', name: 'É' },
];

interface Aksara {
  char: string;
  name: string;
}

interface PredictionResult {
  class: string;
  confidence: number;
}

const LatihanPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedAksara, setSelectedAksara] = useState<Aksara | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'ngalagena' | 'swara'>('ngalagena');
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);

  const API_URL = 'http://localhost:5000'; 

  const currentAksaraList = selectedCategory === 'ngalagena' ? aksaraNgalagena : aksaraSwara;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Set background putih
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        setContext(ctx);
      }
    }

    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const response = await axios.get(`${API_URL}/health`);
      console.log('Backend health:', response.data);
    } catch (error) {
      console.error('Backend not reachable:', error);
      alert('Backend server tidak dapat dijangkau. Pastikan Flask server sudah running.');
    }
  };

  const canvasToBlob = (): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      if (canvas && context) {
        // Buat canvas temporary untuk ensure background putih
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        if (tempCtx) {
          tempCanvas.width = canvas.width;
          tempCanvas.height = canvas.height;
          
          // Fill dengan background putih
          tempCtx.fillStyle = 'white';
          tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
          
          // Draw canvas asli di atas background putih
          tempCtx.drawImage(canvas, 0, 0);
          
          // Convert ke JPEG dengan quality 0.95
          tempCanvas.toBlob((blob) => {
            if (blob) resolve(blob);
          }, 'image/jpeg', 0.95);
        }
      }
    });
  };

  // Fungsi untuk save blob sebagai file
  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const predictDrawing = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !context) return;

    // Cek apakah canvas kosong (cek apakah ada pixel hitam)
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let hasDrawing = false;
    
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      // Cek apakah pixel bukan putih
      if (r < 250 || g < 250 || b < 250) {
        hasDrawing = true;
        break;
      }
    }

    if (!hasDrawing) {
      alert('Canvas kosong! Silakan tulis aksara terlebih dahulu.');
      return;
    }

    try {
      setIsLoading(true);
      setPrediction(null);

      // Convert canvas to blob (JPEG dengan background putih)
      const blob = await canvasToBlob();
      
      // SAVE BLOB UNTUK ANALISIS
      // const timestamp = new Date().getTime();
      // downloadBlob(blob, `canvas_${timestamp}.jpg`);
      // console.log('Canvas blob saved for analysis as JPG with white background');
      
      // Create FormData
      const formData = new FormData();
      formData.append('image', blob, 'drawing.jpg');

      // Send to backend
      const response = await axios.post(`${API_URL}/predict`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setPrediction({
          class: response.data.prediction.class,
          confidence: response.data.prediction.confidence
        });
        
        console.log('Top 3 predictions:', response.data.top_predictions);
      } else {
        alert('Prediksi gagal: ' + response.data.error);
      }

    } catch (error) {
      console.error('Error during prediction:', error);
      if (axios.isAxiosError(error)) {
        alert('Gagal terhubung ke server. Pastikan Flask server sudah running di ' + API_URL);
      } else {
        alert('Gagal melakukan prediksi');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context) return;
    setIsDrawing(true);
    setPrediction(null);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      context.beginPath();
      context.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      context.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      context.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas && context) {
      // Clear dengan background putih
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);
      setPrediction(null);
    }
  };

  const handleAksaraClick = (aksara: Aksara) => {
    setSelectedAksara(aksara);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      <header className="mb-8">
        <button className="bg-white border border-gray-300 rounded-lg px-5 py-2.5 text-base cursor-pointer mb-5 hover:bg-gray-50 transition-all">
          ← Kembali
        </button>
        <h1 className="text-red-500 text-5xl font-bold my-2.5">Latihan menulis</h1>
        <h2 className="text-gray-800 text-4xl font-semibold my-1.5">Aksara Sunda</h2>
      </header>

      <div className="flex gap-8 max-w-[1400px] mx-auto flex-col lg:flex-row">
        <div className="flex-1 max-w-full lg:max-w-[700px]">
          <p className="text-gray-600 text-base leading-relaxed mb-5">
            Pilih aksara yang ingin Anda pelajari dari daftar di bawah ini. Lalu tuliskan di kanvas samping.
          </p>

          <div className="flex gap-2.5 mb-5">
            <button
              className={`px-6 py-3 rounded-lg text-base cursor-pointer transition-all border-2 ${
                selectedCategory === 'ngalagena'
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-white border-gray-300 hover:border-red-500 hover:text-red-500'
              }`}
              onClick={() => setSelectedCategory('ngalagena')}
            >
              Aksara Ngalagena
            </button>
            <button
              className={`px-6 py-3 rounded-lg text-base cursor-pointer transition-all border-2 ${
                selectedCategory === 'swara'
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-white border-gray-300 hover:border-red-500 hover:text-red-500'
              }`}
              onClick={() => setSelectedCategory('swara')}
            >
              Aksara Swara
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-5">
            {currentAksaraList.map((aksara, index) => (
              <div
                key={index}
                className={`bg-white border-2 rounded-xl p-5 text-center cursor-pointer transition-all relative hover:-translate-y-0.5 hover:shadow-lg ${
                  selectedAksara?.name === aksara.name
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 hover:border-red-500'
                }`}
                onClick={() => handleAksaraClick(aksara)}
              >
                {selectedAksara?.name === aksara.name && (
                  <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"></span>
                )}
                <div className="text-7xl mb-2.5 font-sundanese leading-none font-medium" style={{ fontFeatureSettings: '"liga" 1' }}>
                  {aksara.char}
                </div>
                <div className="text-sm font-semibold text-gray-800">{aksara.name}</div>
              </div>
            ))}
          </div>

          <div className="text-center text-gray-600 text-sm">
            <span>1 / {Math.ceil(currentAksaraList.length / 12)}</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center gap-5">
          <div className="relative bg-white rounded-2xl p-5 shadow-xl w-full max-w-[520px]">
            <button
              className="absolute top-4 right-4 bg-white border-2 border-gray-300 rounded-lg px-3 py-2 text-xl cursor-pointer transition-all z-10 hover:bg-red-50 hover:border-red-500"
              onClick={clearCanvas}
            >
              🗑️
            </button>
            <canvas
              ref={canvasRef}
              width={500}
              height={500}
              className="border-2 border-gray-300 rounded-lg cursor-crosshair block w-full"
              style={{ backgroundColor: 'white' }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
          </div>

          <button 
            className={`bg-red-500 text-white border-none rounded-xl px-12 py-4 text-lg font-semibold cursor-pointer transition-all shadow-lg shadow-red-500/30 hover:bg-red-600 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-500/40 active:translate-y-0 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none`}
            onClick={predictDrawing}
            disabled={isLoading}
          >
            {isLoading ? 'Memproses...' : 'Prediksi Tulisan'}
          </button>

          {prediction && (
            <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-[520px] border-2 border-green-500">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Hasil Prediksi</h3>
              <div className="flex flex-col items-center gap-3">
                <div className="text-6xl font-sundanese">{currentAksaraList.find(a => a.name === prediction.class)?.char || '?'}</div>
                <div className="text-3xl font-bold text-red-500">{prediction.class}</div>
                <div className="text-lg text-gray-600">
                  Confidence: <span className="font-semibold text-green-600">{prediction.confidence.toFixed(2)}%</span>
                </div>
                {selectedAksara && (
                  <div className={`mt-4 p-4 rounded-lg w-full text-center ${
                    selectedAksara.name === prediction.class 
                      ? 'bg-green-50 border-2 border-green-500' 
                      : 'bg-red-50 border-2 border-red-500'
                  }`}>
                    {selectedAksara.name === prediction.class ? (
                      <p className="text-green-700 font-semibold">✓ Benar! Tulisan Anda sesuai</p>
                    ) : (
                      <p className="text-red-700 font-semibold">✗ Kurang tepat. Seharusnya: {selectedAksara.name}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LatihanPage;