"use client";

import { Replayer } from "@rrweb/replay";
import type { SessionPackage } from "@/types/recording";
import { NetworkReplayer } from "@/replay/network";

export interface ReplayHandle {
  replayer: Replayer;
  net: NetworkReplayer;
  destroy: () => void;
}

export function mountReplay(
  container: HTMLElement,
  pkg: SessionPackage,
): ReplayHandle {
  const net = new NetworkReplayer(pkg.networkEvents);
  net.install();

  const replayer = new Replayer(pkg.rrwebEvents as never, {
    root: container,
    speed: 1,
    showWarning: false,
    skipInactive: false,
  });

  return {
    replayer,
    net,
    destroy() {
      try {
        replayer.pause();
      } catch {
        /* ignore */
      }
      net.uninstall();
    },
  };
}