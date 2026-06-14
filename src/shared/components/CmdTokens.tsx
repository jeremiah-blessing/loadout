import { Fragment } from 'react';
import { tokenize } from '@/shared/lib/tokens';
import { useVars } from '@/shared/lib/contexts';

interface Props {
  cmd: string;
}

export const CmdTokens = ({ cmd }: Props) => {
  const { vars, openEditor } = useVars();
  const segs = tokenize(cmd, vars);
  return (
    <>
      {segs.map((s, i) => {
        if (s.t === 'text') return <Fragment key={i}>{s.v}</Fragment>;
        return (
          <span
            key={i}
            className={'lo-tok ' + (s.filled ? 'lo-tok-filled' : 'lo-tok-empty')}
            onClick={(e) => {
              e.stopPropagation();
              openEditor(s.name);
            }}
            title={s.filled ? `${s.name} = ${s.value} · click to edit` : `Set ${s.name}`}
          >
            {s.filled ? s.value : '<' + s.name + '>'}
          </span>
        );
      })}
    </>
  );
}
