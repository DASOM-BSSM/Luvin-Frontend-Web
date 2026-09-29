import { useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';

import ChevronDownIcon from '@/src/assets/icons/ChevronDownIcon';
import Text from '@/src/components/ui/text';

/** 고를 수 있는 항목 하나. */
export interface DropdownOption {
  /** 고른 것을 가리키는 키. */
  id: string;
  /** 목록과 필드에 보이는 글자. */
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  /** 아직 고르지 않았으면 undefined. */
  selectedId?: string;
  /** 고르기 전에 필드에 흐리게 보이는 글자. */
  placeholder: string;
  onSelect: (optionId: string) => void;
}

interface DropdownOptionRowProps {
  option: DropdownOption;
  selected: boolean;
  /** 누른 항목의 id 를 돌려준다. 목록에서 익명 함수를 만들지 않으려고 여기서 감싼다(§16). */
  onPress: (optionId: string) => void;
}

/** 목록의 한 줄. 고른 것은 바탕이 연하게 들어온다. */
function DropdownOptionRow({ option, selected, onPress }: DropdownOptionRowProps) {
  function handlePress() {
    onPress(option.id);
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      className={`w-full px-[16px] py-[12px] ${selected ? 'bg-pink-200' : ''}`}
      onPress={handlePress}
    >
      <Text variant="body-m" numberOfLines={1} className="text-text-primary">
        {option.label}
      </Text>
    </Pressable>
  );
}

/**
 * 목록에서 하나를 고르는 필드. Figma `Dropdown` (5482:1894) — 닫힌 필드(높이 50)만 시안에 있다.
 *
 * NOTE: 펼친 목록은 시안이 없고, 필드 아래에 붙이는 보통의 드롭다운으로는 만들 수 없었다.
 * 이 필드가 놓이는 러빈지옥 쪽지가 낮아서(300) 필드 아래 남는 자리가 110 남짓이라, 목록을
 * 흐름에 넣으면 쪽지 밖으로 제목과 버튼이 밀려 나가고, 띄워도 쪽지(overflow-hidden)가
 * 목록을 잘라 먹는다 — 둘 다 실기기에서 확인했다. 그래서 목록만 모달로 띄워 쪽지 밖으로
 * 꺼낸다. 시안이 생기면 이 부분만 맞추면 된다.
 *
 * 모달에는 supportedOrientations 를 꼭 넘긴다 — 가로로 잠긴 화면에서 빠뜨리면 iOS 가 죽는다
 * (InfernoNoteModal 주석 참고).
 */
export default function Dropdown({ options, selectedId, placeholder, onSelect }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selected = options.find(({ id }) => id === selectedId);

  function handleFieldPress() {
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
  }

  function handleOptionPress(optionId: string) {
    setIsOpen(false);
    onSelect(optionId);
  }

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        accessibilityLabel={selected?.label ?? placeholder}
        className="h-[50px] w-[295px] flex-row items-center gap-[8px] overflow-hidden rounded-[12px] border border-pink-300 px-[16px]"
        onPress={handleFieldPress}
      >
        <Text
          variant="body-m"
          numberOfLines={1}
          className={`flex-1 ${selected ? 'text-text-primary' : 'text-text-muted'}`}
        >
          {selected?.label ?? placeholder}
        </Text>
        <ChevronDownIcon />
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={handleClose}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${placeholder} 닫기`}
          className="flex-1 items-center justify-center bg-default-black/30"
          onPress={handleClose}
        >
          {/* 안쪽을 눌렀을 때 닫히지 않도록 이벤트를 여기서 멈춘다. */}
          <Pressable className="max-h-[240px] w-[295px] overflow-hidden rounded-[12px] border border-pink-300 bg-default-white">
            <ScrollView>
              {options.map((option) => (
                <DropdownOptionRow
                  key={option.id}
                  option={option}
                  selected={option.id === selectedId}
                  onPress={handleOptionPress}
                />
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
