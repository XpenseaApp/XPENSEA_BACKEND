/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Admin related endpoints
 *   - name: Role
 *     description: Role related endpoints
 *   - name: Tier
 *     description: Tier related endpoints
 *   - name: List
 *     description: List related endpoints for admin and users
 *   - name: Policy
 *     description: Policy related endpoints for admin and users
 *   - name: User
 *     description: User related endpoints
 *   - name: Expense
 *     description: Expense related endpoints
 *   - name: Report
 *     description: Report related endpoints
 *   - name: Event
 *     description: Event related endpoints
 *   - name: Category
 *     description: Category related endpoints
 *   - name: Problem
 *     description: User Problem related endpoints
 *   - name: Approval
 *     description: User Approval related endpoints
 */

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Admin login
 *     description: API endpoint for admin login
 *     tags:
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "admin@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /admin:
 *   post:
 *     summary: Create a new admin
 *     description: API endpoint to create a new admin
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               designation:
 *                 type: string
 *                 example: "Administrator"
 *               email:
 *                 type: string
 *                 example: "admin@example.com"
 *               mobile:
 *                 type: string
 *                 example: "+123456789"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               role:
 *                 type: string
 *                 example: "666c1a3895a6b176b7f2bcf7"
 *     responses:
 *       200:
 *         description: Admin created successfully
 *       400:
 *         description: Bad request
 *   get:
 *     summary: Get an admin
 *     description: API endpoint to get an existing admin
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Admin retrieved successfully
 *       404:
 *         description: Admin not found
 */

/**
 * @swagger
 * /admin/admin/{id}:
 *   put:
 *     summary: Update an admin
 *     description: API endpoint to update an existing admin
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the admin to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               designation:
 *                 type: string
 *                 example: "Administrator"
 *               email:
 *                 type: string
 *                 example: "admin@example.com"
 *               mobile:
 *                 type: string
 *                 example: "+123456789"
 *               password:
 *                 type: string
 *                 example: "newpassword123"
 *               role:
 *                 type: string
 *                 example: "666c1a3895a6b176b7f2bcf7"
 *               status:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Admin updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Admin not found
 *   get:
 *     summary: Get a Admin by id
 *     description: API endpoint to get an existing admin
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the admin to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admin found
 *       404:
 *         description: Admin not found
 *   delete:
 *     summary: Delete an admin
 *     description: API endpoint to delete an existing admin
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the admin to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admin deleted successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Admin not found
 */

/**
 * @swagger
 * /admin/list:
 *   get:
 *     summary: Retrieve various data types
 *     description: API endpoint to get existing admins, roles, tiers, users, approvals, approvers, finances, or events based on query type.
 *     tags:
 *       - List
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         required: true
 *         description: Type of data to retrieve (e.g., admins, roles, tiers, users, approvals, approvers, finances, events, transactions, policy)
 *       - in: query
 *         name: tier
 *         schema:
 *           type: string
 *         description: Tier ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Status
 *       - in: query
 *         name: staffId
 *         schema:
 *           type: string
 *         description: Status
 *     responses:
 *       200:
 *         description: Data retrieved successfully
 *       404:
 *         description: Data not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /admin/role:
 *   post:
 *     summary: Create a new role
 *     description: API endpoint to create a new role
 *     tags:
 *       - Role
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleName:
 *                 type: string
 *                 example: "Manager"
 *               description:
 *                 type: string
 *                 example: "Manager of the company"
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["read", "write"]
 *               locationAccess:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["New York", "Los Angeles"]
 *     responses:
 *       200:
 *         description: Role created successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /admin/role/{id}:
 *   put:
 *     summary: Update a role
 *     description: API endpoint to update an existing role
 *     tags:
 *       - Role
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the role to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleName:
 *                 type: string
 *                 example: "Manager"
 *               description:
 *                 type: string
 *                 example: "Manager of the company"
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["read", "write"]
 *               locationAccess:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["New York", "Los Angeles"]
 *               status:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Role not found
 *   get:
 *     summary: Get a role
 *     description: API endpoint to get an existing role
 *     tags:
 *       - Role
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the role to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role found
 *       404:
 *         description: Role not found
 *   delete:
 *     summary: Delete a role
 *     description: API endpoint to delete an existing role
 *     tags:
 *       - Role
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the role to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Role not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /admin/tier:
 *   post:
 *     summary: Create a new tier
 *     description: API endpoint to create a new tier
 *     tags:
 *       - Tier
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Gold Tier"
 *               level:
 *                 type: number
 *                 example: 4
 *               activationDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-06-15"
 *               categories:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: "Category 1"
 *                     maxAmount:
 *                       type: number
 *                       example: 500
 *     responses:
 *       200:
 *         description: Tier created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /admin/tier/{id}:
 *   put:
 *     summary: Update a tier
 *     description: API endpoint to update an existing tier
 *     tags:
 *       - Tier
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the tier to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Gold Tier"
 *               activationDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-06-15"
 *               categories:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: "Category 1"
 *                     maxAmount:
 *                       type: number
 *                       example: 500
 *               status:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Tier updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Tier not found
 *   get:
 *     summary: Get a tier
 *     description: API endpoint to get an existing tier
 *     tags:
 *       - Tier
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the tier to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tier found
 *       404:
 *         description: Tier not found
 *   delete:
 *     summary: Delete a tier
 *     description: API endpoint to delete an existing tier
 *     tags:
 *       - Tier
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the tier to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tier deleted successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Tier not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /admin/user:
 *   post:
 *     summary: Create a new user
 *     description: API endpoint to create a new user
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: string
 *                 example: "emp#123"
 *               name:
 *                 type: string
 *                 example: "Jane Doe"
 *               email:
 *                 type: string
 *                 example: "jane@example.com"
 *               mobile:
 *                 type: string
 *                 example: "+123456789"
 *               designation:
 *                 type: string
 *                 example: "Staff"
 *               tier:
 *                 type: string
 *                 example: "666c1a3895a6b176b7f2bcf7"
 *               userType:
 *                 type: string
 *                 example: "submitter"
 *               location:
 *                 type: string
 *                 example: "Kochi"
 *               approver:
 *                 type: string
 *                 example: "666c1a3895a6b176b7f2bcf7"
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /admin/user/{id}:
 *   put:
 *     summary: Update a user
 *     description: API endpoint to update an existing user
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Doe"
 *               email:
 *                 type: string
 *                 example: "jane@example.com"
 *               mobile:
 *                 type: string
 *                 example: "+123456789"
 *               tierId:
 *                 type: string
 *                 example: "666c1a3895a6b176b7f2bcf7"
 *               status:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *   get:
 *     summary: Get a user
 *     description: API endpoint to get an existing user
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 *   delete:
 *     summary: Delete a user
 *     description: API endpoint to delete an existing user
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /admin/event:
 *   post:
 *     summary: Create Event
 *     description: API endpoint to create a new event
 *     tags:
 *       - Event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventName:
 *                 type: string
 *                 example: "Annual Conference"
 *               days:
 *                 type: number
 *                 example: 3
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-07-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-07-03"
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-07-01T09:00:00Z"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-07-01T17:00:00Z"
 *               description:
 *                 type: string
 *                 example: "An annual conference focusing on industry trends and networking."
 *               location:
 *                 type: string
 *                 example: "Convention Center, Downtown"
 *               staffs:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "66711406bb0f277c28941cb4"
 *     responses:
 *       200:
 *         description: Event created successfully
 *       400:
 *         description: Invalid input or event creation failed
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /admin/event/{id}:
 *   put:
 *     summary: Edit an event
 *     description: API endpoint for editing an event
 *     tags:
 *       - Event
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the event to edit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventName:
 *                 type: string
 *                 example: "Updated Event Name"
 *               days:
 *                 type: number
 *                 example: 5
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2023-07-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2023-07-05"
 *               startTime:
 *                 type: string
 *                 format: time
 *                 example: "09:00:00"
 *               endTime:
 *                 type: string
 *                 format: time
 *                 example: "17:00:00"
 *               description:
 *                 type: string
 *                 example: "Updated event description"
 *               location:
 *                 type: string
 *                 example: "Updated event location"
 *               staffs:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "Staff Member 1"
 *               status:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       400:
 *         description: Invalid input or Event update failed
 *       403:
 *         description: You don't have permission to perform this action
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /admin/event/{id}:
 *   get:
 *     summary: Get event details
 *     description: API endpoint for retrieving event details
 *     tags:
 *       - Event
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the event to retrieve
 *     responses:
 *       200:
 *         description: Event found
 *       400:
 *         description: Event ID is required
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /admin/event/{id}:
 *   delete:
 *     summary: Delete an event
 *     description: API endpoint for deleting an event
 *     tags:
 *       - Event
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the event to delete
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       400:
 *         description: Event ID is required
 *       403:
 *         description: You don't have permission to perform this action
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /admin/approval/{id}:
 *   get:
 *     summary: Get approval details
 *     description: API endpoint for fetching approval details based on approval ID
 *     tags:
 *       - Approval
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the event to retrieve
 *     responses:
 *       200:
 *         description: Approval details retrieved successfully
 *       400:
 *         description: Approval ID is required
 *       403:
 *         description: You don't have permission to perform this action
 *       404:
 *         description: Report not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /admin/approval/{id}/{action}:
 *   put:
 *     summary: Update approval status
 *     description: API endpoint for updating the approval status of a report and associated expenses
 *     tags:
 *       - Approval
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the approval to update
 *       - name: action
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           enum: [approve, reject]
 *         description: Action to perform (approve or reject)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               expenses:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "667275cda0521a39e214cd6c"
 *     responses:
 *       200:
 *         description: Approval updated successfully
 *       400:
 *         description: Approval ID is required or Approval update failed
 *       403:
 *         description: You don't have permission to perform this action
 *       404:
 *         description: Approval not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /admin/user/reports/{id}:
 *   get:
 *     summary: Get user reports
 *     description: API endpoint to fetch reports for a specific user
 *     tags:
 *       - User
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to fetch reports
 *     responses:
 *       200:
 *         description: Reports found
 *       400:
 *         description: User ID is required
 *       403:
 *         description: You don't have permission to perform this action
 *       404:
 *         description: Reports not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /admin/reimburse/{id}:
 *   put:
 *     summary: Reimburse a report
 *     description: API endpoint to update a report's status to reimbursed
 *     tags:
 *       - Approval
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the report to reimburse
 *     responses:
 *       200:
 *         description: Reimbursed successfully
 *       400:
 *         description: Approval ID is required or Reimbursed failed
 *       500:
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /admin/users/filtered:
 *   get:
 *     summary: Get filtered users
 *     description: API endpoint to retrieve users based on filters like tier, role, and location
 *     tags:
 *       - Admin
 *     parameters:
 *       - name: tier
 *         in: query
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Tier(s) of the user
 *       - name: role
 *         in: query
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Role(s) of the user
 *       - name: location
 *         in: query
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Location(s) of the user
 *     responses:
 *       200:
 *         description: Users found
 *       403:
 *         description: You don't have permission to perform this action
 *       404:
 *         description: Users not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /admin/finance/{id}:
 *   get:
 *     summary: Get approval details
 *     description: API endpoint for fetching approval details based on approval ID
 *     tags:
 *       - Approval
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the event to retrieve
 *     responses:
 *       200:
 *         description: Approval details retrieved successfully
 *       400:
 *         description: Approval ID is required
 *       403:
 *         description: You don't have permission to perform this action
 *       404:
 *         description: Report not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /admin/policy:
 *   post:
 *     summary: Create a new policy
 *     description: API endpoint for creating a new policy.
 *     tags:
 *       - Policy
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               policyTitle:
 *                 type: string
 *                 example: "New Reimbursement Policy"
 *               tier:
 *                 type: string
 *                 example: "64a55c6f3f8b9c001c8b4567"
 *               userType:
 *                 type: string
 *                 example: "Admin"
 *               activationDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-08-01"
 *               location:
 *                 type: string
 *                 example: "Headquarters"
 *               policyDetails:
 *                 type: string
 *                 example: "This policy covers all reimbursement procedures."
 *               accuracy:
 *                 type: string
 *                 example: "High"
 *               authenticity:
 *                 type: string
 *                 example: "Verified"
 *               compliance:
 *                 type: string
 *                 example: "Compliant with local laws"
 *               relevance:
 *                 type: string
 *                 example: "Relevant to current business needs"
 *               completeness:
 *                 type: string
 *                 example: "Complete as per internal guidelines"
 *     responses:
 *       201:
 *         description: Policy created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /admin/policy/{id}:
 *   get:
 *     summary: Get policy details
 *     description: API endpoint for fetching policy details based on policy ID.
 *     tags:
 *       - Policy
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the policy to retrieve
 *     responses:
 *       200:
 *         description: Policy details retrieved successfully
 *       400:
 *         description: Policy ID is required
 *       404:
 *         description: Policy not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /admin/policy/{id}:
 *   put:
 *     summary: Update an existing policy
 *     description: API endpoint for updating a policy based on its ID.
 *     tags:
 *       - Policy
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the policy to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               policyTitle:
 *                 type: string
 *                 example: "Updated Reimbursement Policy"
 *               tier:
 *                 type: string
 *                 example: "64a55c6f3f8b9c001c8b4567"
 *               userType:
 *                 type: string
 *                 example: "Admin"
 *               activationDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-08-01"
 *               location:
 *                 type: string
 *                 example: "Headquarters"
 *               policyDetails:
 *                 type: string
 *                 example: "Updated policy details."
 *               accuracy:
 *                 type: string
 *                 example: "High"
 *               authenticity:
 *                 type: string
 *                 example: "Verified"
 *               compliance:
 *                 type: string
 *                 example: "Compliant with updated regulations"
 *               relevance:
 *                 type: string
 *                 example: "Still relevant"
 *               completeness:
 *                 type: string
 *                 example: "Complete"
 *     responses:
 *       200:
 *         description: Policy updated successfully
 *       400:
 *         description: Policy update failed or Policy not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /admin/approvers:
 *   get:
 *     summary: Retrieve a list of approvers
 *     description: This endpoint allows you to retrieve a list of users who have the role of "approver". Only users with the appropriate permissions can access this endpoint.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Approvers retrieved successfully
 *       403:
 *         description: You don't have permission to perform this action
 *       500:
 *         description: Internal Server Error
 */


/**
 * @swagger
 * /admin/transaction:
 *   post:
 *     summary: Create a new transaction
 *     description: API endpoint to create a new transaction record.
 *     tags:
 *       - Transaction
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestedBy:
 *                 type: object
 *                 properties:
 *                   admin:
 *                     type: string
 *                     description: ID of the admin who requested.
 *                     example: "64c0ed92b7e8773e9cd3c401"
 *                   staff:
 *                     type: string
 *                     description: ID of the staff who requested.
 *                     example: "64c0ed92b7e8773e9cd3c402"
 *               amount:
 *                 type: number
 *                 description: Amount of payment.
 *                 example: 1500.50
 *               paidBy:
 *                 type: string
 *                 description: ID of the financer who paid.
 *                 example: "64c0ed92b7e8773e9cd3c403"
 *               paymentMethod:
 *                 type: string
 *                 enum: ["Bank Transfer", "Cash", "Credit Card", "Other"]
 *                 description: Method of payment.
 *                 example: "Bank Transfer"
 *               description:
 *                 type: string
 *                 description: Description of the payment.
 *                 example: "Payment for office supplies"
 *     responses:
 *       201:
 *         description: Transaction created successfully.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 */



/**
 * @swagger
 * /admin/transaction/{id}:
 *   get:
 *     summary: Get transaction details by ID
 *     description: API endpoint to retrieve transaction details using its ID.
 *     tags:
 *       - Transaction
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "64c0ed92b7e8773e9cd3c404"
 *         description: ID of the transaction to retrieve.
 *     responses:
 *       200:
 *         description: Transaction details retrieved successfully.
 *       404:
 *         description: Transaction not found.
 *       500:
 *         description: Internal server error.
 */


/**
 * @swagger
 * /admin/transaction/{id}:
 *   put:
 *     summary: Mark transaction as completed
 *     description: API endpoint to update the status of a transaction to "Completed".
 *     tags:
 *       - Transaction
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "64c0ed92b7e8773e9cd3c405"
 *         description: ID of the transaction to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: Additional description for the payment.
 *                 example: "Payment marked as completed."
 *     responses:
 *       200:
 *         description: Transaction marked as completed successfully.
 *       400:
 *         description: Bad request.
 *       404:
 *         description: Transaction not found.
 *       500:
 *         description: Internal server error.
 */

