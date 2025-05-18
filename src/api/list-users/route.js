async function handler({
  page = 1,
  limit = 10,
  search,
  sortBy = "created_at",
  sortOrder = "desc",
}) {
  const offset = (page - 1) * limit;
  const validSortColumns = ["created_at", "name", "email"];
  const sortColumn = validSortColumns.includes(sortBy) ? sortBy : "created_at";
  const order = sortOrder.toLowerCase() === "asc" ? "asc" : "desc";

  let queryString = `
    SELECT 
      u.id,
      u.created_at,
      au.name,
      au.email,
      au.image,
      r.name as role_name
    FROM users u
    LEFT JOIN auth_users au ON u.auth_user_id = au.id
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE 1=1
  `;

  const values = [];
  let paramCount = 0;

  if (search) {
    paramCount++;
    queryString += ` AND (LOWER(au.name) LIKE LOWER($${paramCount}) OR LOWER(au.email) LIKE LOWER($${paramCount}))`;
    values.push(`%${search}%`);
  }

  queryString += ` ORDER BY ${sortColumn} ${order}`;

  paramCount++;
  queryString += ` LIMIT $${paramCount}`;
  values.push(limit);

  paramCount++;
  queryString += ` OFFSET $${paramCount}`;
  values.push(offset);

  const users = await sql(queryString, values);

  const countQuery = `
    SELECT COUNT(*) as total 
    FROM users u
    LEFT JOIN auth_users au ON u.auth_user_id = au.id
    WHERE 1=1
    ${
      search
        ? ` AND (LOWER(au.name) LIKE LOWER($1) OR LOWER(au.email) LIKE LOWER($1))`
        : ""
    }
  `;

  const [{ total }] = await sql(countQuery, search ? [`%${search}%`] : []);

  return {
    users,
    pagination: {
      total: parseInt(total),
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
}
export async function POST(request) {
  return handler(await request.json());
}