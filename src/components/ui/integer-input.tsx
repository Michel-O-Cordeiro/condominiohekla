import * as React from 'react';
import { Input } from './input';
import { formatInteger, parseInteger } from '@/lib/utils';

interface IntegerInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: number | string;
  onChange: (value: number) => void;
}

export const IntegerInput = React.forwardRef<HTMLInputElement, IntegerInputProps>(
  ({ value, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const num = parseInteger(e.target.value);
      onChange(num);
    };

    const formattedValue = value ? formatInteger(value) : '';

    return (
      <Input
        ref={ref}
        type="text"
        value={formattedValue}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

IntegerInput.displayName = 'IntegerInput';
