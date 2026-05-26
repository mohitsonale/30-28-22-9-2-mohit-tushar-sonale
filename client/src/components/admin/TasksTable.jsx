import { deleteTask } from '../../api/tasks';

const STATUS_CLASS = {
  Open:      'status-badge-Open',
  Claimed:   'status-badge-Claimed',
  Submitted: 'status-badge-Submitted',
  Approved:  'status-badge-Approved',
  Rejected:  'status-badge-Rejected',
};

const TasksTable = ({ tasks, onEdit, onRefresh }) => {

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      onRefresh();
    } catch {
      alert('Failed to delete task');
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="py-16 text-center text-text-faint text-[15px]">
        No tasks found. Create your first task!
      </div>
    );
  }

  const thCls = 'text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.7px] text-text-faint border-b border-border whitespace-nowrap';
  const tdCls = 'px-5 py-4 border-b border-border align-top';

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-bg-surface">
            <th className={thCls}>Title</th>
            <th className={thCls}>Status</th>
            <th className={thCls}>Assigned To</th>
            <th className={thCls}>Due Date</th>
            
            <th className={thCls}>Created</th>
            <th className={thCls}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id} className="border-b border-border last:border-0 hover:bg-bg-hover transition-colors">

              {/* Title + description */}
              <td className={`${tdCls} max-w-[260px]`}>
                <span className="block font-medium text-text-primary mb-0.5">{task.title || '—'}</span>
                {task.description && (
                  <span className="block text-[12px] text-text-faint truncate max-w-[240px]">{task.description}</span>
                )}
              </td>

              {/* Status */}
              <td className={tdCls}>
                <span className={`inline-block px-2.5 py-[3px] rounded-full text-[12px] font-medium ${STATUS_CLASS[task.status] || 'status-badge-Open'}`}>
                  {task.status || '—'}
                </span>
              </td>

              {/* Assigned */}
              <td className={`${tdCls} whitespace-nowrap`}>
                {task.assignedTo ? (
                  <div className="flex items-center gap-2">
                    <div className="w-[26px] h-[26px] rounded-full btn-gradient flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                      {task.assignedTo.name?.[0]}
                    </div>
                    <span className="text-text-primary">{task.assignedTo.name}</span>
                  </div>
                ) : (
                  <span className="text-text-faint text-[13px]">Unassigned</span>
                )}
              </td>

              {/* Due date — raw string */}
              <td className={`${tdCls} text-text-muted text-[13px] whitespace-nowrap`}>
                {task.dueDate || '—'}
              </td>

              {/* Created — raw ISO */}
              <td className={`${tdCls} text-text-muted text-[13px] whitespace-nowrap`}>
                {task.createdAt}
              </td>

              {/* Actions */}
              <td className={tdCls}>
                <div className="flex gap-1.5">
                  <button onClick={() => onEdit(task)} title="Edit"
                    className="w-[30px] h-[30px] rounded-lg border-none bg-primary/10 text-primary hover:bg-primary/25 cursor-pointer flex items-center justify-center text-sm transition-colors">
                    ✎
                  </button>
                  <button onClick={() => handleDelete(task._id)} title="Delete"
                    className="w-[30px] h-[30px] rounded-lg border-none bg-danger/10 text-danger hover:bg-danger/20 cursor-pointer flex items-center justify-center text-sm transition-colors">
                    ✕
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TasksTable;
