import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer
} from "recharts";
import moment from "moment";

const SignupsChart = ({ onGrowthUpdate }) => {
    const [data, setData] = useState([]);

    const extendSignupDataUpToCurrentMonth = (signupData) => {
      const year = moment().year();
      const currentMonthIndex = moment().month(); // 0 = Jan, 11 = Dec
      const months = Array.from({ length: currentMonthIndex + 1 }, (_, i) =>
        moment().month(i).year(year).format("MMM YYYY")
    );

      return months.map(label => {
        const found = signupData.find(item => item.label === label);
        return found || { label, count: 0 };
      });
    };

    const addGrowthRates = (data) => {
      return data.map((entry, index) => {
        if (index === 0) return { ...entry, growth: 0, growthLabel: "→ 0%" };
    
        const prev = data[index - 1].count;
        const curr = entry.count;
    
        let growth, label;
    
        if (prev === 0 && curr > 0) {
          growth = 100;
          label = "↑ 100%+";
        } else if (prev === 0 && curr === 0) {
          growth = 0;
          label = "→ 0%";
        } else {
          const rawGrowth = ((curr - prev) / prev) * 100;
          growth = Math.round(rawGrowth);
          label = growth > 0 ? `↑ ${growth}%` : growth < 0 ? `↓ ${Math.abs(growth)}%` : "→ 0%";
        }
    
        return { ...entry, growth, growthLabel: label };
      });
    };

    useEffect(() => {
      const fetchStats = async () => {
        const res = await fetch("https://nusteals-express.onrender.com/api/users/user-signups");
        const raw = await res.json();

        const extended = extendSignupDataUpToCurrentMonth(raw);
        const withGrowth = addGrowthRates(extended);
        setData(withGrowth);

        // Get growth for current vs previous month
        const currentMonthLabel = moment().format("MMM YYYY");
        const previousMonthLabel = moment().subtract(1, "months").format("MMM YYYY");

        const currentMonth = withGrowth.find(d => d.label === currentMonthLabel);
        const previousMonth = withGrowth.find(d => d.label === previousMonthLabel);

        const growthRate = previousMonth?.count
          ? ((currentMonth?.count - previousMonth.count) / previousMonth.count) * 100
          : 0;

        const label = `${previousMonthLabel} → ${currentMonthLabel}`;

        if (typeof onGrowthUpdate === "function") {
          onGrowthUpdate(Math.round(growthRate), label);
        }
      };

      fetchStats();
    }, [onGrowthUpdate]);

    return (
      <div className="flex flex-col space-y-24 mt-5 mb-5 md:flex-row md:space-x-24 md:space-y-0">
        <div className="min-w-[500px] max-h-[300px]">
          <h3 className="text-2xl font-bold mb-4 text-center">User Signups by Month</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#0d6efd" strokeWidth={2} name="Signups" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="min-w-[500px] max-h-[300px]">
          <h3 className="text-2xl font-bold mb-4 text-center">Growth Rate by Month</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis
              />
              <Tooltip
                formatter={(value, name, props) => {
                  if (name === "Growth (%)") {
                    return [props.payload.growthLabel, "Growth"];
                  }
                  return [value, name];
                }}
              />              
              <Line 
                  type="monotone"
                  dataKey="growth" 
                  stroke="#28a745" 
                  strokeWidth={2} 
                  dot={{ stroke: 'red', strokeWidth: 2 }}
                  name="Growth (%)"    />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
};

export default SignupsChart;
