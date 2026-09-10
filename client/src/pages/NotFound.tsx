import { AlertCircle, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
 const navigate = useNavigate();

 const handleGoHome = () => {
 navigate("/");
 };

 return (
 <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
 <div className="mx-4 w-full max-w-lg border-0 bg-white/80 text-center shadow-lg backdrop-blur-sm">
 <div className="pb-8 pt-8">
 <div className="flex justify-center mb-6">
 <div className="relative">
 <div className="absolute inset-0 bg-red-100 rounded-none animate-pulse" />
 <AlertCircle className="relative h-16 w-16 text-red-500" />
 </div>
 </div>

 <h1 className="text-4xl font-bold text-[#164E63] mb-2">404</h1>

 <h2 className="text-xl font-semibold text-[#164E63] mb-4">
 Page Not Found
 </h2>

 <p className="text-[#164E63]/70 mb-8 leading-relaxed">
 Sorry, the page you are looking for doesn't exist.
 <br />
 It may have been moved or deleted.
 </p>

 <div className="flex flex-col sm:flex-row gap-3 justify-center">
 <button
 onClick={handleGoHome}
 className="bg-[#059669] hover:bg-[#059669] text-white px-6 py-2.5 rounded-none transition-all duration-200 shadow-md hover:shadow-lg"
 >
 <Home className="w-4 h-4 mr-2" />
 Go Home
 </button>
 </div>
 </div>
 </div>
 </div>
 );
}
