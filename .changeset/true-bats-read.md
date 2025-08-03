---
"fayda": patch
---

Add optional `scopes` parameter to `FaydaOptions` interface for customizable OAuth scopes.

- **New Feature**: Added `scopes?: string[]` parameter to allow custom OAuth scope configuration
- **Default Behavior**: Maintains existing default scopes `["openid", "profile", "email"]` when not provided
- **Backward Compatible**: Existing implementations continue to work without changes
- **Usage**: Pass custom scopes like `scopes: ["openid", "profile", "email", "address"]` for additional permissions

This enables flexible authentication by allowing users to request specific OAuth scopes based on their application needs.
