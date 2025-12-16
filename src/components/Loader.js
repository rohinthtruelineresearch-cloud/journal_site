import { ThreeDot } from "react-loading-indicators";

export default function Loader({ overlay = false }) {
  const content = (
      <ThreeDot variant="bounce" color="#2ec12e" size="large" text="Aurora Journal of Systems Engineering" textColor="#87d675" />
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return <div className="flex min-h-[50vh] items-center justify-center">{content}</div>;
}
