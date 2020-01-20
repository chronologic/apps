// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ModalState, TxSource, TxProps, TxState } from './types';

import useModal from './useModal';
import useTx from './useTx';

export default function useTxModal (memoFn: (...args: any[]) => TxSource, memoArr: any[] = [], { isOpen, onOpen, onClose, ...props }: TxProps & Pick<ModalState, any> = {}): TxState & ModalState {
  const modalState = useModal(isOpen, onOpen, onClose);
  const txState = useTx(memoFn, memoArr, props);
  return {
    ...modalState,
    ...txState,
    sendTx: (): void => {
      modalState.onClose();
      txState.sendTx();
    }
  };
}
