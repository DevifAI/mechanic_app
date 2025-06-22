// components/PMApprovalBadge.tsx

import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { getPMApprovalMessage, ApprovalStatus } from '../hooks/useApprovalSatusMessage';

type Props = {
  is_approve_pm: ApprovalStatus;
};

const PMApprovalBadge: React.FC<Props> = ({ is_approve_pm }) => {
  const message = getPMApprovalMessage(is_approve_pm);

  let color = '#999'; // default
  if (message.includes('Rejected')) color = '#e74c3c';
  else if (message.includes('Waiting')) color = '#f39c12';
  else if (message.includes('Approved')) color = '#27ae60';

  return <Text style={[styles.message, { color }]}>{message}</Text>;
};

const styles = StyleSheet.create({
  message: {
    fontWeight: '600',
    fontSize: 14,
    marginTop: 4,
    fontStyle: 'italic',
  },
});

export default PMApprovalBadge;
