async function handler({ name, email, roleId }) {
  const session = getSession();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const adminCheck = await sql`
    SELECT r.name 
    FROM users u 
    JOIN roles r ON u.role_id = r.id 
    WHERE u.auth_user_id = ${session.user.id} 
    AND r.name = 'superadmin'`;

  if (!adminCheck.length) {
    return { error: "Unauthorized - Superadmin access required" };
  }

  if (!name || !email || !roleId) {
    return { error: "Missing required fields" };
  }

  try {
    const result = await sql.transaction(async (sql) => {
      const [authUser] = await sql`
        INSERT INTO auth_users (name, email)
        VALUES (${name}, ${email})
        RETURNING id`;

      const [user] = await sql`
        INSERT INTO users (auth_user_id, role_id)
        VALUES (${authUser.id}, ${roleId})
        RETURNING id`;

      return { authUserId: authUser.id, userId: user.id };
    });

    return { success: true, ...result };
  } catch (error) {
    return { error: "Failed to create user" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}