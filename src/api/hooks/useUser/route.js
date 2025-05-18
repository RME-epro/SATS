async function handler() {
  const session = getSession();

  if (!session?.user?.id) {
    return {
      user: null,
      isLoading: false,
      error: null,
    };
  }

  try {
    const [user] = await sql`
      SELECT 
        u.*,
        au.email,
        au.name,
        r.name as role_name
      FROM users u
      LEFT JOIN auth_users au ON u.auth_user_id = au.id
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.auth_user_id = ${session.user.id}
    `;

    if (!user) {
      return {
        user: null,
        isLoading: false,
        error: "User not found",
      };
    }

    return {
      user,
      isLoading: false,
      error: null,
    };
  } catch (error) {
    return {
      user: null,
      isLoading: false,
      error: "Failed to fetch user data",
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}