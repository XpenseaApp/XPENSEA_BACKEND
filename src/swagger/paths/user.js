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
 *               reportId:
 *                 type: string
 *                 example: "RPT123456"
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
 *     summary: Get reports, expenses or notifications
 *     description: API endpoint to get existing reports, expenses or notifications based on query type
 *     tags:
 *       - List
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         required: true
 *         description: Type of data to retrieve (reports, expenses or notifications)
 *     responses:
 *       200:
 *         description: Data retrieved successfully
 *       404:
 *         description: Data not found
 *       500:
 *         description: Internal Server Error
 */