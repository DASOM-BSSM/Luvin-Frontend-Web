import { Pressable, View } from 'react-native';

import FolderIcon from '@/src/assets/icons/FolderIcon';
import BreadCharacter from '@/src/assets/images/BreadCharacter';
import Text from '@/src/components/ui/text';
import theme from '@/src/constants/theme';
import { findDoughFigure } from '@/src/features/inferno/constants/dough-figures';
import type { InfernoParticipant } from '@/src/features/inferno/types';

interface PersonalChatShortcutProps {
  label: string;
  /** 폴더 색. 시안이 바로가기마다 다르게 칠해 놨다(아래 주석 참고). */
  iconColor: string;
  /** 라벨 글자 색. 다 쓴 "다시 굽기" 만 흐려진다(시안 5467:5876). */
  labelClassName?: string;
  /** 넘기지 않으면 갈 곳이 없다는 뜻이라 눌러도 아무 일도 하지 않는다. */
  onPress?: () => void;
}

/**
 * 바로가기 하나. Figma `Frame 73`/`Frame 71` (5379:3575, 5379:3579, 5449:1740, 5449:1745).
 *
 * 폴더(60)와 글자(26)가 간격 없이 맞붙는다 — 시안의 묶음 높이가 86 이라 사이가 0 이다.
 */
function PersonalChatShortcut({
  label,
  iconColor,
  labelClassName = 'text-text-primary',
  onPress,
}: PersonalChatShortcutProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={!onPress}
      className="flex-col items-center"
      onPress={onPress}
    >
      <FolderIcon color={iconColor} />
      <Text variant="body-m" className={labelClassName}>
        {label}
      </Text>
    </Pressable>
  );
}

interface InfernoPersonalChatSidebarProps {
  /** 내 분신. 반죽 둘 중 왼쪽에 선다. */
  mine?: InfernoParticipant;
  /** 1:1 상대. 반죽 둘 중 오른쪽에 선다. */
  partner?: InfernoParticipant;
  /** "나의 빵에게" 를 눌렀을 때. */
  onFeedbackPress?: () => void;
  /**
   * "다시 굽기" 를 눌렀을 때. 넘기지 않으면 갈 곳이 없거나(ep2) 이미 다시 굽기를
   * 썼다는 뜻이라(ep4, 한 회차에 한 번만 쓸 수 있다) 폴더가 흐려지고 눌러도 아무 일도
   * 하지 않는다(시안 `다시굽기` 5467:5876).
   */
  onRebakePress?: () => void;
}

/**
 * 1:1 대화 화면 왼쪽. Figma `ep2-대화` (5379:3574, 5379:3583 왼쪽 묶음),
 * `ep4-대화` (5449:1735, 5449:1740 왼쪽 묶음).
 *
 * 시안 프레임(874x402 = 기준 기기 가로 좌표)의 자리를 그대로 옮겼다. 상하 바 51 씩을 뺀
 * 본문(874x300) 안에서:
 *
 * - 바로가기 묶음은 본문 위에서 25 에서 시작한다.
 * - 바로가기 둘은 x=102.5 를 축으로 가운데 정렬된다 — 폭 205 짜리 칸의 한가운데다.
 * - 반죽 둘은 바닥을 하단 바에 붙이고 서고, 소금빵이 x=67, 도넛이 x=185 에서 시작한다
 *   (소금빵 폭 107 + 사이 11 = 185).
 *
 * 남는 세로 공간은 바로가기와 반죽 사이에 몰아 둔다. 화면이 더 낮은 기기에서는 그 사이가
 * 먼저 줄어들고 위아래 붙은 것들은 시안 자리를 지킨다.
 *
 * NOTE: 폴더 색이 둘이 다르다 — "다시 굽기" 는 pink/400, "나의 빵에게" 는 pink/300 이다.
 * 시안 두 장이 서로 어긋나 있는데(`ep2-대화` 5379:3570, `ep4-대화` 5449:1735 는 둘 다
 * pink/400, `ep2-대화 끝` 5467:5564, `ep4-끝` 5467:5675 는 "나의 빵에게" 만 pink/300),
 * 나중에 그려진 쪽을 따랐다. 쪽마다 색이 달라질 이유가 없어 보여서 두 쪽 모두 같은 색으로 둔다.
 *
 * "다시 굽기" 를 다 쓰면(onRebakePress 를 넘기지 않으면) 폴더가 회색(default/gray)으로,
 * 글자가 반투명(rgba(29,29,29,0.5))으로 바뀐다(시안 5467:5876). ep2 처럼 다시 굽기 자체가
 * 아직 없는 회차도 같은 방식으로(onRebakePress 를 안 넘겨서) 흐려진 채로 둔다.
 *
 * 반죽 둘은 personDough(팔다리 있는 반죽)를 쓴다(BreadCharacter 주석 참고).
 */
export default function InfernoPersonalChatSidebar({
  mine,
  partner,
  onFeedbackPress,
  onRebakePress,
}: InfernoPersonalChatSidebarProps) {
  return (
    <View className="w-[384px] flex-col">
      <View className="h-[25px]" />

      <View className="w-[205px] flex-col items-center gap-[12px]">
        <PersonalChatShortcut
          label="다시 굽기"
          iconColor={onRebakePress ? theme.pink[400] : theme.default.gray}
          labelClassName={onRebakePress ? 'text-text-primary' : 'text-default-black/50'}
          onPress={onRebakePress}
        />
        <PersonalChatShortcut
          label="나의 빵에게"
          iconColor={theme.pink[300]}
          onPress={onFeedbackPress}
        />
      </View>

      <View className="flex-1" />

      <View className="flex-row items-end gap-[11px] pl-[67px]">
        {mine ? (
          <BreadCharacter
            type={mine.type}
            state="personDough"
            className={findDoughFigure(mine.type).chatSizeClass}
            accessibilityLabel={mine.name}
          />
        ) : null}
        {partner ? (
          <BreadCharacter
            type={partner.type}
            state="personDough"
            className={findDoughFigure(partner.type).chatSizeClass}
            accessibilityLabel={partner.name}
          />
        ) : null}
      </View>
    </View>
  );
}
