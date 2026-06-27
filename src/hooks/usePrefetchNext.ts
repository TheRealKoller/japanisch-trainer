import { useEffect } from "react";
import { prefetchAudio } from "../utils/voicevox";

export function usePrefetchNext(text: string | undefined): void {
  useEffect(() => {
    if (text) prefetchAudio(text);
  }, [text]);
}
