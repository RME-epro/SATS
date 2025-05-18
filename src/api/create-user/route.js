async function handler({ name, email, password }) {
  if (!name || !email || !password) {
    return { error: "Name, email and password are required" };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  try {
    const existingUser = await sql`
      SELECT id FROM auth_users WHERE email = ${email}
    `;

    if (existingUser.length > 0) {
      return { error: "Email already registered" };
    }

    const [authUser, user] = await sql.transaction(async (sql) => {
      const [newAuthUser] = await sql`
        INSERT INTO auth_users (name, email)
        VALUES (${name}, ${email})
        RETURNING id
      `;

      await sql`
        INSERT INTO auth_accounts (
          "userId",
          type,
          provider,
          "providerAccountId", 
          password
        )
        VALUES (
          ${newAuthUser.id},
          'credentials',
          'local',
          ${email},
          crypt(${password}, gen_salt('bf'))
        )
      `;

      const [defaultRole] = await sql`
        SELECT id FROM roles WHERE name = 'user'
      `;

      const [newUser] = await sql`
        INSERT INTO users (auth_user_id, role_id)
        VALUES (${newAuthUser.id}, ${defaultRole.id})
        RETURNING id
      `;

      return [newAuthUser, newUser];
    });

    await sql`
      INSERT INTO notifications (
        user_id,
        title,
        message,
        type
      )
      VALUES (
        ${user.id},
        'Welcome to the platform!',
        'Thank you for joining. Get started by exploring our features.',
        'welcome'
      )
    `;

    return {
      success: true,
      user: {
        id: user.id,
        name,
        email,
      },
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: "Failed to create user" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}