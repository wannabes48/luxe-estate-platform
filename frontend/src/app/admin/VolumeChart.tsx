"use client"
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function TransactionVolumeChart() {
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalVolume, setTotalVolume] = useState(0);

    useEffect(() => {
        async function fetchChartData() {
            try {
                // 1. Fetch completed transactions
                // Adjust the 'status' or 'type' filter based on your exact database schema
                const { data, error } = await supabase
                    .from('mpesa_transactions')
                    .select('amount, created_at')
                    // .eq('status', 'completed') // Uncomment if you track status
                    .order('created_at', { ascending: true });

                if (error) throw error;

                // 2. Aggregate data by Date
                let total = 0;
                const groupedData = data?.reduce((acc: any, tx: any) => {
                    // Format date to "Mar 15"
                    const dateObj = new Date(tx.created_at);
                    const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    
                    const amount = Number(tx.amount) || 0;
                    total += amount;

                    if (!acc[dateStr]) {
                        acc[dateStr] = { date: dateStr, volume: 0 };
                    }
                    acc[dateStr].volume += amount;
                    return acc;
                }, {});

                // Convert object back to array for Recharts
                const formattedData = groupedData ? Object.values(groupedData) : [];
                
                setChartData(formattedData);
                setTotalVolume(total);
            } catch (error) {
                console.error("Error fetching chart data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchChartData();
    }, []);

    // Custom Tooltip for the sleek, luxurious feel
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-black/90 backdrop-blur-md border border-white/10 p-4 text-white shadow-2xl">
                    <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">{label}</p>
                    <p className="font-sans text-lg font-bold text-emerald-400">
                        KES {payload[0].value.toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="bg-white border border-stone-200 rounded-sm p-8 h-96 flex items-center justify-center">
                <span className="text-[10px] uppercase tracking-widest text-stone-400 animate-pulse">
                    Aggregating Financial Data...
                </span>
            </div>
        );
    }

    if (chartData.length === 0) {
        return (
            <div className="bg-white border border-stone-200 rounded-sm p-8 h-96 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">📊</span>
                </div>
                <h3 className="font-serif text-xl text-stone-900 mb-2">Awaiting Transaction Data</h3>
                <p className="text-sm text-stone-500 max-w-md">
                    Once M-Pesa transactions are processed, your volume metrics will populate here.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-stone-200 rounded-sm p-8 h-96 flex flex-col shadow-sm">
            
            {/* Chart Header */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h3 className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-1">
                        Network Volume (All Time)
                    </h3>
                    <p className="text-3xl font-serif text-stone-900">
                        KES {totalVolume.toLocaleString()}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[9px] uppercase tracking-widest text-stone-400">Live</span>
                </div>
            </div>

            {/* The Recharts Area */}
            <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                        <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fill: '#a8a29e' }}
                            dy={10}
                        />
                        <YAxis 
                            hide={true} 
                            domain={['dataMin', 'dataMax + 10000']} 
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area 
                            type="monotone" 
                            dataKey="volume" 
                            stroke="#10B981" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorVolume)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}