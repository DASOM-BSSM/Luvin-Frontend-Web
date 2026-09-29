import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import OkMallangBText from '@/src/components/ui/ok-mallang-b-text';
import { display } from '@/src/constants/typography';

/** `Heading/H1`~`H5`, `Body/XL`~`XXS`, `display-*`(Ok Mallang B 전용, 테두리 있음 — §8) */
export type TextVariant =
  | 'heading-h1'
  | 'heading-h2'
  | 'heading-h3'
  | 'heading-h4'
  | 'heading-h5'
  | 'body-xl'
  | 'body-l'
  | 'body-m'
  | 'body-s'
  | 'body-xs'
  | 'body-xxs'
  | 'display-title'
  | 'display-score';

const VARIANT_CLASS: Record<Exclude<TextVariant, 'display-title' | 'display-score'>, string> = {
  'heading-h1': 'font-yde-street-b text-heading-h1',
  'heading-h2': 'font-yde-street-b text-heading-h2',
  'heading-h3': 'font-yde-street-b text-heading-h3',
  'heading-h4': 'font-yde-street-b text-heading-h4',
  'heading-h5': 'font-yde-street-b text-heading-h5',
  'body-xl': 'font-yde-street-l text-body-xl',
  'body-l': 'font-yde-street-l text-body-l',
  'body-m': 'font-yde-street-l text-body-m',
  'body-s': 'font-yde-street-l text-body-s',
  'body-xs': 'font-yde-street-l text-body-xs',
  'body-xxs': 'font-yde-street-l text-body-xxs',
};

interface TextProps extends RNTextProps {
  variant?: TextVariant;
}

/**
 * `display-title`/`display-score`는 Figma에 테두리(stroke)가 박혀 있어(디자인 QA 재확인)
 * 일반 RNText로 표현할 수 없다 — `OkMallangBText`에 위임하고, `display.*` 토큰의 fill/stroke를
 * 그대로 쓴다(호출부는 색을 지정하지 않는다 — 두 variant 모두 색이 고정이라 §8 예외 범위).
 */
export default function Text({ variant = 'body-m', className, style, children, ...rest }: TextProps) {
  if (variant === 'display-title' || variant === 'display-score') {
    const token = variant === 'display-title' ? display.title : display.score;
    return (
      <OkMallangBText
        className={className}
        fontSize={token.fontSize}
        lineHeight={token.lineHeight}
        fill={token.fill}
        stroke={token.stroke.color}
        strokeWidth={token.stroke.width}
        textAlign="center"
      >
        {String(children)}
      </OkMallangBText>
    );
  }

  return (
    <RNText className={`${VARIANT_CLASS[variant]} ${className ?? ''}`} style={style} {...rest}>
      {children}
    </RNText>
  );
}
