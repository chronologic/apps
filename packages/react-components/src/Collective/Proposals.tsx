// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedCollectiveProposal } from '@polkadot/api-derive/types';
// import { AccountId, Balance } from '@polkadot/types/interfaces';
import { CollectiveProps as Props } from './types';

import React from 'react';
import { Button, Table } from '@polkadot/react-components';
import { useTranslation } from '../translate';

import Propose from './Propose';
import Proposal from './Proposal';
import Slashing from './Slashing';

export default function Proposals ({ className, collective, isMember = false, memberCount = 0, proposals }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const isCouncil = collective === 'council';

  return (
    <div className={className}>
      <Button.Group>
        <Propose
          collective={collective}
          isMember={isMember}
          memberCount={memberCount}
        />
        {isCouncil && (
          <>
            <Button.Or />
            <Slashing isMember={isMember} />
          </>
        )}
      </Button.Group>
      {proposals?.length
        ? (
          <Table>
            <Table.Body>
              {proposals?.map((proposal: DerivedCollectiveProposal): React.ReactNode => (
                <Proposal
                  collective={collective}
                  isMember={isMember}
                  proposal={proposal}
                  key={proposal.hash.toHex()}
                />
              ))}
            </Table.Body>
          </Table>
        )
        : (collective === 'council' ? t('No council motions') : t('No technical committee proposals'))
      }
    </div>
  );
}
