import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export default function QrGenerator() {
  const [text, setText] = useState('');
  const [size, setSize] = useState(256);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    // Limit to 2,000 characters
    if (newText.length <= 2000) {
      setText(newText);
    }
  };

  useEffect(() => {
    if (text && canvasRef.current) {
      generateQRCode(text, size);
    }
  }, [text, size]);

  const generateQRCode = async (data: string, qrSize: number) => {
    try {
      // Use a QR code API service
      const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(data)}&format=png`;
      setQrDataUrl(apiUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;

    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">QR Code Generator</CardTitle>
          <CardDescription className="text-sm">
            Generate QR codes from text or URLs (up to 2,000 characters)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Text Input */}
          <div className="space-y-2">
            <Label htmlFor="qr-text">Text or URL</Label>
            <Textarea
              id="qr-text"
              value={text}
              onChange={handleTextChange}
              placeholder="Enter text or URL to generate QR code..."
              className="min-h-[120px]"
              maxLength={2000}
              aria-describedby="qr-char-count"
            />
            <p id="qr-char-count" className="text-xs text-muted-foreground text-right">
              {text.length} / 2,000 characters
            </p>
          </div>

          {/* Size Control */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="qr-size">QR Code Size</Label>
              <span className="text-sm font-medium">{size}px</span>
            </div>
            <Slider
              id="qr-size"
              min={128}
              max={512}
              step={64}
              value={size}
              onValueChange={(value) => setSize(value)}
              aria-label="QR code size in pixels"
            />
          </div>

          {/* QR Code Preview */}
          {text && qrDataUrl && (
            <div className="space-y-4">
              <Label>QR Code Preview</Label>
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-white rounded-lg shadow-md">
                  <img
                    src={qrDataUrl}
                    alt={`QR code for: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`}
                    width={size}
                    height={size}
                    className="block max-w-full h-auto"
                  />
                  <canvas ref={canvasRef} style={{ display: 'none' }} aria-hidden="true" />
                </div>
                <Button 
                  onClick={handleDownload} 
                  className="w-full sm:w-auto touch-manipulation min-h-[44px]"
                  aria-label="Download QR code as PNG image"
                >
                  📥 Download PNG
                </Button>
              </div>
            </div>
          )}

          {!text && (
            <div className="text-center py-8 sm:py-12 text-muted-foreground">
              <p className="text-base sm:text-lg">Enter text or URL above to generate QR code</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
