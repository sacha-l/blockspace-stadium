# SIWS Utilities

This module provides utility functions for generating context-specific SIWS (Sign In With Substrate) statements.

## Overview

Instead of using generic signing messages like "Submit milestone deliverables for Hackathonia", this utility generates context-specific statements that clearly indicate what action the user is signing for.

## Usage

### Basic Usage

```typescript
import { generateSiwsStatement } from '@/lib/siwsUtils';

// Generate a statement for updating team members
const statement = generateSiwsStatement({
  action: 'update-team',
  projectTitle: 'My Awesome Project',
  projectId: '123'
});
// Result: "Update team members for My Awesome Project on Hackathonia"
```

### Available Actions

- `update-team` - For updating team members
- `submit-deliverable` - For submitting milestone deliverables
- `update-project` - For updating project details
- `create-project` - For creating new projects
- `delete-project` - For deleting projects
- `review-project` - For reviewing projects (admin)
- `approve-project` - For approving projects (admin)
- `reject-project` - For rejecting projects (admin)
- `register-address` - For registering team addresses
- `admin-action` - For general administrative actions

### Context Parameters

- `action` (required): The type of action being performed
- `projectTitle` (optional): The title of the project being affected
- `projectId` (optional): The ID of the project being affected
- `additionalContext` (optional): Additional context information

### Examples

```typescript
// Team member update
generateSiwsStatement({
  action: 'update-team',
  projectTitle: 'DeFi Protocol',
  projectId: '456'
});
// "Update team members for DeFi Protocol on Hackathonia"

// Submit deliverables
generateSiwsStatement({
  action: 'submit-deliverable',
  projectTitle: 'NFT Marketplace',
  projectId: '789'
});
// "Submit milestone deliverables for NFT Marketplace on Hackathonia"

// Admin action
generateSiwsStatement({
  action: 'approve-project',
  projectTitle: 'Smart Contract Audit Tool'
});
// "Approve project Smart Contract Audit Tool on Hackathonia"

// Simple action
generateSiwsStatement({
  action: 'register-address'
});
// "Register team address for Hackathonia"
```

## Server-Side Validation

The server middleware automatically validates these context-specific statements using pattern matching. It accepts both exact matches and dynamic project-specific statements.

### Valid Statement Patterns

- Exact matches from the `VALID_STATEMENTS` array
- Pattern matches for project-specific statements:
  - `Update team members for {project} on Hackathonia`
  - `Submit milestone deliverables for {project} on Hackathonia`
  - `Update project details for {project} on Hackathonia`
  - `Delete project {project} on Hackathonia`
  - `Review project {project} on Hackathonia`
  - `Approve project {project} on Hackathonia`
  - `Reject project {project} on Hackathonia`

## Benefits

1. **Clear Intent**: Users know exactly what they're signing for
2. **Audit Trail**: Better logging and tracking of user actions
3. **Security**: Prevents signature reuse across different actions
4. **User Experience**: More transparent and trustworthy signing process
5. **Compliance**: Better meets regulatory requirements for clear consent

## Migration

To migrate existing code:

1. Replace hardcoded statements with `generateSiwsStatement()` calls
2. Update server middleware to use the new validation logic
3. Test all signing flows to ensure they work correctly

## Example Migration

**Before:**
```typescript
const siws = new SiwsMessage({
  // ... other fields
  statement: "Submit milestone deliverables for Hackathonia",
});
```

**After:**
```typescript
const siws = new SiwsMessage({
  // ... other fields
  statement: generateSiwsStatement({
    action: 'submit-deliverable',
    projectTitle: project.projectName,
    projectId: project.id
  }),
});
```
