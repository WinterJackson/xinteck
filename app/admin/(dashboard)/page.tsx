"use client";

import { QuickActions } from "@/components/admin/QuickActions";
import { StatsCard } from "@/components/admin/StatsCard";
import { ANALYTICS_DATA, DASHBOARD_STATS, RECENT_ACTIVITY } from "@/lib/admin-data";
import { Activity, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function AdminDashboardPage() {
  const [chartType, setChartType] = useState<"traffic" | "conversion">("traffic");
  const [timeRange, setTimeRange] = useState("7d");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // Prevent SSR mismatch & Recharts width error

  return (
    <div className="flex flex-col gap-4 md:gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg md:text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-white/40 text-[10px] md:text-sm leading-tight">Welcome back, Admin. Analyze your performance metrics.</p>
        </div>
        <div className="flex items-center gap-2 bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[8px] p-1">
           {["7d", "30d", "90d"].map((range) => (
             <button 
               key={range}
               onClick={() => setTimeRange(range)}
               className={`px-3 py-1 text-xs font-bold rounded-[6px] transition-all ${timeRange === range ? "bg-gold text-black" : "text-white/40 hover:text-white"}`}
             >
               {range.toUpperCase()}
             </button>
           ))}
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {DASHBOARD_STATS.map((stat) => (
          <StatsCard 
            key={stat.title}
            {...stat}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-[10px] md:text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Quick Actions</h3>
        <QuickActions />
      </div>
      
      <div className="grid lg:grid-cols-3 gap-3 md:gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 p-3 md:p-6 rounded-[10px] bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-md min-h-[280px] md:min-h-[450px] flex flex-col w-full overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4">
              <button 
                onClick={() => setChartType("traffic")}
                className={`text-[10px] md:text-sm font-bold border-b-2 pb-1 transition-colors ${chartType === "traffic" ? "text-white border-gold" : "text-white/40 border-transparent hover:text-white"}`}
              >
                Traffic Trends
              </button>
              <button 
                onClick={() => setChartType("conversion")}
                className={`text-[10px] md:text-sm font-bold border-b-2 pb-1 transition-colors ${chartType === "conversion" ? "text-white border-gold" : "text-white/40 border-transparent hover:text-white"}`}
              >
                Lead Conversion
              </button>
            </div>
            
            <div className="hidden md:flex items-center gap-2 text-xs text-white/40">
              <Calendar size={12} />
              <span>Oct 20 - Oct 27</span>
            </div>
          </div>

          <div className="flex-1 w-full overflow-x-auto pb-2">
            <div className="min-w-[400px] md:min-w-[600px] h-[200px] md:h-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "traffic" ? (
                  <AreaChart data={ANALYTICS_DATA}>
                    <defs>
                      <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} dx={-10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#000", borderColor: "#333", borderRadius: "10px", fontSize: "12px" }}
                      itemStyle={{ color: "#fff" }}
                      cursor={{ stroke: "#ffffff20" }}
                    />
                    <Area type="monotone" dataKey="visits" name="Unique Visits" stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#colorVisits)" />
                    <Area type="monotone" dataKey="views" name="Page Views" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                  </AreaChart>
                ) : (
                   <BarChart data={ANALYTICS_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                      <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
                      <Tooltip 
                        cursor={{fill: 'ffffff05'}}
                        contentStyle={{ backgroundColor: "#000", borderColor: "#333", borderRadius: "10px", fontSize: "12px" }}
                        itemStyle={{ color: "#fff" }}
                      />
                      <Bar dataKey="inquiries" name="Inquiries" fill="#D4AF37" radius={[4, 4, 0, 0]} barSize={40} />
                   </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-3 md:p-6 rounded-[10px] bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-md min-h-[280px] md:min-h-[450px] flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-4 md:mb-6">
             <h3 className="text-xs md:text-xl font-bold text-white">Recent Activity</h3>
             <button className="text-[10px] md:text-xs text-gold hover:text-white transition-colors">View All</button>
          </div>
          
          <div className="flex flex-col md:flex-col gap-3 md:gap-4 overflow-x-auto md:overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 flex-1">
            {RECENT_ACTIVITY.map((activity) => (
              <div key={activity.id} className="flex gap-3 p-2 md:p-3 rounded-[10px] hover:bg-white/30 dark:bg-white/5 transition-colors border border-transparent hover:border-white/5 group">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 ${
                   activity.type === 'inbox' ? 'bg-blue-500/10 text-blue-400' :
                   activity.type === 'blog' ? 'bg-green-500/10 text-green-400' :
                   activity.type === 'file' ? 'bg-purple-500/10 text-purple-400' :
                   'bg-white/10 text-white/60'
                }`}>
                  <Activity size={14} className="md:w-4 md:h-4" />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0 justify-center whitespace-nowrap">
                  <p className="text-xs md:text-sm text-white leading-tight">
                    <span className="font-bold text-white group-hover:text-gold transition-colors">{activity.user}</span> {activity.action}
                  </p>
                  <span className="text-xs text-white/30">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/20 dark:border-white/10">
             <div className="bg-black/40 rounded-[8px] p-3 flex items-center justify-between">
                <div>
                   <span className="text-[8px] md:text-xs font-bold text-white block">System Status</span>
                   <span className="text-[8px] md:text-[10px] text-green-400 flex items-center gap-1">● Operational</span>
                </div>
                <div className="text-right">
                   <span className="text-[8px] md:text-xs font-bold text-white block">API Latency</span>
                   <span className="text-[8px] md:text-[10px] text-white/40">24ms</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
