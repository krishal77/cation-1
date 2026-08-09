import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Zap, Camera, Image } from "lucide-react";
import { MascotSVG } from "../../components/common/MascotSVG";

export function CameraScreen({ onScan, onBack, onFileSelect }: { onScan: () => void; onBack: () => void; onFileSelect: (file: File) => void }) {
  const [scanning, setScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function startCamera() {
      if (!navigator.mediaDevices?.getUserMedia) return;
      const tiers: MediaStreamConstraints[] = [
        { video: { facingMode: { ideal: "environment" } }, audio: false },
        { video: { facingMode: "user" }, audio: false },
        { video: true, audio: false },
      ];
      for (const constraints of tiers) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          if (!isMounted) { stream.getTracks().forEach(t => t.stop()); return; }
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
          }
          setCameraActive(true);
          return;
        } catch {
        }
      }
    }
    startCamera();
    return () => {
      isMounted = false;
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    onFileSelect(file);
    setScanning(true);
    setTimeout(onScan, 600);
  };

  const handleLiveCapture = () => {
    if (!cameraActive || !videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `scan_${Date.now()}.jpg`, { type: "image/jpeg" });
      onFileSelect(file);
      setScanning(true);
      setTimeout(onScan, 600);
    }, "image/jpeg", 0.9);
  };

  return (
    <div className="h-full min-h-full flex-1 bg-black flex flex-col relative overflow-hidden select-none">
      <canvas ref={canvasRef} className="hidden" />

      <div className="absolute inset-0 bg-black flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-opacity duration-700 ${cameraActive ? "opacity-100" : "opacity-0"}`}
        />

        {!cameraActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
            <img
              src="https://images.unsplash.com/photo-1761048803183-fc870f25e221?w=600&h=900&fit=crop&auto=format"
              alt="background"
              className="w-full h-full object-cover opacity-20 absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/80" />

            <div className="relative z-10 bg-black/85 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl w-full max-w-[340px]">
              <div className="w-16 h-16 rounded-2xl bg-[#69A20D]/20 border border-[#69A20D]/40 flex items-center justify-center mx-auto mb-4">
                <Camera size={32} className="text-[#69A20D]" />
              </div>
              <h3 className="text-white text-base font-black font-display mb-1">AI Heritage Scanner</h3>
              <p className="text-white/60 text-xs mb-5 leading-relaxed">
                Scan temples, stupas, or monuments for instant history & voice tour.
              </p>

              <label
                htmlFor="camera-capture-input"
                className="flex items-center justify-center gap-2 bg-[#69A20D] hover:bg-[#58890a] active:bg-[#4a7509] text-white text-sm font-bold py-4 px-6 rounded-2xl shadow-lg w-full mb-3 cursor-pointer transition-all"
              >
                <Camera size={18} />
                <span>Take Photo</span>
              </label>
              <input
                id="camera-capture-input"
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
              />

              <label
                htmlFor="gallery-input"
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-sm font-bold py-3.5 px-6 rounded-2xl border border-white/20 w-full cursor-pointer transition-all"
              >
                <Image size={18} />
                <span>Choose from Gallery</span>
              </label>
              <input
                id="gallery-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      </div>

      <div className="relative z-10 flex items-center justify-between px-5 pt-14 pb-4">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-95 transition-all"
        >
          <ArrowLeft size={18} />
        </button>

        <button
          onClick={() => setFlashOn(!flashOn)}
          className={`w-10 h-10 rounded-full backdrop-blur-md border flex items-center justify-center transition-all ${
            flashOn ? "bg-[#69A20D] text-[#FFFFFF] border-[#69A20D]" : "bg-black/40 text-white/80 border-white/20"
          }`}
        >
          <Zap size={16} />
        </button>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72">
          {[
            ["top-0 left-0 border-t-3 border-l-3", "rounded-tl-2xl"],
            ["top-0 right-0 border-t-3 border-r-3", "rounded-tr-2xl"],
            ["bottom-0 left-0 border-b-3 border-l-3", "rounded-bl-2xl"],
            ["bottom-0 right-0 border-b-3 border-r-3", "rounded-br-2xl"],
          ].map(([pos, round], i) => (
            <div key={i} className={`absolute w-10 h-10 border-[#69A20D] ${pos} ${round} shadow-[0_0_12px_rgba(105,162,13,0.6)]`} />
          ))}

          <motion.div
            className="absolute left-3 right-3 h-0.5 bg-gradient-to-r from-transparent via-[#69A20D] to-transparent shadow-[0_0_15px_#69A20D]"
            animate={{ top: ["8%", "92%", "8%"] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="absolute inset-0 flex items-center justify-center opacity-80 pointer-events-none">
            <MascotSVG size={64} animate />
          </div>
        </div>
      </div>

      <div className="relative z-10 px-6 pb-10">
        <div className="flex items-center justify-between max-w-xs mx-auto">
          <div className="w-12 h-12" />

          {cameraActive ? (
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={handleLiveCapture}
              className="w-20 h-20 rounded-full bg-white/20 p-1 flex items-center justify-center shadow-2xl relative border border-white/40"
            >
              <div className="w-16 h-16 rounded-full bg-[#23351F] border-2 border-white flex items-center justify-center shadow-inner">
                <Camera size={26} className="text-[#CAE5B1]" />
              </div>
              {scanning && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-[#69A20D]"
                  animate={{ scale: [1, 1.35], opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                />
              )}
            </motion.button>
          ) : (
            <label
              htmlFor="shutter-camera-input"
              className="w-20 h-20 rounded-full bg-white/20 p-1 flex items-center justify-center shadow-2xl relative border border-white/40 cursor-pointer active:scale-95 transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-[#23351F] border-2 border-white flex items-center justify-center shadow-inner">
                <Camera size={26} className="text-[#CAE5B1]" />
              </div>
            </label>
          )}
          <input
            id="shutter-camera-input"
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />

          <label
            htmlFor="upload-gallery-input"
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/20 group-active:border-[#69A20D] transition-all">
              <Image size={20} className="text-white" />
            </div>
            <span className="text-white/70 text-[10px] font-bold">Upload</span>
          </label>
          <input
            id="upload-gallery-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
}

