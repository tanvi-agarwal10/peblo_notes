import Note from '../models/Note.js';

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Total Notes
    const totalNotes = await Note.countDocuments({ createdBy: userId });

    // Recently Edited Notes (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentNotes = await Note.countDocuments({
      createdBy: userId,
      updatedAt: { $gte: sevenDaysAgo }
    });

    // AI Usage Count (Notes with AI generated summary)
    const aiUsageCount = await Note.countDocuments({
      createdBy: userId,
      aiSummary: { $ne: '' }
    });

    // Most used tags aggregation
    const tagsAggregation = await Note.aggregate([
      { $match: { createdBy: userId } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Activity trends (notes created per day last 7 days)
    const activityTrends = await Note.aggregate([
      { 
        $match: { 
          createdBy: userId,
          createdAt: { $gte: sevenDaysAgo } 
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalNotes,
      recentNotes,
      aiUsageCount,
      topTags: tagsAggregation.map(t => ({ name: t._id, value: t.count })),
      activityTrends: activityTrends.map(a => ({ date: a._id, count: a.count }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
