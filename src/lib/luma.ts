export function parseLumaUrl(input: string | undefined): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (trimmed.startsWith("evt-")) return `https://lu.ma/event/${trimmed}`;
  const urlMatch = trimmed.match(/(https:\/\/(?:lu\.ma|luma\.com)[^\s"']+)/);
  if (urlMatch) {
    return urlMatch[1].replace("luma.com", "lu.ma");
  }
  return trimmed;
}

export function initLumaCheckout() {
  if (typeof window === "undefined") return;

  const init = () => {
    const w = window as any;
    if (w.luma && typeof w.luma.initCheckout === "function") {
      try {
        w.luma.initCheckout();
      } catch (err) {
        console.error("Failed to run Luma initCheckout:", err);
      }
    }
  };

  // If already loaded and initialized, just run it
  const w = window as any;
  if (w.luma?.initCheckout) {
    init();
    return;
  }

  // Check if script tag is already there
  let script = document.getElementById("luma-checkout") as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement("script");
    script.id = "luma-checkout";
    script.src = "https://embed.lu.ma/checkout-button.js";
    script.async = true;
    document.body.appendChild(script);
  }

  // Listen for load
  script.addEventListener("load", () => {
    setTimeout(init, 50);
  });

  // Just in case, poll a few times
  let attempts = 0;
  const interval = setInterval(() => {
    attempts++;
    if (w.luma?.initCheckout) {
      init();
      clearInterval(interval);
    } else if (attempts > 20) {
      clearInterval(interval);
    }
  }, 100);
}
