import "./App.css";
import { useState } from "react";
import LatihanPage from "./assets/page/LatihanPage";
import KuisPage from "./assets/page/KuisPage";

type Page = "home" | "latihan" | "kuis";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");

  if (currentPage === "latihan") {
    return <LatihanPage onBack={() => setCurrentPage("home")} />;
  }

  if (currentPage === "kuis") {
    return <KuisPage onBack={() => setCurrentPage("home")} />;
  }

  // Home page with new design
  return (
    <div className="relative h-screen flex flex-col bg-background-light font-display text-[#1b0d0d] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 cultural-pattern pointer-events-none z-0"></div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full z-10 py-6 px-6 md:px-10 overflow-hidden">
        <div className="flex flex-col w-full max-w-4xl gap-6 md:gap-8">
          {/* Hero Section Centered */}
          <div className="flex flex-col items-center text-center gap-3 md:gap-4">
            <div className="flex flex-col gap-2 max-w-2xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight tracking-[-0.033em] text-gray-900">
                Kuasai Seni <span className="text-primary">Aksara Sunda</span>
              </h1>
              <h2 className="text-sm md:text-base lg:text-lg font-normal text-gray-600">
                Belajar dan Berlatih Aksara Sunda dengan Mudah melalui pelajaran
                dan kuis interaktif.
              </h2>
            </div>
          </div>

          {/* Primary Action Cards */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto">
            {/* Practice Card */}
            <button
              onClick={() => setCurrentPage("latihan")}
              className="group relative flex flex-col items-center justify-center gap-4 bg-white hover:bg-primary border border-[#f3e7e7] hover:border-primary p-8 rounded-md shadow-sm hover:shadow-xl transition-all duration-300 h-64 text-center overflow-hidden"
            >
              <div className="px-3 py-2 rounded-full bg-primary/10 group-hover:bg-white/20 transition-colors">
                <span className="material-symbols-outlined text-4xl text-primary group-hover:text-white">
                  edit
                </span>
              </div>
              <div className="flex flex-col gap-1 z-10">
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-white transition-colors">
                  Latihan Menulis
                </h3>
                <p className="text-sm text-gray-500 group-hover:text-white/90 transition-colors">
                  Pelajari karakter dan tingkatkan kemampuan menulis
                </p>
              </div>
            </button>

            {/* Quiz Card */}
            <button
              onClick={() => setCurrentPage("kuis")}
              className="group relative flex flex-col items-center justify-center gap-4 bg-white hover:bg-primary border border-[#f3e7e7] hover:border-primary p-8 rounded-md shadow-sm hover:shadow-xl transition-all duration-300 h-64 text-center overflow-hidden"
            >
              <div className="px-3 py-2 rounded-full bg-primary/10 group-hover:bg-white/20 transition-colors">
                <span className="material-symbols-outlined text-4xl text-primary group-hover:text-white">
                  quiz
                </span>
              </div>
              <div className="flex flex-col gap-1 z-10">
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-white transition-colors">
                  Kuis Aksara
                </h3>
                <p className="text-sm text-gray-500 group-hover:text-white/90 transition-colors">
                  Uji pengetahuan Anda dan raih pencapaian
                </p>
              </div>
            </button>
          </div>

          {/* Feature Highlights */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-8 opacity-80">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                check_circle
              </span>
              <span className="text-sm font-medium text-gray-600">
                Feedback Instan
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                history_edu
              </span>
              <span className="text-sm font-medium text-gray-600">
                Konteks Budaya
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                devices
              </span>
              <span className="text-sm font-medium text-gray-600">
                Desain Responsif
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
