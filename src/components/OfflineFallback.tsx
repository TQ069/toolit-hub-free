export default function OfflineFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="max-w-md text-center space-y-4">
        <div className="text-6xl mb-4">📡</div>
        <h1 className="text-3xl font-bold text-foreground">You're Offline</h1>
        <p className="text-muted-foreground">
          It looks like you've lost your internet connection. Some features may not be available until you're back online.
        </p>
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h2 className="font-semibold mb-2">Available Offline:</h2>
          <ul className="text-sm text-left space-y-1">
            <li>✓ Password Generator</li>
            <li>✓ Password Strength Checker</li>
            <li>✓ Word Counter</li>
            <li>✓ JSON Beautifier</li>
            <li>✓ Unit Converter</li>
          </ul>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
