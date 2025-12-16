import React from 'react';

type TitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
};

export const Title: React.FC<TitleProps> = ({
  as: Component = 'h1',
  className = '',
  children,
  ...rest
}) => {
  const base = 'text-3xl font-bold';
  const cls = `${base} ${className}`.trim();
  return (
    <Component className={cls} {...rest}>
      {children}
    </Component>
  );
};
