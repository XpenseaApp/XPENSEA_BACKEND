/**
 * @swagger
 * /user/send-otp:
 *   post:
 *     summary: Send OTP
 *     description: API endpoint to send an OTP to a user's mobile number
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /user/verify:
 *   post:
 *     summary: Verify User
 *     description: API endpoint to verify a user using OTP and mobile number
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: number
 *                 example: 72033
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: User verified successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /user/mpin:
 *   post:
 *     summary: Add MPIN for User
 *     description: API endpoint to add or login via user's MPIN
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mpin:
 *                 type: string
 *                 example: "1234"
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: User mpin added successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /user/expense:
 *   post:
 *     summary: Create Expense
 *     description: API endpoint to create a new expense
 *     tags:
 *       - Expense
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Team Lunch"
 *               amount:
 *                 type: number
 *                 example: 100.50
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-06-19"
 *               time:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-06-19T13:45:00Z"
 *               location:
 *                 type: string
 *                 example: "New York, NY"
 *               category:
 *                 type: string
 *                 example: "Food"
 *               description:
 *                 type: string
 *                 example: "Lunch with the marketing team"
 *               image:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       200:
 *         description: Expense created successfully
 *       400:
 *         description: Invalid input or expense creation failed
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /user/report:
 *   post:
 *     summary: Create Report
 *     description: API endpoint to create a new report
 *     tags:
 *       - Report
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Monthly Expense Report"
 *               reportDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-06-19"
 *               description:
 *                 type: string
 *                 example: "Detailed report of all monthly expenses"
 *               location:
 *                 type: string
 *                 example: "New York"
 *               type:
 *                 type: string
 *                 example: "other // event"
 *               event:
 *                 type: string
 *                 example: "6673f805cb67f6f4d2ef4b34 //Send this field only if the type is 'event' "
 *               status:
 *                 type: string
 *                 example: "drafted //Send this field only if the status is 'drafted' "
 *               expenses:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "667275cda0521a39e214cd6c"
 *     responses:
 *       200:
 *         description: Report created successfully
 *       400:
 *         description: Invalid input or report creation failed
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /user/list:
 *   get:
 *     summary: Get reports, expenses, events or notifications
 *     description: API endpoint to get existing reports, expenses, events, approvals or notifications based on query type
 *     tags:
 *       - List
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         required: true
 *         description: Type of data to retrieve (reports, expenses, events, approvals or notifications)
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
 * /user/expense/{id}:
 *   get:
 *     summary: Get Expense by ID
 *     description: API endpoint to get an expense by its ID
 *     tags:
 *       - Expense
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "667275cda0521a39e214cd6c"
 *         description: The ID of the expense to retrieve
 *     responses:
 *       200:
 *         description: Expense retrieved successfully
 *       404:
 *         description: Expense not found
 *       500:
 *         description: Internal Server Error
 *
 * /user/report/{id}:
 *   get:
 *     summary: Get Report by ID
 *     description: API endpoint to get a report by its ID
 *     tags:
 *       - Report
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "66729822aca3dc807ee0f0b4"
 *         description: The ID of the report to retrieve
 *     responses:
 *       200:
 *         description: Report retrieved successfully
 *       404:
 *         description: Report not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /user/category:
 *   get:
 *     summary: Get User Categories
 *     description: API endpoint to get categories for a user based on their tier
 *     tags:
 *       - Category
 *     responses:
 *       200:
 *         description: Categories found
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /user/change-mpin:
 *   put:
 *     summary: Change MPIN
 *     description: API endpoint to change the MPIN of a user
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *               mpin:
 *                 type: string
 *                 example: "4321"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: MPIN changed successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /user/report-problem:
 *   post:
 *     summary: Report a Problem
 *     description: API endpoint to report a problem
 *     tags:
 *       - Problem
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *                 example: "approver, admin"
 *               description:
 *                 type: string
 *                 example: "Unable to login with correct credentials."
 *     responses:
 *       200:
 *         description: Report added successfully
 *       400:
 *         description: Invalid input or report creation failed
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /user/event:
 *   post:
 *     summary: Create a new event
 *     description: API endpoint to create a new user event
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
 *                 example: "Team Meeting"
 *               days:
 *                 type: integer
 *                 example: 2
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-07-20"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-07-21"
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-07-20T10:00:00Z"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-07-21T18:00:00Z"
 *               description:
 *                 type: string
 *                 example: "Discuss project updates"
 *     responses:
 *       200:
 *         description: Event created successfully
 *       400:
 *         description: Invalid input or Event creation failed
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /user/report/{id}:
 *   put:
 *     summary: Update a report
 *     description: API endpoint to update a report's details
 *     tags:
 *       - Report
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the report to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *             example:
 *               title: "Updated Report Title"
 *               description: "Updated report description"
 *     responses:
 *       200:
 *         description: Report updated successfully
 *       400:
 *         description: Report ID is required
 *       404:
 *         description: Report not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /user/wallet-used:
 *   get:
 *     summary: Get Wallet
 *     description: API endpoint to get wallet report
 *     tags:
 *       - Expense
 *     responses:
 *       200:
 *         description: Report retrieved successfully
 *       404:
 *         description: Report not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /user/event/{id}:
 *   put:
 *     summary: Update an event
 *     description: API endpoint to update an event's details
 *     tags:
 *       - Event
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the event to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventName:
 *                 type: string
 *               days:
 *                 type: number
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               startTime:
 *                 type: string
 *                 format: time
 *               endTime:
 *                 type: string
 *                 format: time
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       400:
 *         description: Invalid input or Event ID is required
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /user/approval/{id}:
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
 * /user/approval/{id}/{action}:
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
 * /user/reimburse/{id}:
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
 * /user/finance/{id}:
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
 * /user/wallet/:
 *   get:
 *     summary: Get wallet details
 *     description: Retrieve wallet information for a specific user based on their ID.
 *     tags:
 *       - Wallet
 *     responses:
 *       200:
 *         description: Wallet details retrieved successfully.
 *       400:
 *         description: User ID is required.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /user/policy:
 *   get:
 *     summary: Retrieve user policy based on user tier
 *     description: This endpoint allows users to retrieve the policy associated with their tier.
 *     tags:
 *       - Policy
 *     responses:
 *       200:
 *         description: Policy retrieved successfully
 *       400:
 *         description: Policy not found
 *       500:
 *         description: Internal Server Error
 */
