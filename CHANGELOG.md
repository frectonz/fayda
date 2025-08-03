# fayda

## 0.0.11

### Patch Changes

- b27099d: Add optional `scopes` parameter to `FaydaOptions` interface for customizable OAuth scopes.

  - **New Feature**: Added `scopes?: string[]` parameter to allow custom OAuth scope configuration
  - **Default Behavior**: Maintains existing default scopes `["openid", "profile", "email"]` when not provided
  - **Backward Compatible**: Existing implementations continue to work without changes
  - **Usage**: Pass custom scopes like `scopes: ["openid", "profile", "email", "address"]` for additional permissions

  This enables flexible authentication by allowing users to request specific OAuth scopes based on their application needs.

## 0.0.10

### Patch Changes

- 494d684: chore: fix remove duplicate block in readme

## 0.0.9

### Patch Changes

- 965e2f1: chore: add readme

## 0.0.8

### Patch Changes

- 9bb75e1: fix: make the `redirectUrl` optional

## 0.0.7

### Patch Changes

- 28dd032: feat: set scopes value

## 0.0.6

### Patch Changes

- 660d9ab: feat: initial plugin implementation

## 0.0.5

### Patch Changes

- e829619: feat: `fayda` server plugin

## 0.0.4

### Patch Changes

- 7a1d81a: chore: make package public

## 0.0.3

### Patch Changes

- cef3f0f: chore: setup everything
