async function handler() {
  const equipmentStats = await sql`
    SELECT 
      COUNT(*) as total,
      COUNT(CASE WHEN status = 'available' THEN 1 END) as available,
      COUNT(CASE WHEN status = 'in_use' THEN 1 END) as in_use
    FROM equipment
  `;

  const activeTracking = await sql`
    SELECT COUNT(*) as active_sessions 
    FROM equipment_tracking 
    WHERE status = 'active'
  `;

  const recentChecklists = await sql`
    SELECT 
      cc.id,
      cc.completion_date,
      ct.name as template_name,
      e.name as equipment_name,
      au.name as user_name
    FROM completed_checklists cc
    JOIN checklist_templates ct ON cc.template_id = ct.id
    JOIN equipment e ON cc.equipment_id = e.id
    JOIN users u ON cc.user_id = u.id
    JOIN auth_users au ON u.auth_user_id = au.id
    ORDER BY cc.completion_date DESC
    LIMIT 5
  `;

  return {
    equipment: {
      total: equipmentStats[0].total,
      available: equipmentStats[0].available,
      in_use: equipmentStats[0].in_use,
      active_sessions: activeTracking[0].active_sessions,
    },
    recent_checklists: recentChecklists,
  };
}
export async function POST(request) {
  return handler(await request.json());
}