export default function Home() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Welcome to ToolitHub</h2>
      <p className="text-lg text-muted-foreground mb-6">
        A comprehensive collection of essential utilities for everyone. All tools work 100% in your browser - no backend, no data collection, works offline!
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Password Tools</h3>
          <p className="text-sm text-muted-foreground">
            Generate secure passwords and check their strength
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Text Utilities</h3>
          <p className="text-sm text-muted-foreground">
            Count words, format JSON, and process text efficiently
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Converters & Generators</h3>
          <p className="text-sm text-muted-foreground">
            Convert units and generate QR codes instantly
          </p>
        </div>
      </div>
    </div>
  );
}
