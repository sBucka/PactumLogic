import { Link } from "react-router-dom";
import type { TableAction } from "./GenericTable";

interface TableActionsProps<T> {
  action: TableAction<T>;
  item: T;
  keyExtractor: (item: T) => string | number;
}

const TableActions = <T,>({
  action,
  item,
  keyExtractor,
}: TableActionsProps<T>) => {
  const handleClick = () => {
    if (action.confirmMessage) {
      const message =
        typeof action.confirmMessage === "function"
          ? action.confirmMessage(item)
          : action.confirmMessage.replace("{item}", String(keyExtractor(item)));

      if (window.confirm(message)) {
        action.confirmAction?.(item);
      }
    } else {
      action.onClick?.(item);
    }
  };

  const buttonContent = (
    <>
      {action.icon && <span className='mr-1'>{action.icon}</span>}
      {action.label}
    </>
  );

  const className = action.className || "text-teal-600 hover:text-teal-900";

  if (action.href) {
    return (
      <Link to={action.href(item)} className={className}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={className}
      disabled={action.disabled}
    >
      {buttonContent}
    </button>
  );
};

export default TableActions;
