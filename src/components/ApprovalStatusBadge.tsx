// components/ApprovalStatusBadge.tsx

import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { getApprovalStatusMessage, ApprovalStatus } from '../hooks/useApprovalSatusMessage';

type Props = {
  is_approve_mic: ApprovalStatus;
  is_approve_sic: ApprovalStatus;
  is_approve_pm: ApprovalStatus;
};

const ApprovalStatusBadge: React.FC<Props> = ({
  is_approve_mic,
  is_approve_sic,
  is_approve_pm,
}) => {
  const message = getApprovalStatusMessage(is_approve_mic, is_approve_sic, is_approve_pm);

  let color = '#999'; // Default gray
  if (message.includes('Rejected')) color = '#e74c3c'; // Red
  else if (message.includes('Waiting')) color = '#f39c12'; // Orange
  else if (message.includes('Approved')) color = '#27ae60'; // Green

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

export default ApprovalStatusBadge;
