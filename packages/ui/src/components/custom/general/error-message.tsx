export function ErrorMessage() {
  return (
    <div className="p-4 rounded-lg bg-red-50 border border-red-200">
      <p className="text-red-700 mb-3 text-center">
        An unexpected error occurred. You can try refreshing the page.
      </p>
      <div className="flex justify-center">
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}
