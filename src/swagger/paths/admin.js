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
 *     summary: Get admins, roles, tiers, users or events
 *     description: API endpoint to get existing admins, roles, tiers, users or events based on query type
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
 *         description: Type of data to retrieve (admins, roles, tiers, users or events)
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
 * /admin/events/{id}:
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
 * /admin/events/{id}:
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
 * /admin/events/{id}:
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