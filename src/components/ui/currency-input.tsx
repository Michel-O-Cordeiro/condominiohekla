import * as React from 'react';
import { Input } from './input';
import { formatCurrencyForInput, formatCurrencyInputFromUserInput } from '@/lib/utils';

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: number | string;
  onChange: (value: number) => void;
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, ...props }, ref) => {
    const [localValue, setLocalValue] = React.useState<string>('');
    
    // Sync localValue with external value when it changes
    React.useEffect(() => {
      if (Number(value) !== 0 || localValue === '') {
        setLocalValue(formatCurrencyForInput(value));
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { formatted, numeric } = formatCurrencyInputFromUserInput(e.target.value);
      setLocalValue(formatted);
      onChange(numeric);
    };

    return (
      <Input
        ref={ref}
        type="text"
        value={localValue}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';
