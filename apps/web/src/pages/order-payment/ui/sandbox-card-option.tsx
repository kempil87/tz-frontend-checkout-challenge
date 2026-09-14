import { cn } from '@/shared/lib';
import { Radio, Typography } from '@/shared/ui';

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
    <label
      className={cn(
        'flex cursor-pointer items-start gap-3 rounded-2xl p-3',
        'has-[[data-state=checked]]:bg-secondary',
      )}
      htmlFor={id}
    >
      <Radio checked={checked} id={id} onCheckedChange={onCheckedChange} value={value} />

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Typography as="span" className="break-words">
          {title}
        </Typography>

        <Typography as="span" className="break-words" tone="muted" variant="caption">
          {description}
        </Typography>
      </div>
    </label>
  );
};
