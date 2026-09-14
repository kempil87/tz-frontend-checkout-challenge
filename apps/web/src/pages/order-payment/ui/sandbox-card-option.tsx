import { OptionRow, Radio } from '@/shared/ui';

type SandboxCardOptionProps = {
  checked: string;
  description: string;
  id: string;
  onCheckedChange: (value: unknown) => void;
  title: string;
  value: string;
};

export const SandboxCardOption = ({
  checked,
  description,
  id,
  onCheckedChange,
  title,
  value,
}: SandboxCardOptionProps) => {
  return (
    <OptionRow
      control={<Radio checked={checked} id={id} onCheckedChange={onCheckedChange} value={value} />}
      description={description}
      id={id}
      title={title}
    />
  );
};
