import { Linking } from 'react-native';
import { PrimaryButton } from '@/components/PrimaryButton';
import { CopingAction } from '@/types/smoking';

type CopingActionLinkButtonProps = {
  action: CopingAction;
};

export function CopingActionLinkButton({ action }: CopingActionLinkButtonProps) {
  const link = action.link;

  if (!link) {
    return null;
  }

  return <PrimaryButton label={link.label} onPress={() => void Linking.openURL(link.url)} variant="secondary" />;
}
