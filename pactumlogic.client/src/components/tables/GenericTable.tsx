import TableActions from "./TableActions";

export interface TableColumn<T> {
  header: string;
  accessor: (item: T) => React.ReactNode;
  className?: string;
}

export interface TableAction<T> {
  label: string;
  href?: (item: T) => string;
  onClick?: (item: T) => void;
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  confirmMessage?: string | ((item: T) => string);
  confirmAction?: (item: T) => void;
}

interface GenericTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
  className?: string;
}

const GenericTable = <T,>({
  data,
  columns,
  actions = [],
  keyExtractor,
  emptyMessage = "Žiadne dáta neboli nájdené",
  className = "",
}: GenericTableProps<T>) => {
  if (data.length === 0) {
    return (
      <div className='text-center py-8'>
        <p className='text-gray-500'>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                {column.header}
              </th>
            ))}
            {actions.length > 0 && (
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Akcie
              </th>
            )}
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {data.map((item) => (
            <tr key={keyExtractor(item)} className='hover:bg-gray-50'>
              {columns.map((column, index) => (
                <td
                  key={index}
                  className={`px-6 py-4 whitespace-nowrap ${
                    column.className || ""
                  }`}
                >
                  {column.accessor(item)}
                </td>
              ))}
              {actions.length > 0 && (
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                  <div className='flex space-x-2'>
                    {actions.map((action, index) => (
                      <TableActions
                        key={index}
                        action={action}
                        item={item}
                        keyExtractor={keyExtractor}
                      />
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GenericTable;
