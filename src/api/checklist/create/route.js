async function handler({ equipmentId, templateId, items }) {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  if (!equipmentId || !templateId || !Array.isArray(items)) {
    return { error: "Missing required fields" };
  }

  try {
    const result = await sql.transaction(async (sql) => {
      const [checklist] = await sql`
        INSERT INTO completed_checklists 
        (equipment_id, template_id, user_id, status)
        VALUES 
        (${equipmentId}, ${templateId}, ${session.user.id}, 'completed')
        RETURNING id
      `;

      const values = items.map((item) => ({
        completed_checklist_id: checklist.id,
        checklist_item_id: item.itemId,
        status: item.status,
        notes: item.notes || null,
      }));

      const completedItems = await sql`
        INSERT INTO completed_checklist_items 
        (completed_checklist_id, checklist_item_id, status, notes)
        SELECT 
          ${checklist.id},
          v.checklist_item_id,
          v.status,
          v.notes
        FROM jsonb_to_recordset(${JSON.stringify(values)}::jsonb) 
        AS v(completed_checklist_id int, checklist_item_id int, status text, notes text)
        RETURNING *
      `;

      return { checklistId: checklist.id, items: completedItems };
    });

    return { success: true, data: result };
  } catch (error) {
    return { error: "Failed to create checklist" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}