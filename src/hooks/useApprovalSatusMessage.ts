// utils/getApprovalStatusMessage.ts

export type ApprovalStatus = 'approved' | 'pending' | 'rejected';

export const getApprovalStatusMessage = (
  is_approve_mic: ApprovalStatus,
  is_approve_sic: ApprovalStatus,
  is_approve_pm: ApprovalStatus
): string => {
  if (is_approve_mic === 'rejected') return 'Rejected by Mechanic Incharge';
  if (is_approve_sic === 'rejected') return 'Rejected by Site Incharge';
  if (is_approve_pm === 'rejected') return 'Rejected by Project Manager';

  if (
    is_approve_mic === 'pending' &&
    is_approve_sic === 'pending' &&
    is_approve_pm === 'pending'
  )
    return 'Waiting for Mechanic Incharge Approval';

  if (
    is_approve_mic === 'approved' &&
    is_approve_sic === 'pending' &&
    is_approve_pm === 'pending'
  )
    return 'Waiting for Site Incharge Approval';

  if (
    is_approve_mic === 'approved' &&
    is_approve_sic === 'approved' &&
    is_approve_pm === 'pending'
  )
    return 'Waiting for Project Manager Approval';

  if (
    is_approve_mic === 'approved' &&
    is_approve_sic === 'approved' &&
    is_approve_pm === 'approved'
  )
    return 'Approved by all';

  return 'Approval in progress';
};

// 👇 NEW: Dedicated PM-only logic
export const getPMApprovalMessage = (is_approve_pm: ApprovalStatus): string => {
  switch (is_approve_pm) {
    case 'approved':
      return 'Approved by Project Manager';
    case 'pending':
      return 'Waiting for Project Manager Approval';
    case 'rejected':
      return 'Rejected by Project Manager';
    default:
      return 'PM Approval Status Unknown';
  }
};
