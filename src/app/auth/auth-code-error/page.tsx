import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <div className="text-error mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-error mb-2">
              Authentication Error
            </h1>

            <p className="text-base-content/70 mb-6">
              Sorry, there was an error during the authentication process. This
              could be due to:
            </p>

            <ul className="text-left text-base-content/70 mb-6 space-y-1">
              <li>• The authentication code expired</li>
              <li>• The authentication was cancelled</li>
              <li>• A network error occurred</li>
            </ul>

            <div className="space-y-3">
              <Link href="/login" className="btn btn-primary w-full">
                Try Again
              </Link>

              <Link href="/" className="btn btn-ghost w-full">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
