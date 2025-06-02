import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { CSVLink } from "react-csv";

const CSVExport = ({
  csvData,
  csvFilename,
}: {
  csvData: string[][];
  csvFilename: string;
}) => {
  return (
    <CSVLink
      data={csvData}
      filename={csvFilename}
      className='inline-flex items-center px-4 py-2 border border-teal-300 rounded-md shadow-sm text-sm font-medium text-teal-700 bg-white hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors'
    >
      <ArrowDownTrayIcon className='h-4 w-4 mr-2' />
      <span className='hidden sm:inline'>Export do CSV</span>
      <span className='sm:hidden'>CSV</span>
    </CSVLink>
  );
};

export default CSVExport;
