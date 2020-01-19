// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedCollectiveProposals } from '@polkadot/api-derive/types';

export interface CollectiveProps {
  className?: string;
  collective: 'council' | 'technicalCommittee';
  isMember?: boolean;
  memberCount?: number;
  proposals?: DerivedCollectiveProposals;
}
