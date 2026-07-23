import Head from "next/head";
import {
  FormEvent,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import styles from "@/styles/BoostedReactions.module.scss";

type Reaction = {
  file: string;
  sourceFile: string;
  title: string;
  creator: string;
  sourceWork: string;
  year: string;
  institution: string;
  sourceUrl: string;
  rights: string;
};

type BoostedDrop = {
  id: string;
  content: string;
  boosts: number;
  author?: { handle?: string };
  wave?: { id?: string; name?: string };
};

type CuratedTweet = {
  id: string;
  text: string;
  likes: number;
};

type CaptionSource = {
  kind: "drop" | "tweet";
  id: string;
  content: string;
  authorHandle: string;
  url: string;
  label: string;
  engagement?: {
    count: number;
    type: "boosts" | "likes";
  };
};

type Pairing = {
  reaction: Reaction;
  source: CaptionSource;
  topText: string;
  bottomText: string;
  attributionVisible: boolean;
};

type EditSnapshot = Pick<
  Pairing,
  "topText" | "bottomText" | "attributionVisible"
>;

const ASSET_ROOT = "/boosted-reactions";
const BOOSTED_API_URL =
  "https://api.6529.io/api/v2/boosted-drops?page_size=300&sort=last_boosted_at&sort_direction=DESC";
const READABLE_CHARACTER = new RegExp("[\\p{L}\\p{N}]", "gu");

function randomItem<T>(items: T[]): T {
  const value = new Uint32Array(1);
  crypto.getRandomValues(value);
  return items[value[0] % items.length];
}

function differentItem<T>(
  items: T[],
  current: T,
  key: (item: T) => string,
): T {
  if (items.length < 2) return items[0];
  let candidate = randomItem(items);
  for (
    let index = 0;
    index < 12 && key(candidate) === key(current);
    index += 1
  ) {
    candidate = randomItem(items);
  }
  return candidate;
}

function cleanText(input = "", stripThreadNumber = false) {
  let text = input
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/@\[([^\]]+)\]/g, "@$1")
    .replace(/:[a-zA-Z0-9_+-]+:/g, " ")
    .replace(/[*_~`>#]/g, " ")
    .replace(/\\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (stripThreadNumber) text = text.replace(/^\d+\/\s*/, "");
  if (text.length <= 260) return text;
  const excerpt = text.slice(0, 257);
  const breakAt = excerpt.lastIndexOf(" ");
  return `${excerpt.slice(0, breakAt > 0 ? breakAt : 257)}…`;
}

function dropUrl(drop: BoostedDrop) {
  return drop.wave?.id
    ? `https://6529.io/waves/${drop.wave.id}?drop=${drop.id}`
    : `https://6529.io/?drop=${drop.id}`;
}

function dropSources(items: BoostedDrop[]) {
  return items
    .map((drop): CaptionSource => ({
      kind: "drop",
      id: drop.id,
      content: cleanText(drop.content),
      authorHandle: drop.author?.handle || "6529",
      url: dropUrl(drop),
      label: drop.wave?.name || "6529",
      engagement: {
        count: drop.boosts,
        type: "boosts",
      },
    }))
    .filter((source) => {
      const readable = source.content.match(READABLE_CHARACTER)?.length ?? 0;
      return source.content.length >= 8 && readable >= 5;
    });
}

function tweetSources(items: CuratedTweet[]) {
  return items
    .map((tweet): CaptionSource => ({
      kind: "tweet",
      id: tweet.id,
      content: cleanText(tweet.text, true),
      authorHandle: "punk6529",
      url: `https://x.com/punk6529/status/${tweet.id}`,
      label: "tweet",
      engagement: {
        count: tweet.likes,
        type: "likes",
      },
    }))
    .filter((source) => {
      const readable = source.content.match(READABLE_CHARACTER)?.length ?? 0;
      return source.content.length >= 8 && readable >= 5;
    });
}

function normalizeSource(source: CaptionSource) {
  return {
    ...source,
    content: cleanText(source.content, source.kind === "tweet"),
  };
}

function wrapLines(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.trim().split(/\s+/)) {
    const attempt = line ? `${line} ${word}` : word;
    if (context.measureText(attempt).width <= maxWidth || !line) line = attempt;
    else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function splitCaption(text: string) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return { top: "", bottom: text };
  context.font = "900 92px Arial, Helvetica, sans-serif";
  if (wrapLines(context, text, 1136).length <= 2) {
    return { top: "", bottom: text };
  }
  const words = text.split(/\s+/);
  const target = text.length / 2;
  let length = 0;
  let splitAt = 1;
  for (let index = 0; index < words.length - 1; index += 1) {
    length += words[index].length + 1;
    splitAt = index + 1;
    if (length >= target) break;
  }
  return {
    top: words.slice(0, splitAt).join(" "),
    bottom: words.slice(splitAt).join(" "),
  };
}

function stateFor(reaction: Reaction, source: CaptionSource): Pairing {
  const parts = splitCaption(source.content);
  return {
    reaction,
    source,
    topText: parts.top,
    bottomText: parts.bottom,
    attributionVisible: true,
  };
}

function sourceAttribution(source: CaptionSource) {
  const engagement = source.engagement;
  const metric = engagement
    ? `${engagement.count.toLocaleString("en-US")} ${
      engagement.count === 1
        ? engagement.type.slice(0, -1)
        : engagement.type
    }`
    : source.kind === "tweet" ? "tweet" : "drop";
  return {
    parts: [`@${source.authorHandle}`, source.label, metric],
    text: `@${source.authorHandle}  ·  ${source.label}  ·  ${metric}`,
  };
}

function friendlyRights(rights: string) {
  if (rights.includes("NOT_IN_COPYRIGHT")) {
    return "Public domain · Internet Archive: Not in Copyright";
  }
  if (rights.includes("Public Domain Mark 1.0")) {
    return "Creative Commons Public Domain Mark 1.0 · commercial reuse permitted";
  }
  return rights || "Public domain";
}

function artworkCreditSlug(reaction: Reaction) {
  const creator = `${reaction.creator} ${reaction.sourceFile}`.toLowerCase();
  const institution = reaction.institution.toLowerCase();
  let artist = "public-domain";
  if (creator.includes("le brun") || creator.includes("lebrun")) artist = "lebrun";
  else if (creator.includes("lavater")) artist = "lavater";
  else if (creator.includes("bell")) artist = "bell";
  else if (creator.includes("hollar")) artist = "hollar";
  else if (creator.includes("hogarth")) artist = "hogarth";
  else if (creator.includes("daumier")) artist = "daumier";
  else if (creator.includes("ribera")) artist = "ribera";
  else if (creator.includes("leonardo")) artist = "leonardo-school";

  let source = "archive";
  if (institution.includes("getty")) source = "getty";
  else if (institution.includes("countway")) source = "countway";
  else if (institution.includes("wellcome")) source = "wellcome";
  else if (institution.includes("metropolitan") || institution.includes("the met")) source = "met";
  return `${artist}-${source}`;
}

function canvasToPngBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (value) => value ? resolve(value) : reject(new Error("PNG creation failed")),
      "image/png",
    );
  });
}

function reactionImagePath(reaction: Reaction) {
  return `${ASSET_ROOT}/reactions/${reaction.file}`;
}

export default function BoostedReactions() {
  const posterRef = useRef<HTMLElement>(null);
  const topCaptionRef = useRef<HTMLDivElement>(null);
  const bottomCaptionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentImageRef = useRef<HTMLImageElement | null>(null);
  const reactionsRef = useRef<Reaction[]>([]);
  const sourcePoolsRef = useRef<{
    drops: CaptionSource[];
    tweets: CaptionSource[];
  }>({ drops: [], tweets: [] });
  const pairingRef = useRef<Pairing | null>(null);
  const historyRef = useRef<Pairing[]>([]);
  const historyIndexRef = useRef(-1);
  const editSnapshotRef = useRef<EditSnapshot | null>(null);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const swipeClickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const swipeBlockedClickRef = useRef(false);
  const preloadedPairingRef = useRef<Pairing | null>(null);
  const preloadedImageRef = useRef<HTMLImageElement | null>(null);

  const [pairing, setPairing] = useState<Pairing | null>(null);
  const [attributionVisible, setAttributionVisible] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [infoOpen, setInfoOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [sourceInput, setSourceInput] = useState("");
  const [sourceLoading, setSourceLoading] = useState(false);
  const [feedStatus, setFeedStatus] = useState("Loading artwork, drops and tweets");
  const [feedback, setFeedback] = useState<{ message: string; error: boolean } | null>(null);

  const showFeedback = useCallback((message: string, error = false) => {
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    setFeedback({ message, error });
    feedbackTimerRef.current = setTimeout(
      () => setFeedback(null),
      error ? 2600 : 1500,
    );
  }, []);

  const captionParts = useCallback(() => ({
    top: topCaptionRef.current?.innerText.trim() ?? "",
    bottom: bottomCaptionRef.current?.innerText.trim() ?? "",
  }), []);

  const fitOverlay = useCallback((element: HTMLDivElement | null) => {
    if (!element || element.hidden || !element.textContent?.trim() || !posterRef.current) return;
    const posterWidth = posterRef.current.clientWidth;
    const posterHeight = posterRef.current.clientHeight;
    const maximumHeight = posterHeight * 0.25;
    const wordCount = element.textContent.trim().split(/\s+/).length;
    const densityLimit = posterWidth * Math.min(0.13, 0.54 / Math.sqrt(Math.max(1, wordCount)));
    let low = 16;
    let high = Math.min(82, posterWidth * 0.13, densityLimit);
    let best = low;
    for (let index = 0; index < 9; index += 1) {
      const size = (low + high) / 2;
      element.style.fontSize = `${size}px`;
      if (
        element.scrollHeight <= maximumHeight &&
        element.scrollWidth <= element.clientWidth + 1
      ) {
        best = size;
        low = size;
      } else {
        high = size;
      }
    }
    element.style.fontSize = `${best}px`;
  }, []);

  const drawTextBlock = useCallback((
    context: CanvasRenderingContext2D,
    text: string,
    placement: "top" | "bottom",
  ) => {
    if (!text) return;
    const wordCount = text.trim().split(/\s+/).length;
    let fontSize = Math.min(92, 1200 * Math.min(0.078, 0.54 / Math.sqrt(Math.max(1, wordCount))));
    let lines: string[] = [];
    do {
      context.font = `900 ${fontSize}px Arial, Helvetica, sans-serif`;
      lines = wrapLines(context, text.toUpperCase(), 1144);
      if (lines.length * fontSize * 0.97 <= 375) break;
      fontSize -= 4;
    } while (fontSize > 30);
    const lineHeight = fontSize * 0.97;
    const blockHeight = lines.length * lineHeight;
    const startY = placement === "top" ? 150 : 1500 - 105 - blockHeight;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.lineJoin = "round";
    context.strokeStyle = "rgba(15,12,9,.96)";
    context.lineWidth = Math.max(8, fontSize * 0.105);
    context.fillStyle = "#fffaf0";
    lines.forEach((line, index) => {
      const y = startY + index * lineHeight + lineHeight / 2;
      context.strokeText(line, 600, y);
      context.fillText(line, 600, y);
    });
  }, []);

  const drawDownloadCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const image = currentImageRef.current;
    const current = pairingRef.current;
    if (!canvas || !image || !current) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    canvas.width = 1200;
    canvas.height = 1500;
    context.drawImage(image, 0, 0, 1200, 1500);

    const topGradient = context.createLinearGradient(0, 0, 0, 470);
    topGradient.addColorStop(0, "rgba(12,10,8,.67)");
    topGradient.addColorStop(1, "rgba(12,10,8,0)");
    context.fillStyle = topGradient;
    context.fillRect(0, 0, 1200, 470);
    const bottomGradient = context.createLinearGradient(0, 970, 0, 1500);
    bottomGradient.addColorStop(0, "rgba(12,10,8,0)");
    bottomGradient.addColorStop(1, "rgba(12,10,8,.82)");
    context.fillStyle = bottomGradient;
    context.fillRect(0, 970, 1200, 530);

    if (current.attributionVisible) {
      const attribution = sourceAttribution(current.source);
      context.font = "520 22px -apple-system, BlinkMacSystemFont, Arial, Helvetica, sans-serif";
      context.textAlign = "left";
      context.textBaseline = "middle";
      context.fillStyle = "rgba(255,250,240,.68)";
      context.shadowColor = "rgba(0,0,0,.7)";
      context.shadowBlur = 8;
      context.fillText(attribution.text, 46, 1468);
      context.shadowBlur = 0;
    }
    const parts = captionParts();
    drawTextBlock(context, parts.top, "top");
    drawTextBlock(context, parts.bottom, "bottom");
  }, [captionParts, drawTextBlock]);

  const randomPairingFor = useCallback((current: Pairing | null) => {
    const reactions = reactionsRef.current;
    const pools = sourcePoolsRef.current;
    const availablePools = [pools.drops, pools.tweets].filter((pool) => pool.length);
    if (!reactions.length || !availablePools.length) return null;
    const reaction = current
      ? differentItem(reactions, current.reaction, (item) => item.file)
      : randomItem(reactions);
    const pool = randomItem(availablePools);
    const source = current
      ? differentItem(pool, current.source, (item) => `${item.kind}:${item.id}`)
      : randomItem(pool);
    return stateFor(reaction, source);
  }, []);

  const preloadNextRandomPairing = useCallback((current: Pairing | null = pairingRef.current) => {
    const next = randomPairingFor(current);
    if (!next) return;
    preloadedPairingRef.current = next;
    const image = new Image();
    image.src = reactionImagePath(next.reaction);
    preloadedImageRef.current = image;
  }, [randomPairingFor]);

  const showPairing = useCallback((next: Pairing) => {
    pairingRef.current = next;
    setLoading(true);
    setPairing(next);
    setAttributionVisible(next.attributionVisible);
    setInfoOpen(false);
    setActionsOpen(false);
    requestAnimationFrame(() => preloadNextRandomPairing(next));
  }, [preloadNextRandomPairing]);

  const pushPairing = useCallback((next: Pairing) => {
    historyRef.current.push(next);
    historyIndexRef.current = historyRef.current.length - 1;
    showPairing(next);
  }, [showPairing]);

  const newPairing = useCallback(() => {
    const next = preloadedPairingRef.current || randomPairingFor(pairingRef.current);
    if (!next) return;
    preloadedPairingRef.current = null;
    preloadedImageRef.current = null;
    pushPairing(next);
  }, [pushPairing, randomPairingFor]);

  const newImageSameText = useCallback(() => {
    const current = pairingRef.current;
    if (!current || !reactionsRef.current.length) return;
    const cached = preloadedPairingRef.current;
    const reaction = cached?.reaction || differentItem(
      reactionsRef.current,
      current.reaction,
      (item) => item.file,
    );
    preloadedPairingRef.current = null;
    preloadedImageRef.current = null;
    const parts = captionParts();
    pushPairing({ ...current, reaction, topText: parts.top, bottomText: parts.bottom });
  }, [captionParts, pushPairing]);

  const newTextSameImage = useCallback(() => {
    const current = pairingRef.current;
    const pools = sourcePoolsRef.current;
    const availablePools = [pools.drops, pools.tweets].filter((pool) => pool.length);
    if (!current || !availablePools.length) return;
    const cached = preloadedPairingRef.current;
    const pool = randomItem(availablePools);
    const source = cached?.source || differentItem(
      pool,
      current.source,
      (item) => `${item.kind}:${item.id}`,
    );
    preloadedPairingRef.current = null;
    preloadedImageRef.current = null;
    pushPairing(stateFor(current.reaction, source));
  }, [pushPairing]);

  const previousPairing = useCallback(() => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    showPairing(historyRef.current[historyIndexRef.current]);
  }, [showPairing]);

  const nextPairing = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1;
      showPairing(historyRef.current[historyIndexRef.current]);
      return;
    }
    newPairing();
  }, [newPairing, showPairing]);

  const updateCurrentPairing = useCallback((patch: Partial<Pairing>) => {
    const current = pairingRef.current;
    if (!current) return;
    const next = { ...current, ...patch };
    pairingRef.current = next;
    historyRef.current[historyIndexRef.current] = next;
  }, []);

  const saveMeme = useCallback(async () => {
    const canvas = canvasRef.current;
    const current = pairingRef.current;
    if (!canvas || !current || !currentImageRef.current) return;
    drawDownloadCanvas();
    const blob = await canvasToPngBlob(canvas);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const id = String(current.source.id).slice(0, 8);
    link.download = `${artworkCreditSlug(current.reaction)}-meme-${id}.png`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
    showFeedback("Downloaded PNG");
  }, [drawDownloadCanvas, showFeedback]);

  const copyMeme = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !pairingRef.current || !currentImageRef.current) return;
    drawDownloadCanvas();
    try {
      const blob = await canvasToPngBlob(canvas);
      if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") {
        if (!navigator.clipboard?.writeText) {
          throw new Error("Clipboard unavailable");
        }
        await navigator.clipboard.writeText(canvas.toDataURL("image/png"));
        showFeedback("Copied PNG data");
        return;
      }
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      showFeedback("Copied image");
    } catch {
      showFeedback("Clipboard blocked", true);
    }
  }, [drawDownloadCanvas, showFeedback]);

  const buildFromSource = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = sourceInput.trim();
    if (!input || sourceLoading) return;
    setSourceLoading(true);
    try {
      const response = await fetch(`/api/memes/source?url=${encodeURIComponent(input)}`);
      const result = await response.json() as CaptionSource | { error?: string };
      if (!response.ok || !("kind" in result)) {
        throw new Error("error" in result ? result.error : "Source could not be read");
      }
      const source = normalizeSource(result);
      const readable = source.content.match(READABLE_CHARACTER)?.length ?? 0;
      if (source.content.length < 8 || readable < 5) {
        throw new Error("That source does not contain enough caption text");
      }
      const current = pairingRef.current;
      const reactions = reactionsRef.current;
      if (!reactions.length) throw new Error("Artwork is still loading");
      const reaction = current
        ? differentItem(reactions, current.reaction, (item) => item.file)
        : randomItem(reactions);
      preloadedPairingRef.current = null;
      preloadedImageRef.current = null;
      pushPairing(stateFor(reaction, source));
      setSourceInput("");
      setActionsOpen(false);
      showFeedback(source.kind === "tweet" ? "Built from tweet" : "Built from drop");
    } catch (error) {
      showFeedback(
        error instanceof Error ? error.message : "Source could not be read",
        true,
      );
    } finally {
      setSourceLoading(false);
    }
  }, [pushPairing, showFeedback, sourceInput, sourceLoading]);

  const canStartSwipe = useCallback((target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) return true;
    if (
      target.closest(`.${styles.actionMenuWrapper}`) ||
      target.closest(`.${styles.sourceHelp}`) ||
      target.closest(`.${styles.keyboardHelp}`)
    ) {
      return false;
    }
    if (target.isContentEditable || target.closest('[contenteditable="true"], a')) {
      return false;
    }
    const button = target.closest("button");
    return !button || button.classList.contains(styles.navigationZone);
  }, []);

  const blockSwipeClick = useCallback(() => {
    swipeBlockedClickRef.current = true;
    if (swipeClickTimerRef.current) clearTimeout(swipeClickTimerRef.current);
    swipeClickTimerRef.current = setTimeout(() => {
      swipeBlockedClickRef.current = false;
    }, 250);
  }, []);

  const onPosterPointerDown = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType !== "touch" || !canStartSwipe(event.target)) return;
    swipeStartRef.current = { x: event.clientX, y: event.clientY };
  }, [canStartSwipe]);

  const onPosterPointerUp = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    const start = swipeStartRef.current;
    swipeStartRef.current = null;
    if (event.pointerType !== "touch" || !start) return;

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const minimumSwipe = 46;
    const dominantAxis = 1.25;

    if (Math.max(absX, absY) < minimumSwipe) return;
    if (absX > absY * dominantAxis) {
      event.preventDefault();
      event.stopPropagation();
      blockSwipeClick();
      setActionsOpen(false);
      setHelpOpen(false);
      setInfoOpen(false);
      if (dx < 0) nextPairing();
      else previousPairing();
      return;
    }
    if (absY > absX * dominantAxis) {
      event.preventDefault();
      event.stopPropagation();
      blockSwipeClick();
      setActionsOpen(false);
      setHelpOpen(false);
      setInfoOpen(false);
      if (dy < 0) newImageSameText();
      else newTextSameImage();
    }
  }, [blockSwipeClick, newImageSameText, newTextSameImage, nextPairing, previousPairing]);

  const onPosterPointerCancel = useCallback(() => {
    swipeStartRef.current = null;
  }, []);

  const runNavigationAction = useCallback((
    event: ReactMouseEvent<HTMLButtonElement>,
    action: () => void,
  ) => {
    event.stopPropagation();
    event.currentTarget.blur();
    if (swipeBlockedClickRef.current) return;
    action();
  }, []);

  const abandonTextEdit = useCallback(() => {
    const snapshot = editSnapshotRef.current;
    if (!snapshot) return;
    if (topCaptionRef.current) topCaptionRef.current.innerText = snapshot.topText;
    if (bottomCaptionRef.current) bottomCaptionRef.current.innerText = snapshot.bottomText;
    updateCurrentPairing(snapshot);
    setAttributionVisible(snapshot.attributionVisible);
    editSnapshotRef.current = null;
    (document.activeElement as HTMLElement | null)?.blur();
    requestAnimationFrame(() => {
      fitOverlay(topCaptionRef.current);
      fitOverlay(bottomCaptionRef.current);
      drawDownloadCanvas();
    });
    showFeedback("Text edits discarded");
  }, [drawDownloadCanvas, fitOverlay, showFeedback, updateCurrentPairing]);

  const onCaptionFocus = useCallback(() => {
    const current = pairingRef.current;
    if (!current) return;
    editSnapshotRef.current = {
      topText: current.topText,
      bottomText: current.bottomText,
      attributionVisible: current.attributionVisible,
    };
  }, []);

  const onCaptionInput = useCallback((event: FormEvent<HTMLDivElement>) => {
    const parts = captionParts();
    updateCurrentPairing({
      topText: parts.top,
      bottomText: parts.bottom,
      attributionVisible: false,
    });
    setAttributionVisible(false);
    fitOverlay(event.currentTarget);
    drawDownloadCanvas();
  }, [captionParts, drawDownloadCanvas, fitOverlay, updateCurrentPairing]);

  const onCaptionKeyDown = useCallback((event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      abandonTextEdit();
    }
  }, [abandonTextEdit]);

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [reactionResponse, cacheResponse, tweetResponse] = await Promise.all([
          fetch(`${ASSET_ROOT}/reactions/index.json`),
          fetch(`${ASSET_ROOT}/drops-cache.json`),
          fetch(`${ASSET_ROOT}/punk6529-tweets.json`),
        ]);
        if (!reactionResponse.ok || !cacheResponse.ok || !tweetResponse.ok) {
          throw new Error("Local assets unavailable");
        }
        const reactions = await reactionResponse.json() as Reaction[];
        const cache = await cacheResponse.json() as { data?: BoostedDrop[] };
        const tweetCache = await tweetResponse.json() as { tweets?: CuratedTweet[] };
        const cachedDrops = dropSources(cache.data || []);
        const curatedTweets = tweetSources(tweetCache.tweets || []);
        if (cancelled) return;
        if (!reactions.length || (!cachedDrops.length && !curatedTweets.length)) {
          throw new Error("Local assets are empty");
        }
        reactionsRef.current = reactions;
        sourcePoolsRef.current = {
          drops: cachedDrops,
          tweets: curatedTweets,
        };
        setFeedStatus(
          `${cachedDrops.length} boosted drops · ${curatedTweets.length} curated @punk6529 tweets`,
        );
        newPairing();

        try {
          const controller = new AbortController();
          const timeout = window.setTimeout(() => controller.abort(), 10000);
          const liveResponse = await fetch(BOOSTED_API_URL, { signal: controller.signal });
          window.clearTimeout(timeout);
          if (!liveResponse.ok) throw new Error("Live feed unavailable");
          const live = await liveResponse.json() as { data?: BoostedDrop[] };
          const liveDrops = dropSources(live.data || []);
          if (liveDrops.length && !cancelled) {
            sourcePoolsRef.current = {
              drops: liveDrops,
              tweets: curatedTweets,
            };
            setFeedStatus(
              `${liveDrops.length} live boosted drops · ${curatedTweets.length} curated @punk6529 tweets`,
            );
          }
        } catch {
          if (!cancelled) {
            setFeedStatus(
              `${cachedDrops.length} cached drops · ${curatedTweets.length} curated @punk6529 tweets`,
            );
          }
        }
      } catch {
        if (!cancelled) {
          setLoading(false);
          setFeedStatus("Artwork could not be loaded");
          setInfoOpen(true);
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, [newPairing]);

  useEffect(() => {
    if (!pairing) return;
    if (topCaptionRef.current) topCaptionRef.current.innerText = pairing.topText;
    if (bottomCaptionRef.current) bottomCaptionRef.current.innerText = pairing.bottomText;
    requestAnimationFrame(() => {
      fitOverlay(topCaptionRef.current);
      fitOverlay(bottomCaptionRef.current);
    });

    let cancelled = false;
    const image = new Image();
    image.onload = () => {
      if (cancelled) return;
      currentImageRef.current = image;
      setImageUrl(image.src);
      setLoading(false);
      requestAnimationFrame(drawDownloadCanvas);
    };
    image.src = reactionImagePath(pairing.reaction);
    return () => { cancelled = true; };
  }, [drawDownloadCanvas, fitOverlay, pairing]);

  useEffect(() => {
    const onResize = () => {
      fitOverlay(topCaptionRef.current);
      fitOverlay(bottomCaptionRef.current);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [fitOverlay]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const active = document.activeElement as HTMLElement | null;
      const editing = active?.isContentEditable ?? false;
      const usingControl = active?.matches("button, a") ?? false;
      const typing = active?.matches("input, textarea, select") ?? false;
      const key = event.key.toLowerCase();

      if (event.key === "Escape") {
        if (editing) return;
        setHelpOpen(false);
        setInfoOpen(false);
        setActionsOpen(false);
        active?.blur();
        return;
      }
      if (editing || typing) return;
      if ((event.code === "Slash" || key === "?") && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        setInfoOpen(false);
        setHelpOpen((open) => !open);
        return;
      }
      if (key === "c" && (event.metaKey || event.ctrlKey) && !event.altKey) {
        event.preventDefault();
        void copyMeme();
        return;
      }
      if (event.code === "Space" && !usingControl) {
        event.preventDefault();
        newPairing();
      } else if ((event.code === "ArrowRight" || key === "d") && !usingControl) {
        event.preventDefault();
        nextPairing();
      } else if ((event.code === "ArrowLeft" || key === "a") && !usingControl) {
        event.preventDefault();
        previousPairing();
      } else if ((event.code === "Enter" || event.code === "ArrowDown" || key === "s") && !usingControl) {
        event.preventDefault();
        newTextSameImage();
      } else if ((event.code === "ArrowUp" || key === "w") && !usingControl) {
        event.preventDefault();
        newImageSameText();
      } else if (key === "c" && !usingControl) {
        event.preventDefault();
        void copyMeme();
      } else if (key === "v" && !usingControl) {
        event.preventDefault();
        void saveMeme();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [copyMeme, newImageSameText, newPairing, newTextSameImage, nextPairing, previousPairing, saveMeme]);

  useEffect(() => () => {
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    if (swipeClickTimerRef.current) clearTimeout(swipeClickTimerRef.current);
  }, []);

  const currentSourceUrl = pairing?.source.url || "https://6529.io";
  const currentAttribution = pairing
    ? sourceAttribution(pairing.source)
    : null;
  const sourceLinkLabel = pairing?.source.kind === "tweet"
    ? "Original tweet"
    : "Original drop";
  const creatorLine = pairing
    ? `${pairing.reaction.creator || "Unknown creator"}${pairing.reaction.year ? ` · ${pairing.reaction.year}` : ""}`
    : "";

  return (
    <>
      <Head>
        <title>Boosted Reactions — OM Pub</title>
        <meta name="description" content="Pair boosted 6529 drops and curated @punk6529 tweets with 167 public-domain reaction engravings." />
        <meta property="og:url" content="https://om.pub/memes/boosted" />
        <meta property="og:title" content="Boosted Reactions — OM Pub" />
        <meta property="og:description" content="Fresh words. Very old faces. A public-domain 6529 meme machine for drops and tweets." />
        <meta property="og:image" content="https://om.pub/om-pub-logo.png" />
      </Head>

      <main
        ref={posterRef}
        className={styles.poster}
        aria-label="Interactive public-domain reaction artwork"
        onClick={() => {
          if (swipeBlockedClickRef.current) return;
          setInfoOpen(false);
          setActionsOpen(false);
        }}
        onPointerDown={onPosterPointerDown}
        onPointerUp={onPosterPointerUp}
        onPointerCancel={onPosterPointerCancel}
      >
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className={styles.artwork} src={imageUrl} alt="Public-domain historical reaction engraving" />
        )}
        {loading && <span className={styles.loading} aria-label="Loading artwork" />}

        <nav className={styles.artworkNavigation} aria-label="Artwork navigation">
          <button
            className={`${styles.navigationZone} ${styles.previousZone}`}
            type="button"
            aria-label="Go back to the previous pairing"
            onClick={(event) => runNavigationAction(event, previousPairing)}
          />
          <button
            className={`${styles.navigationZone} ${styles.imageZone}`}
            type="button"
            aria-label="Show a new image with the same text"
            onClick={(event) => runNavigationAction(event, newImageSameText)}
          />
          <button
            className={`${styles.navigationZone} ${styles.nextZone}`}
            type="button"
            aria-label="Show the next pairing"
            onClick={(event) => runNavigationAction(event, nextPairing)}
          />
        </nav>

        <div
          ref={topCaptionRef}
          className={`${styles.memeCaption} ${styles.topCaption}`}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-label="Edit top caption"
          spellCheck
          hidden={!pairing?.topText}
          onClick={(event) => event.stopPropagation()}
          onFocus={onCaptionFocus}
          onBlur={() => { editSnapshotRef.current = null; }}
          onInput={onCaptionInput}
          onKeyDown={onCaptionKeyDown}
        />
        <div
          ref={bottomCaptionRef}
          className={`${styles.memeCaption} ${styles.bottomCaption}`}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-label="Edit bottom caption"
          spellCheck
          hidden={!pairing}
          onClick={(event) => event.stopPropagation()}
          onFocus={onCaptionFocus}
          onBlur={() => { editSnapshotRef.current = null; }}
          onInput={onCaptionInput}
          onKeyDown={onCaptionKeyDown}
        />

        <div className={styles.bottomControls}>
          <div
            className={`${styles.actionMenuWrapper} ${actionsOpen ? styles.actionMenuOpen : ""}`}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className={styles.actionMenuButton}
              type="button"
              aria-label="Open image actions"
              aria-haspopup="dialog"
              aria-expanded={actionsOpen}
              disabled={!pairing || loading}
              onClick={(event) => {
                event.currentTarget.blur();
                setInfoOpen(false);
                setActionsOpen((open) => !open);
              }}
            >
              <span aria-hidden="true">⋮</span>
            </button>
            <div
              className={styles.actionMenu}
              role="dialog"
              aria-label="Image and source actions"
            >
              <button
                type="button"
                disabled={!pairing || loading}
                onClick={() => { setActionsOpen(false); void saveMeme(); }}
              >
                Download PNG
              </button>
              <button
                type="button"
                disabled={!pairing || loading}
                onClick={() => { setActionsOpen(false); void copyMeme(); }}
              >
                Copy image
              </button>
              <form
                className={styles.sourceForm}
                aria-label="Build from a tweet or drop"
                onSubmit={buildFromSource}
              >
                <input
                  type="text"
                  inputMode="url"
                  aria-label="Tweet or 6529 drop URL"
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder={sourceLoading ? "Reading source…" : "Paste tweet or drop URL"}
                  value={sourceInput}
                  disabled={sourceLoading}
                  onChange={(event) => setSourceInput(event.target.value)}
                />
                <button className={styles.srOnly} type="submit">
                  Build meme from URL
                </button>
              </form>
            </div>
          </div>

          {pairing && currentAttribution && attributionVisible && (
            <a
              className={`${styles.dropMeta} ${pairing.source.kind === "tweet" ? styles.tweetMeta : ""}`}
              href={currentSourceUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
            >
              <span>{currentAttribution.parts[0]}</span>
              <span className={styles.metaDivider}>·</span>
              <span>{currentAttribution.parts[1]}</span>
              <span className={styles.metaDivider}>·</span>
              <span>{currentAttribution.parts[2]}</span>
            </a>
          )}

          <div
            className={`${styles.sourceHelp} ${infoOpen ? styles.sourceOpen : ""}`}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className={styles.infoButton}
              type="button"
              aria-label="Show artwork information"
              aria-expanded={infoOpen}
              onClick={() => { setHelpOpen(false); setInfoOpen((open) => !open); }}
            >
              i
            </button>
            {pairing && (
              <aside className={styles.sourceTooltip} role="tooltip">
                <span className={styles.tooltipEyebrow}>Artwork record</span>
                <strong>{pairing.reaction.title || "Historical reaction image"}</strong>
                <p className={styles.creatorLine}>{creatorLine}</p>
                <div className={styles.tooltipSection}>
                  <span className={styles.tooltipLabel}>Collection</span>
                  <p>{[pairing.reaction.sourceWork, pairing.reaction.institution].filter(Boolean).join(" · ")}</p>
                </div>
                <div className={styles.tooltipSection}>
                  <span className={styles.tooltipLabel}>Rights</span>
                  <p>{friendlyRights(pairing.reaction.rights)}</p>
                </div>
                <nav className={styles.tooltipLinks} aria-label="Artwork links">
                  <a href={pairing.reaction.sourceUrl} target="_blank" rel="noreferrer">Image source <span>↗</span></a>
                  <a href={currentSourceUrl} target="_blank" rel="noreferrer">{sourceLinkLabel} <span>↗</span></a>
                </nav>
                <p className={styles.feedStatus}>{feedStatus}</p>
                <p className={styles.tooltipHint}>Press ? or / for every keyboard shortcut.</p>
              </aside>
            )}
          </div>
        </div>

        {helpOpen && (
          <aside
            className={styles.keyboardHelp}
            role="dialog"
            aria-label="Keyboard shortcuts"
            onClick={(event) => event.stopPropagation()}
          >
            <header className={styles.keyboardHelpHeader}>
              <span>Keyboard</span>
              <button type="button" aria-label="Close keyboard shortcuts" onClick={() => setHelpOpen(false)}>×</button>
            </header>
            <dl className={styles.keyboardGrid}>
              <div><dt><kbd>A</kbd><kbd>←</kbd></dt><dd>Previous</dd></div>
              <div><dt><kbd>D</kbd><kbd>→</kbd></dt><dd>Next</dd></div>
              <div><dt><kbd>S</kbd><kbd>↓</kbd><kbd>↵</kbd></dt><dd>New words</dd></div>
              <div><dt><kbd>W</kbd><kbd>↑</kbd></dt><dd>New picture</dd></div>
              <div><dt><kbd>Space</kbd></dt><dd>New words + picture</dd></div>
              <div><dt><kbd>C</kbd><kbd>⌘/Ctrl C</kbd></dt><dd>Copy image</dd></div>
              <div><dt><kbd>V</kbd></dt><dd>Download PNG</dd></div>
              <div><dt><kbd>Esc</kbd></dt><dd>Cancel edit</dd></div>
              <div><dt><kbd>?</kbd><kbd>/</kbd></dt><dd>Toggle this guide</dd></div>
            </dl>
          </aside>
        )}

        {feedback && (
          <span
            className={`${styles.actionFeedback} ${feedback.error ? styles.feedbackError : ""}`}
            role="status"
            aria-live="polite"
          >
            {feedback.message}
          </span>
        )}

        <p className={styles.srOnly} aria-live="polite">{feedStatus}</p>
        <canvas ref={canvasRef} width="1200" height="1500" hidden />
      </main>
    </>
  );
}

BoostedReactions.hideFooter = true;
