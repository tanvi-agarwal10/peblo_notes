import { useState, useEffect } from 'react';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, FileText, Sparkles, Tag, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to load stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0f1115]">
        <div className="animate-pulse flex items-center gap-2 text-[#00ffcc]">
          <Activity className="w-5 h-5" /> Loading Insights...
        </div>
      </div>
    );
  }

  const cards = [
    { title: 'Total Notes', value: stats.totalNotes, icon: <FileText className="text-blue-400" /> },
    { title: 'Recent Edits', value: stats.recentNotes, icon: <TrendingUp className="text-green-400" /> },
    { title: 'AI Usage', value: stats.aiUsageCount, icon: <Sparkles className="text-[#00ffcc]" /> },
    { title: 'Top Tags', value: stats.topTags.length, icon: <Tag className="text-purple-400" /> },
  ];

  return (
    <div className="flex-1 bg-[#0f1115] overflow-y-auto p-8 text-white">
      <h1 className="text-3xl font-bold mb-8 neon-text">Productivity Insights</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={idx} 
            className="glass-panel p-6 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">{card.title}</span>
              {card.icon}
            </div>
            <div className="text-3xl font-bold">{card.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-panel p-6"
        >
          <h2 className="text-lg font-semibold mb-6">Activity Trends (Last 7 Days)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.activityTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252a33" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1d24', border: '1px solid #252a33' }}
                  itemStyle={{ color: '#00ffcc' }}
                />
                <Line type="monotone" dataKey="count" stroke="#00ffcc" strokeWidth={2} dot={{ fill: '#00ffcc', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-panel p-6"
        >
          <h2 className="text-lg font-semibold mb-6">Top Tags</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.topTags} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252a33" horizontal={false} />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis dataKey="name" type="category" stroke="#6b7280" width={80} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1d24', border: '1px solid #252a33' }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
