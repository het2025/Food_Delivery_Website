import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const CustomerRetentionCard = ({ data }) => {
    if (!data) {
        return (
            <Paper sx={{ p: 3, height: '100%', borderRadius: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    👥 Customer Retention
                </Typography>
                <Typography color="text.secondary">No data available</Typography>
            </Paper>
        );
    }

    const chartData = [
        { name: 'New Customers', value: data.newCustomers, color: '#3B82F6' },
        { name: 'Returning', value: data.returningCustomers, color: '#10B981' }
    ];

    return (
        <Paper sx={{ p: 3, height: '100%', borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                👥 Customer Retention
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                New vs returning customers
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={75}
                            dataKey="value"
                            paddingAngle={5}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value) => [`${value} customers`, '']}
                            contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight="bold" color="#3B82F6">
                        {data.newRate}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        New ({data.newCustomers})
                    </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight="bold" color="#10B981">
                        {data.retentionRate}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Returning ({data.returningCustomers})
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                <Typography variant="body2" color="text.secondary">
                    Total Unique Customers
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="primary">
                    {data.totalCustomers?.toLocaleString()}
                </Typography>
            </Box>
        </Paper>
    );
};

export default CustomerRetentionCard;
