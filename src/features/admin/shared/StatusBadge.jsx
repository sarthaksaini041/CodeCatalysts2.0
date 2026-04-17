import React from 'react';

const statusStyles = {
  pending:  'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200',
};

const StatusBadge = ({ status }) => {
  const normalizedStatus = status || 'pending';
  const style = statusStyles[normalizedStatus] || statusStyles.pending;

  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
      {normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1)}
    </span>
  );
};

export default React.memo(StatusBadge);
