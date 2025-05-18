async function handler() {
  const equipmentUsageQuery = `
    SELECT 
      e.name as equipment_name,
      e.type as equipment_type,
      COUNT(et.id) as total_borrows,
      COUNT(CASE WHEN et.borrowing_status = 'approved' THEN 1 END) as approved_borrows,
      COUNT(CASE WHEN et.borrowing_status = 'rejected' THEN 1 END) as rejected_borrows,
      AVG(EXTRACT(EPOCH FROM (et.return_time - et.start_time))/3600)::numeric(10,2) as avg_borrow_hours
    FROM equipment e
    LEFT JOIN equipment_tracking et ON e.id = et.equipment_id
    GROUP BY e.id, e.name, e.type
  `;

  const checklistMetricsQuery = `
    SELECT 
      ct.name as checklist_name,
      ct.frequency,
      COUNT(cc.id) as times_completed,
      COUNT(DISTINCT cc.user_id) as unique_users,
      AVG(CASE WHEN cci.status = 'completed' THEN 1 ELSE 0 END)::numeric(10,2) as completion_rate
    FROM checklist_templates ct
    LEFT JOIN completed_checklists cc ON ct.id = cc.template_id
    LEFT JOIN completed_checklist_items cci ON cc.id = cci.completed_checklist_id
    GROUP BY ct.id, ct.name, ct.frequency
  `;

  const userActivityQuery = `
    SELECT 
      au.email,
      COUNT(DISTINCT et.id) as equipment_borrows,
      COUNT(DISTINCT cc.id) as checklists_completed,
      COUNT(DISTINCT mt.id) as material_transactions
    FROM auth_users au
    JOIN users u ON au.id = u.auth_user_id
    LEFT JOIN equipment_tracking et ON u.id = et.user_id
    LEFT JOIN completed_checklists cc ON u.id = cc.user_id
    LEFT JOIN material_transactions mt ON u.id = mt.user_id
    GROUP BY au.id, au.email
  `;

  const materialMetricsQuery = `
    SELECT 
      m.name as material_name,
      m.current_stock,
      COUNT(mt.id) as total_transactions,
      SUM(CASE WHEN mt.transaction_type = 'withdrawal' THEN mt.quantity ELSE 0 END) as total_withdrawn,
      SUM(CASE WHEN mt.transaction_type = 'restock' THEN mt.quantity ELSE 0 END) as total_restocked
    FROM materials m
    LEFT JOIN material_transactions mt ON m.id = mt.material_id
    GROUP BY m.id, m.name, m.current_stock
  `;

  try {
    const [equipmentUsage, checklistMetrics, userActivity, materialMetrics] =
      await sql.transaction((sql) => [
        sql(equipmentUsageQuery),
        sql(checklistMetricsQuery),
        sql(userActivityQuery),
        sql(materialMetricsQuery),
      ]);

    return {
      timestamp: new Date().toISOString(),
      equipment: {
        usage: equipmentUsage,
        totalEquipment: equipmentUsage.length,
        avgBorrowRate:
          equipmentUsage.reduce(
            (acc, curr) => acc + Number(curr.total_borrows),
            0
          ) / equipmentUsage.length,
      },
      checklists: {
        metrics: checklistMetrics,
        totalTemplates: checklistMetrics.length,
        avgCompletionRate:
          checklistMetrics.reduce(
            (acc, curr) => acc + Number(curr.completion_rate),
            0
          ) / checklistMetrics.length,
      },
      users: {
        activity: userActivity,
        totalActiveUsers: userActivity.length,
        avgBorrowsPerUser:
          userActivity.reduce(
            (acc, curr) => acc + Number(curr.equipment_borrows),
            0
          ) / userActivity.length,
      },
      materials: {
        metrics: materialMetrics,
        totalMaterials: materialMetrics.length,
        totalCurrentStock: materialMetrics.reduce(
          (acc, curr) => acc + Number(curr.current_stock),
          0
        ),
      },
    };
  } catch (error) {
    return {
      error: "Failed to generate analytics report",
      details: error.message,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}