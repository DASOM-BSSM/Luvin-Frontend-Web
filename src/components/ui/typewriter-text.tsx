import { useEffect, useRef, useState } from 'react';

import Text, { type TextVariant } from '@/src/components/ui/text';

/**
 * 한 글자가 더 나오기까지 걸리는 시간.
 *
 * 가장 긴 본문(구성 안내 88자)이 약 1.5초에 끝나도록 잡은 값이다.
 * 짧은 본문(진행 안내 54자)은 같은 속도로 약 0.9초에 끝난다.
 */
export const TYPEWRITER_SPEED_MS = 17;

interface TypewriterTextProps {
  text: string;
  variant?: TextVariant;
  className?: string;
  /** 한 글자당 시간(ms). 작을수록 빨리 쳐진다. */
  speedMs?: number;
  /** 첫 글자가 나오기 전 기다리는 시간(ms). */
  delayMs?: number;
  /** 다 쳐졌을 때 한 번 불린다. 뒤이어 다른 연출을 붙일 때 쓴다. */
  onDone?: () => void;
}

/**
 * 글자가 하나씩 쳐지듯 나타나는 문단.
 *
 * 쓰는 곳이 좌상단 정렬이라 줄이 아래로 늘어나도 자연스럽다. 가운데 정렬인 곳에 쓰면
 * 글자가 늘 때마다 좌우로 출렁이니 주의할 것.
 *
 * setInterval 대신 글자마다 setTimeout 을 새로 거는 이유: 끝나면 저절로 멈추고,
 * 중간에 화면을 벗어나도 정리가 단순하다.
 *
 * 완료를 글자 수 x 속도로 계산하지 않고 onDone 으로 알리는 이유: 글자마다 재렌더가 일어나서
 * 실제 속도가 명목치보다 느려진다. 계산값에 맞춰 뒤 연출을 걸면 타자가 끝나기도 전에 나온다.
 * onDone 은 ref 로 최신 콜백만 붙잡아 두고 한 번만 부른다. 의존성에 콜백을 넣으면 부모가
 * 상태를 바꿀 때마다 콜백 정체성이 달라져 effect 가 다시 도는 고리가 생긴다.
 */
export default function TypewriterText({
  text,
  variant = 'body-m',
  className,
  speedMs = TYPEWRITER_SPEED_MS,
  delayMs = 0,
  onDone,
}: TypewriterTextProps) {
  const [shownCount, setShownCount] = useState(0);
  const onDoneRef = useRef(onDone);
  const hasFiredRef = useRef(false);

  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    setShownCount(0);
    hasFiredRef.current = false;
  }, [text]);

  useEffect(() => {
    if (shownCount >= text.length) {
      if (!hasFiredRef.current) {
        hasFiredRef.current = true;
        onDoneRef.current?.();
      }
      return;
    }

    const timer = setTimeout(
      () => setShownCount(shownCount + 1),
      shownCount === 0 ? delayMs : speedMs,
    );

    return () => clearTimeout(timer);
  }, [shownCount, text.length, speedMs, delayMs]);

  return (
    <Text variant={variant} className={className}>
      {text.slice(0, shownCount)}
    </Text>
  );
}
