import { useEffect, useRef } from 'react';
import CarIcon from './CarIcon';
import type { EngineState } from '../../features/race/raceSlice';

const CAR_WIDTH_PX = 45;

function useDriveAnimation(
  trackRef: React.RefObject<HTMLDivElement | null>,
  wrapperRef: React.RefObject<HTMLSpanElement | null>,
  engine: EngineState,
) {
  const animationRef = useRef<Animation | null>(null);
  const { isDriving, hasMoved, velocity, distance, startedAt } = engine;

  useEffect(() => {
    const element = wrapperRef.current;
    const track = trackRef.current;
    if (!element || !track) {
      return undefined;
    }

    if (!hasMoved) {
      animationRef.current?.cancel();
      animationRef.current = null;
      return undefined;
    }

    if (isDriving && velocity > 0) {
      const durationMs = distance / velocity;
      const trackWidth = track.getBoundingClientRect().width;
      const targetX = Math.max(0, trackWidth - CAR_WIDTH_PX);
      animationRef.current?.cancel();
      animationRef.current = element.animate(
        [{ transform: 'translateX(0px)' }, { transform: `translateX(${targetX}px)` }],
        { duration: durationMs, easing: 'linear', fill: 'forwards' },
      );
      return undefined;
    }

    // Двигатель остановился (финиш или поломка) — замораживаем машину
    // именно на той точке, где она реально сейчас находится.
    const animation = animationRef.current;
    if (animation && startedAt) {
      animation.currentTime = Date.now() - startedAt;
      animation.pause();
    }
    return undefined;
  }, [trackRef, wrapperRef, isDriving, hasMoved, velocity, distance, startedAt]);
}

interface CarTrackProps {
  color: string;
  engine: EngineState;
}

export default function CarTrack({ color, engine }: CarTrackProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  useDriveAnimation(trackRef, wrapperRef, engine);

  return (
    <div ref={trackRef} className="relative my-1 h-8 border-b border-dashed border-border">
      <span ref={wrapperRef} className="absolute left-0 top-0 will-change-transform">
        <CarIcon color={color} />
      </span>
      <span className="absolute right-0 top-0 text-lg">🏁</span>
    </div>
  );
}
