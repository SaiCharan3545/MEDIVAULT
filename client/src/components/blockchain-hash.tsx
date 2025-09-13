import { Card, CardContent } from "@/components/ui/card";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface BlockchainHashProps {
  hash: string;
}

export default function BlockchainHash({ hash }: BlockchainHashProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy hash:", err);
    }
  };

  return (
    <Card className="bg-card border border-border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <p className="blockchain-hash text-muted-foreground break-all pr-4" data-testid="text-blockchain-hash">
            {hash}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="flex-shrink-0"
            data-testid="button-copy-hash"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
