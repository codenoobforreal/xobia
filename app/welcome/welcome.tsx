import { useState } from "react";

import { cn } from "~/utils";

export function Welcome() {
  const [count, setCount] = useState(0);
  return (
    <main className={cn("h-screen")}>
      <button
        data-testid="count"
        onClick={() => setCount((count) => count + 1)}
      >
        count:{count}
      </button>
    </main>
  );
}
