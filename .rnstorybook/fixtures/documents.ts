import { Asset } from "expo-asset";
import { File } from "expo-file-system";
import { useEffect, useState } from "react";

import receiptPdf from "./receipt.pdf";
import receiptPng from "./receipt.png";
import reportPdf from "./report.pdf";

export const FIXTURES = { receiptPdf, receiptPng, reportPdf } as const;

export function useFixtureUri(fixture: number): string | null {
  const [uri, setUri] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    void Asset.fromModule(fixture)
      .downloadAsync()
      .then((asset) => {
        if (active) setUri(asset.localUri);
      });
    return () => {
      active = false;
    };
  }, [fixture]);
  return uri;
}

export function useFixtureBase64(fixture: number): string | null {
  const uri = useFixtureUri(fixture);
  const [base64, setBase64] = useState<string | null>(null);
  useEffect(() => {
    if (!uri) return;
    let active = true;
    void new File(uri).base64().then((content) => {
      if (active) setBase64(content);
    });
    return () => {
      active = false;
    };
  }, [uri]);
  return base64;
}
