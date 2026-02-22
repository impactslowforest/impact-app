/// <reference path="../pb_data/types.d.ts" />

// === Registration: Force status to "pending" only for self-registration ===
// If an authenticated admin creates a user, preserve the status they set.
onRecordCreate((e) => {
  if (e.httpContext) {
    const authRecord = e.httpContext.get("authRecord");
    if (authRecord) {
      // Admin/manager is creating this user — keep the status they provided
      e.next();
      return;
    }
  }
  // Self-registration (unauthenticated) — force pending
  e.record.set("status", "pending");
  e.next();
}, "users");

// === After registration: Notify new user ===
onRecordAfterCreateSuccess((e) => {
  const email = e.record.get("email");
  const name = e.record.get("name");
  const status = e.record.get("status");
  console.log(`[Auth] New user created: ${email} - status: ${status}`);

  // Send welcome email to the new user (requires SMTP configured in PB admin)
  if (status === "active") {
    try {
      const message = new MailerMessage();
      message.setTo({ address: email, name: name || "" });
      message.setSubject("Your Impact account is ready");
      message.setHTML(`
        <h2>Welcome, ${name || ""}!</h2>
        <p>Your Impact Slow Forest account has been created and is ready to use.</p>
        <p>Login at: <a href="http://localhost:5173">Impact App</a></p>
        <p>Use your email <b>${email}</b> to sign in.</p>
      `);
      e.app.mail().send(message);
      console.log(`[Auth] Welcome email sent to ${email}`);
    } catch (err) {
      console.warn(`[Auth] Email send failed (check SMTP config): ${err}`);
    }
  }
}, "users");

// === After status change: Log approval/rejection ===
onRecordUpdate((e) => {
  const oldStatus = e.record.original().get("status");
  const newStatus = e.record.get("status");

  if (oldStatus !== newStatus) {
    console.log(`[Auth] User ${e.record.get("email")} status changed: ${oldStatus} -> ${newStatus}`);

    if (newStatus === "active" && oldStatus === "pending") {
      // Set approval metadata
      if (e.httpContext) {
        const authRecord = e.httpContext.get("authRecord");
        if (authRecord) {
          e.record.set("approved_by", authRecord.id);
          e.record.set("approved_at", new Date().toISOString());
        }
      }
    }
  }

  e.next();
}, "users");

// === Update last_login on auth ===
onRecordAuthRequest((e) => {
  e.record.set("last_login", new Date().toISOString());
  e.app.save(e.record);
  e.next();
}, "users");
