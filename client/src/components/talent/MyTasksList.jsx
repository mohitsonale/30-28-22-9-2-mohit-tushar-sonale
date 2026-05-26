import { useState } from 'react';
import SubmitTaskModal from './SubmitTaskModal';

const STATUS_CLASS = {
  Open:      'status-badge-Open',
  Claimed:   'status-badge-Claimed',
  Submitted: 'status-badge-Submitted',
  Approved:  'status-badge-Approved',
  Rejected:  'status-badge-Rejected',
};
const MyTasksList = ({ tasks, onRefresh }) => {
  const [submitTarget, setSubmitTarget] = useState(null);

  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-bg-card border border-dashed border-border rounded-xl py-10 px-6 text-center text-text-faint text-sm">
        You haven&apos;t claimed any tasks yet. Go grab one above!
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-2.5">
        {tasks.map((task) => (
          <div key={task._id}
            className="bg-bg-card border border-border rounded-lg px-5 py-4 flex items-center justify-between gap-4 hover:border-border-light transition-colors">

            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-text-primary truncate">{task.title || 'Untitled Task'}</p>
              
              <p className="text-[12px] text-text-faint mt-0.5">
                {task.dueDate ? `Due: ${task.dueDate}` : 'No due date set'}
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              {/* Submit button for Claimed or Submitted tasks */}
              
              {(task.status === 'Claimed' || task.status === 'Submitted') && (
                <button onClick={() => setSubmitTarget(task)}
                  className="px-3.5 py-1.5 rounded-full text-[12px] font-semibold cursor-pointer border font-sans transition-colors
                    bg-info/10 text-info border-info/30 hover:bg-info/20">
                  {task.status === 'Submitted' ? 'Re-submit' : 'Submit'}
                </button>
              )}

              {task.status ? (
                <span className={`inline-block px-2.5 py-[3px] rounded-full text-[11px] font-semibold ${STATUS_CLASS[task.status] || ''}`}>
                  {task.status}
                </span>
              ) : (
                <span className="inline-block px-2.5 py-[3px] rounded-full text-[11px] font-semibold"
                  style={{ background: '#2e2a4a', color: '#5e5a82', border: '1px solid #3a3660' }}>—</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {submitTarget && (
        <SubmitTaskModal
          task={submitTarget}
          onClose={() => setSubmitTarget(null)}
          onSubmitted={() => { setSubmitTarget(null); if (onRefresh) onRefresh(); }}
        />
      )}
    </>
  );
};

export default MyTasksList;
