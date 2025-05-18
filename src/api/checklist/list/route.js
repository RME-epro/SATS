async function handler({
  templateId,
  startDate,
  endDate,
  status,
  page = 1,
  limit = 10,
}) {
  const offset = (page - 1) * limit;
  const values = [];
  let paramCount = 0;

  let queryString = `
    SELECT 
      cc.id,
      cc.completion_date,
      cc.status,
      cc.notes,
      ct.name as template_name,
      ct.frequency,
      e.name as equipment_name,
      e.type as equipment_type,
      au.name as user_name,
      au.email as user_email
    FROM completed_checklists cc
    LEFT JOIN checklist_templates ct ON cc.template_id = ct.id
    LEFT JOIN equipment e ON cc.equipment_id = e.id
    LEFT JOIN users u ON cc.user_id = u.id
    LEFT JOIN auth_users au ON u.auth_user_id = au.id
    WHERE 1=1
  `;

  if (templateId) {
    paramCount++;
    queryString += ` AND cc.template_id = $${paramCount}`;
    values.push(templateId);
  }

  if (startDate) {
    paramCount++;
    queryString += ` AND cc.completion_date >= $${paramCount}`;
    values.push(startDate);
  }

  if (endDate) {
    paramCount++;
    queryString += ` AND cc.completion_date <= $${paramCount}`;
    values.push(endDate);
  }

  if (status) {
    paramCount++;
    queryString += ` AND cc.status = $${paramCount}`;
    values.push(status);
  }

  queryString += ` ORDER BY cc.completion_date DESC LIMIT $${
    paramCount + 1
  } OFFSET $${paramCount + 2}`;
  values.push(limit, offset);

  const checklists = await sql(queryString, values);

  const checklistsWithItems = await Promise.all(
    checklists.map(async (checklist) => {
      const items = await sql(
        `
        SELECT 
          cci.status,
          cci.notes,
          ci.description
        FROM completed_checklist_items cci
        JOIN checklist_items ci ON cci.checklist_item_id = ci.id
        WHERE cci.completed_checklist_id = $1
      `,
        [checklist.id]
      );

      return {
        ...checklist,
        items,
      };
    })
  );

  const totalCount = await sql(
    `
    SELECT COUNT(*) as count 
    FROM completed_checklists cc 
    WHERE 1=1 
    ${templateId ? "AND cc.template_id = $1" : ""}
    ${status ? `AND cc.status = $${templateId ? "2" : "1"}` : ""}
  `,
    [...(templateId ? [templateId] : []), ...(status ? [status] : [])]
  );

  return {
    checklists: checklistsWithItems,
    pagination: {
      total: totalCount[0].count,
      page,
      limit,
      pages: Math.ceil(totalCount[0].count / limit),
    },
  };
}
export async function POST(request) {
  return handler(await request.json());
}