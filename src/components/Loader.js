import { ThreeDot } from "react-loading-indicators";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function Loader({ overlay = false, type = "default" }) {
  const content = type === "submission" ? (
    <div className="flex flex-col items-center gap-4">
      <div className="w-64 h-64">
        <DotLottieReact
          src="https://lottie.host/90a57db9-ec75-45b5-84f9-9fb284ab5011/6cBgXFtf3z.lottie"
          loop
          autoplay
        />
      </div>
      <p className="text-xl font-bold bg-gradient-to-r from-sky-600 to-sky-800 bg-clip-text text-transparent animate-pulse">
        Finalizing Your Submission...
      </p>
      <p className="text-sm text-slate-500">Please do not close this window</p>
    </div>
  ) : (
    <ThreeDot variant="bounce" color="#2ec12e" size="large" text="International Journal of AI-Driven Discovery" textColor="#87d675" />
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return <div className="flex min-h-[50vh] items-center justify-center">{content}</div>;
}
