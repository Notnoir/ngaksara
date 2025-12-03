import { useRef, useState, useEffect } from 'react';

// Data Aksara Ngalagena
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

// Data Aksara Swara
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

const LatihanPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedAksara, setSelectedAksara] = useState<Aksara | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'ngalagena' | 'swara'>('ngalagena');
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  const currentAksaraList = selectedCategory === 'ngalagena' ? aksaraNgalagena : aksaraSwara;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        setContext(ctx);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context) return;
    setIsDrawing(true);
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
      context.clearRect(0, 0, canvas.width, canvas.height);
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

          {/* Category Tabs */}
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

          {/* Aksara Grid */}
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
          <div className="relative bg-white rounded-2xl p-5 shadow-xl">
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
              className="border-2 border-gray-300 rounded-lg cursor-crosshair block bg-gray-50 max-w-full"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
          </div>
          <button className="bg-red-500 text-white border-none rounded-xl px-12 py-4 text-lg font-semibold cursor-pointer transition-all shadow-lg shadow-red-500/30 hover:bg-red-600 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-500/40 active:translate-y-0">
            Periksa Tulisan
          </button>
        </div>
      </div>
    </div>
  );
};

export default LatihanPage;
