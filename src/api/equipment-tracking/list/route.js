async function handler({ status, startDate, endDate, page = 1, limit = 10 }) {
  const offset = (page - 1) * limit;
  const values = [];
  let paramCount = 1;

  let queryStr = `
    SELECT 
      et.*,
      e.name as equipment_name,
      e.type as equipment_type,
      au.name as user_name,
      au.email as user_email
    FROM equipment_tracking et
    LEFT JOIN equipment e ON et.equipment_id = e.id
    LEFT JOIN users u ON et.user_id = u.id
    LEFT JOIN auth_users au ON u.auth_user_id = au.id
    WHERE 1=1
  `;

  if (status) {
    queryStr += ` AND et.status = $${paramCount}`;
    values.push(status);
    paramCount++;
  }

  if (startDate) {
    queryStr += ` AND et.start_time >= $${paramCount}`;
    values.push(new Date(startDate));
    paramCount++;
  }

  if (endDate) {
    queryStr += ` AND et.start_time <= $${paramCount}`;
    values.push(new Date(endDate));
    paramCount++;
  }

  queryStr += ` ORDER BY et.start_time DESC LIMIT $${paramCount} OFFSET $${
    paramCount + 1
  }`;
  values.push(limit, offset);

  const records = await sql(queryStr, values);

  const countQuery = `
    SELECT COUNT(*) as total 
    FROM equipment_tracking et
    WHERE 1=1
    ${status ? " AND status = $1" : ""}
    ${startDate ? ` AND start_time >= ${status ? "$2" : "$1"}` : ""}
    ${
      endDate
        ? ` AND start_time <= ${
            status && startDate ? "$3" : status || startDate ? "$2" : "$1"
          }`
        : ""
    }
  `;

  const countValues = [
    ...(status ? [status] : []),
    ...(startDate ? [new Date(startDate)] : []),
    ...(endDate ? [new Date(endDate)] : []),
  ];

  const [{ total }] = await sql(countQuery, countValues);

  return {
    records,
    pagination: {
      total: parseInt(total),
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
export async function POST(request) {
  return handler(await request.json());
}