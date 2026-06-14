import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { KEYS, usePersistentState } from '@/shared/lib/persistent-state';
import { CORE_VARS, DEFAULT_VARS } from '@/shared/lib/tokens';
import { VarsContext, type VarsContextValue } from '@/shared/lib/contexts';
import type { VarsState } from '@/shared/types';
import { VarsEditorModal } from '@/app/layout/GlobalVars';

interface Props {
  children: ReactNode;
}

export const VarsProvider = ({ children }: Props) => {
  const [varsState, setVarsState] = usePersistentState<VarsState>(KEYS.vars, { values: DEFAULT_VARS, custom: [] });
  const values = useMemo(() => varsState.values || {}, [varsState.values]);
  const customVars = varsState.custom || [];

  const setVar = useCallback(
    (name: string, value: string) =>
      setVarsState((state) => ({ ...state, values: { ...state.values, [name]: value } })),
    [setVarsState],
  );
  const addCustom = useCallback(
    (name: string) =>
      setVarsState((state) =>
        state.custom.includes(name) || (CORE_VARS as readonly string[]).includes(name)
          ? state
          : { ...state, custom: [...state.custom, name], values: { ...state.values, [name]: '' } },
      ),
    [setVarsState],
  );
  const removeCustom = useCallback(
    (name: string) =>
      setVarsState((state) => {
        const nextValues = { ...state.values };
        delete nextValues[name];
        return { ...state, custom: state.custom.filter((entry) => entry !== name), values: nextValues };
      }),
    [setVarsState],
  );

  // Editor-modal open state lives with the vars it edits; openEditor is exposed on
  // the context so click-to-edit tokens anywhere in the tree can open it.
  const [editor, setEditor] = useState<{ open: boolean; focus: string | null }>({ open: false, focus: null });
  const openEditor = useCallback((name?: string) => setEditor({ open: true, focus: name || null }), []);

  const value = useMemo<VarsContextValue>(
    () => ({ vars: values, setVar, openEditor }),
    [values, setVar, openEditor],
  );

  return (
    <VarsContext.Provider value={value}>
      {children}
      <VarsEditorModal
        open={editor.open}
        focusVar={editor.focus}
        vars={values}
        setVar={setVar}
        customVars={customVars}
        addCustom={addCustom}
        removeCustom={removeCustom}
        onClose={() => setEditor({ open: false, focus: null })}
      />
    </VarsContext.Provider>
  );
}
