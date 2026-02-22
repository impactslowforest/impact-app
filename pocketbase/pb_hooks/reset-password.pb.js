// Custom endpoint: Admin reset password for another user
// PocketBase requires oldPassword when a regular user updates another user's password.
// This hook bypasses that for superadmin/country_admin by using setPassword() directly.

routerAdd("POST", "/api/custom/reset-password", (e) => {
    var authRecord = e.auth;
    if (!authRecord) {
        throw new ForbiddenError("Not authenticated");
    }

    // Check if requester has superadmin or country_admin role
    var roleId = authRecord.get("role");
    if (!roleId) {
        throw new ForbiddenError("No role assigned");
    }

    var role;
    try {
        role = $app.findRecordById("roles", roleId);
    } catch (err) {
        throw new ForbiddenError("Role not found");
    }

    var roleName = role.get("name");
    if (roleName !== "superadmin" && roleName !== "country_admin") {
        throw new ForbiddenError("Insufficient permissions");
    }

    var body = e.requestInfo().body;
    var userId = body.userId;
    var newPassword = body.password;

    if (!userId || !newPassword) {
        throw new BadRequestError("Missing userId or password");
    }

    if (newPassword.length < 8) {
        throw new BadRequestError("Password must be at least 8 characters");
    }

    // Prevent resetting own password through this endpoint (use normal flow)
    if (userId === authRecord.id) {
        throw new BadRequestError("Use the normal password change for your own account");
    }

    // Find and update the target user
    var user;
    try {
        user = $app.findRecordById("users", userId);
    } catch (err) {
        throw new NotFoundError("User not found");
    }

    user.setPassword(newPassword);
    $app.save(user);

    return e.json(200, { message: "Password reset successfully" });
});
