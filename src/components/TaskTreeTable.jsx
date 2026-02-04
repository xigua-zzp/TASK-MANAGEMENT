import sampleData from '../sample-data.json';
import { transformTasksForTable } from '../lib/dataTransform';
import { TaskTable } from './AntdTaskTable';

function TaskTreeTable({ selectedTaskId, onSelectTask }) {
  const dataSource = transformTasksForTable(sampleData);

  return (
    <TaskTable
      dataSource={dataSource}
      onRow={(record) => ({
        onClick: () => onSelectTask(record.id === selectedTaskId ? null : record.id),
      })}
    />
  );
}

export default TaskTreeTable;
