// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, ProposalIndex } from '@polkadot/types/interfaces';
import { TxSource } from '@polkadot/react-hooks/types';

import BN from 'bn.js';
import React, { useState } from 'react';
import { Button, Dropdown, InputNumber, Modal, TxAccount, TxActions } from '@polkadot/react-components';
import { useApi, useCall, useTxModal } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  isApproved?: boolean;
  proposalInfo?: React.ReactNode;
  proposalId: ProposalIndex;
}

export default function Approve ({ proposalId, proposalInfo = null }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const { t } = useTranslation();
  const options = [
    { text: t('Aye, I approve'), value: true },
    { text: t('Nay, I do not approve'), value: false }
  ];

  const memberCount = useCall<BN>(api.query.council.members, [], {
    transform: (value: AccountId[]): BN => {
      return new BN(1 + (value.length / 2));
    }
  }) || new BN(0);

  const _hasThreshold = (threshold: BN | null): boolean => !!threshold && threshold.gtn(0) && threshold.lte(memberCount);

  const [isApproving, setIsApproving] = useState(false);
  const [threshold, setThreshold] = useState<BN | null>(memberCount);

  const { isOpen, isSubmittable, onChangeAccountId, onClose, onOpen, sendTx } = useTxModal(
    (): TxSource => {
      const method = isApproving ? 'approveProposal' : 'rejectProposal';
      const response = api.tx.treasury[method](proposalId.toString());

      return {
        tx: api.tx.council.propose(threshold, response),
        isSubmittable: !!proposalId && _hasThreshold(threshold)
      };
    },
    [proposalId, threshold]
  );

  const _onChangeThreshold = (threshold?: BN): void =>
    setThreshold(threshold || null);

  return (
    <>
      <div className='ui--Row-buttons'>
        <Button.Group>
          <Button
            isPrimary
            label={t('Respond')}
            icon='reply'
            onClick={onOpen}
          />
        </Button.Group>
      </div>
      <Modal
        header={t('Approve or reject proposal')}
        open={isOpen}
        onClose={onClose}
        small
      >
        <Modal.Content>
          {proposalInfo}
          <TxAccount
            help={t('This account will be nominated to fill the council slot you specify.')}
            label={t('Candidate account')}
            onChange={onChangeAccountId}
          />
          <Dropdown
            help={t('Propose a majority council motion to either approve or reject this spend proposal')}
            label={t('proposed council action')}
            options={options}
            onChange={setIsApproving}
            value={isApproving}
          />
          <InputNumber
            className='medium'
            label={t('threshold')}
            help={t('The minimum number of council votes required to approve or reject this spend proposal')}
            isError={!_hasThreshold(threshold)}
            onChange={_onChangeThreshold}
            onEnter={sendTx}
            onEscape={onClose}
            placeholder={t('Positive number between 1 and {{memberCount}}', { replace: { memberCount } })}
            value={threshold || undefined}
          />
        </Modal.Content>
        <TxActions
          isSubmittable={isSubmittable}
          onCancel={onClose}
          onSend={sendTx}
        />
      </Modal>
    </>
  );
}
