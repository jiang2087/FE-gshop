"use client"


export default function ForbiddenPage() {
   return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 px-6">
      <div className="relative w-full max-w-md text-center">
        
        {/* Glow background */}
        <div className="absolute inset-0 -z-10 blur-3xl opacity-30 bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 rounded-full"></div>

        {/* Card */}
        <div className="rounded-2xl bg-white/80 backdrop-blur shadow-xl p-8 border border-gray-200">
          
          {/* Icon */}
          <div className="text-6xl mb-4 animate-pulse">🚫</div>

          {/* Code */}
          <h1 className="text-5xl font-extrabold text-gray-900">403</h1>

          {/* Title */}
          <h2 className="mt-2 text-xl font-semibold text-gray-700">
            Access Denied
          </h2>

          {/* Description */}
          <p className="mt-3 text-gray-500 leading-relaxed">
            You don’t have permission to access this page.<br />
            Please check your account or contact the administrator.
          </p>

          {/* Actions */}
          <div className="mt-6 flex justify-center gap-3">
            <a
              href="/"
              className="px-5 py-2.5 rounded-lg bg-black text-white text-sm hover:bg-gray-800 transition"
            >
              Go Home
            </a>

            <button
              onClick={() => history.back()}
              className="px-5 py-2.5 rounded-lg border text-sm hover:bg-gray-100 transition"
            >
              Go Back
            </button>
          </div>

          {/* Footer */}
          <p className="mt-6 text-xs text-gray-400">
            Error code: 403 Forbidden
          </p>
        </div>
      </div>
    </main>
  );
}
