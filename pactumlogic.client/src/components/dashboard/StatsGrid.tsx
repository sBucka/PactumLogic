import { NavLink } from "react-router-dom";

interface StatItem {
  label: string;
  value: number;
  icon?: React.ReactNode;
  link?: string;
}

interface StatsGridProps {
  stats: StatItem[];
  className?: string;
}

const StatsGrid = ({ stats, className = "" }: StatsGridProps) => {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 ${className}`}
    >
      {stats.map((stat, index) => (
        <NavLink
          to={stat.link || "#"}
          key={index}
          className='bg-white p-4 lg:p-6 rounded-lg lg:rounded-xl shadow hover:shadow-md transition-shadow'
        >
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-gray-500 mb-2 text-sm lg:text-base'>
                {stat.label}
              </h3>
              <p className={`text-2xl lg:text-3xl font-bold `}>
                {stat.value.toLocaleString()}
              </p>
            </div>
            {stat.icon && (
              <div className={`text-2xl opacity-60`}>{stat.icon}</div>
            )}
          </div>
        </NavLink>
      ))}
    </div>
  );
};

export default StatsGrid;
