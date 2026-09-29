/** @type {import('tailwindcss').Config} */

// 토큰 값(hex, px)은 src/constants 에만 둔다. 이 파일은 그것을 tailwind 에 연결만 한다.
// 색을 바꾸려면 src/constants/colors.ts 를, 크기를 바꾸려면 typography.ts 를 고칠 것.
//
// .js 인데 .ts 를 require 할 수 있는 이유: tailwind 의 loadConfig 가 평범한 require 로
// 먼저 시도하고, 실패하면 jiti(+sucrase)로 재시도하기 때문이다. 그래서 tailwind CLI 와
// metro 를 통해 로드될 때만 동작하고, node 로 이 파일을 직접 require 하면 실패한다.
const { colors } = require('./src/constants/colors');
const {
  tailwindFontFamily,
  tailwindFontSize,
  infernoMiniGameLayout,
} = require('./src/constants/typography');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors,
      fontFamily: tailwindFontFamily,
      fontSize: tailwindFontSize,
      width: infernoMiniGameLayout.width,
      height: infernoMiniGameLayout.height,
      spacing: infernoMiniGameLayout.spacing,
    },
  },
  plugins: [],
};
