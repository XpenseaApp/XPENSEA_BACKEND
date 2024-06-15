/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Admin related endpoints
 *   - name: Role
 *     description: Role related endpoints
 *   - name: List
 *     description: List related endpoints
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
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successfull
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
 *               designation:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
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
 * /admin/{id}:
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
 *         description: ID of and admin to update
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
 *               designation:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Admin updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Admin not found
 */

/**
 * @swagger
 * /admin/list/:
 *   get:
 *     summary: Get an admin or roles
 *     description: API endpoint to get existing admins or roles based on query type
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
 *         description: Type of data to retrieve (admins or roles)
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
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *               locationAccess:
 *                 type: array
 *                 items:
 *                   type: string
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
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *               locationAccess:
 *                 type: array
 *                 items:
 *                   type: string
 *                 status:
 *                   type: boolean
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Role not found
 *   get:
 *     summary: Get a Role
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
 */
