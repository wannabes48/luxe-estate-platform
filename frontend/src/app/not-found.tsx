/* src/app/not-found.tsx */
import ReturnNavBar from "@/components/ReturnNavBar";

export default function NotFound() {
  return (
    <main className="h-screen flex items-center justify-center bg-[#FCFAFA] px-6">
      <ReturnNavBar />
      <div className="text-center">
        <span className="text-[10px] uppercase tracking-[0.6em] text-[#E91E63] font-bold mb-4 block">Error 404</span>
        <h1 className="font-serif text-6xl mb-8">Page Not Found</h1>
        <p className="text-stone-500 text-sm max-w-xs mx-auto italic mb-12">
          "The architecture of this URL does not exist in our current collection."
        </p>
      </div>
    </main>
  );
}