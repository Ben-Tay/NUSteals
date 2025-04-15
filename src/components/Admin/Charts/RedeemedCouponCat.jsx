import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const RedeemedCouponCat = ({ data }) => {

    const CustomLegend = () => {
        return (
          <ul className="flex flex-wrap justify-center gap-4 mt-2">
            {data.map((entry, index) => (
              <li key={`item-${index}`} className="flex items-center space-x-2 justify-center">
                <span
                  className="block w-3 h-3 rounded"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span>{entry.name}</span>
              </li>
            ))}
          </ul>
        );
    };
      
    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F'];

    return (
        <>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" type="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend content={CustomLegend} />
                    <Bar dataKey="Redeemed">
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </>
    )
}

export default RedeemedCouponCat