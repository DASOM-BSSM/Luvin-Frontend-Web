import { usePathname } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { setStatusBarHidden } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';

/**
 * 가로로 봐야 하는 라우트. 여기 해당하면 화면을 눕히고 상태바를 숨긴다.
 *
 * 러빈지옥은 에피소드 전체가 가로 전용이라 접두사로 묶는다.
 */
const LANDSCAPE_PREFIXES = ['/inferno'];

/**
 * 지금 보고 있는 경로에 맞춰 화면 방향과 상태바를 맞춘다. 루트 레이아웃에서 한 번만 부른다.
 *
 * 화면이나 레이아웃에 각각 걸지 않고 경로 하나만 보고 판단하는 이유:
 * - 화면마다 걸면 같은 가로 묶음 안에서 이동할 때 떠나는 화면이 먼저 세로로 되돌려서 번쩍인다.
 * - 묶음 레이아웃에 걸면 포커스/마운트 시점이 진입 경로(딥링크 여부)에 따라 달라져
 *   어떤 경로로 들어오면 잠금이 아예 안 걸렸다.
 * 경로는 그때그때 화면과 항상 일치하므로 이런 타이밍 문제가 없다.
 *
 * 같은 묶음 안에서 경로만 바뀔 때는 잠글 방향이 그대로라 화면에 아무 변화가 없다.
 *
 * app.json 의 `orientation` 이 "portrait" 가 아니라 "default" 인 이유도 여기에 있다.
 * iOS 는 앱이 지원한다고 선언하지 않은 방향으로는 잠글 수 없어서, 세로 고정을 app.json 에서
 * 빼고 이 훅으로 옮겼다.
 */
export default function useLandscapeRoutes() {
  const pathname = usePathname();

  useEffect(() => {
    if (Platform.OS === 'web') {
      return;
    }

    const isLandscape = LANDSCAPE_PREFIXES.some((prefix) => pathname.startsWith(prefix));

    void ScreenOrientation.lockAsync(
      isLandscape
        ? ScreenOrientation.OrientationLock.LANDSCAPE
        : ScreenOrientation.OrientationLock.PORTRAIT_UP,
    );
    setStatusBarHidden(isLandscape, 'fade');
  }, [pathname]);
}
