async function handler() {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const [
      equipmentStats,
      maintenanceStats,
      borrowingStats,
      recentNotifications,
    ] = await sql.transaction([
      sql`
        SELECT 
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status = 'available') as available,
          COUNT(*) FILTER (WHERE status = 'in_use') as in_use,
          COUNT(*) FILTER (WHERE status = 'maintenance') as in_maintenance
        FROM equipment
      `,

      sql`
        SELECT 
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status = 'scheduled') as scheduled,
          COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
          COUNT(*) FILTER (WHERE status = 'completed') as completed
        FROM maintenance_schedules
        WHERE scheduled_date >= CURRENT_DATE - INTERVAL '30 days'
      `,

      sql`
        SELECT 
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE borrowing_status = 'pending') as pending,
          COUNT(*) FILTER (WHERE borrowing_status = 'approved') as approved,
          COUNT(*) FILTER (WHERE borrowing_status = 'returned') as returned
        FROM equipment_tracking
        WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      `,

      sql`
        SELECT id, title, message, type, created_at, read
        FROM notifications
        WHERE user_id = ${session.user.id}
        ORDER BY created_at DESC
        LIMIT 5
      `,
    ]);

    return {
      equipment: {
        total: equipmentStats[0].total,
        available: equipmentStats[0].available,
        inUse: equipmentStats[0].in_use,
        inMaintenance: equipmentStats[0].in_maintenance,
      },
      maintenance: {
        total: maintenanceStats[0].total,
        scheduled: maintenanceStats[0].scheduled,
        inProgress: maintenanceStats[0].in_progress,
        completed: maintenanceStats[0].completed,
      },
      borrowing: {
        total: borrowingStats[0].total,
        pending: borrowingStats[0].pending,
        approved: borrowingStats[0].approved,
        returned: borrowingStats[0].returned,
      },
      notifications: recentNotifications,
    };
  } catch (error) {
    return {
      error: "Terjadi kesalahan saat mengambil data dashboard",
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}