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

export function formatEventDateRange(startDateStr: string, endDateStr?: string, verbose = true): string {
  if (!startDateStr) return "";
  try {
    const startObj = new Date(startDateStr);
    const endObj = endDateStr ? new Date(endDateStr) : null;

    if (isNaN(startObj.getTime())) return startDateStr;

    const formatOptionsFull: Intl.DateTimeFormatOptions = verbose ? {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    } : {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };

    const formatOptionsShort: Intl.DateTimeFormatOptions = {
      weekday: verbose ? "long" : "short",
      month: verbose ? "long" : "short",
      day: "numeric",
    };

    if (endObj && !isNaN(endObj.getTime())) {
      if (startObj.toDateString() === endObj.toDateString()) {
        return startObj.toLocaleString("default", formatOptionsFull);
      } else {
        const startPart = startObj.toLocaleString("default", formatOptionsShort);
        const endPart = endObj.toLocaleString("default", verbose ? {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        } : {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        return `${startPart} - ${endPart}`;
      }
    }

    return startObj.toLocaleString("default", formatOptionsFull);
  } catch (e) {
    return startDateStr;
  }
}

export function formatShortDateRange(startDateStr: string, endDateStr?: string): string {
  if (!startDateStr) return "";
  try {
    const startObj = new Date(startDateStr);
    const endObj = endDateStr ? new Date(endDateStr) : null;
    if (isNaN(startObj.getTime())) return startDateStr;

    const startMonth = startObj.toLocaleString("default", { month: "short" });
    const startDay = startObj.getDate();

    if (endObj && !isNaN(endObj.getTime())) {
      if (startObj.toDateString() === endObj.toDateString()) {
        return `${startMonth} ${startDay}`;
      }
      const endMonth = endObj.toLocaleString("default", { month: "short" });
      const endDay = endObj.getDate();

      if (startMonth === endMonth) {
        return `${startMonth} ${startDay}-${endDay}`;
      } else {
        return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
      }
    }
    return `${startMonth} ${startDay}`;
  } catch {
    return startDateStr;
  }
}
