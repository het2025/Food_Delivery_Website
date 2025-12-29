import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#FF6B35', '#F7931E', '#FFAF61', '#FFD5A5', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6'];

const PopularDishesChart = ({ data = [] }) => {
    if (!data || data.length === 0) {
        return (
            <Paper sx={{ p: 3, height: '100%', borderRadius: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    🍕 Popular Dishes
                </Typography>
                <Typography color="text.secondary">No data available</Typography>
            </Paper>
        );
    }

    return (
        <Paper sx={{ p: 3, height: '100%', borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                🍕 Popular Dishes
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Top selling items by order count
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" />
                    <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        width={70}
                        tickFormatter={(value) => value.length > 12 ? `${value.slice(0, 12)}...` : value}
                    />
                    <Tooltip
                        formatter={(value, name) => [
                            name === 'orderCount' ? `${value} orders` : `₹${value}`,
                            name === 'orderCount' ? 'Orders' : 'Revenue'
                        ]}
                        contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                    />
                    <Bar dataKey="orderCount" radius={[0, 4, 4, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </Paper>
    );
};

export default PopularDishesChart;
