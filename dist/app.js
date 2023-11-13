"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./src/swagger"));
const index_1 = __importDefault(require("./src/routes/index"));
const api_1 = __importDefault(require("./src/routes/api"));
const NodeMailerStrategy_1 = require("./src/services/email/strategies/NodeMailerStrategy");
const EmailService_1 = require("./src/services/email/EmailService");
const TransporterFactory_1 = require("./src/services/email/TransporterFactory");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
let corsOptions = {
    origin: ['http://localhost:3000'],
};
// Middleware
app.use((0, cors_1.default)(corsOptions));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use('/favicon.ico', express_1.default.static('public/images/favicon.ico'));
app.set('view engine', 'html');
// Swagger documentation
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
// Routes
app.use('/', index_1.default);
app.use('/api/v1', api_1.default);
// Catch 404 and forward to error handler
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});
// Error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: err.message || 'Internal Server Error' });
});
// Start server
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
// Email service setup
const emailService = EmailService_1.EmailService.getInstance();
// Mailgun configuration
const mailgunTransporter = TransporterFactory_1.TransporterFactory.createTransporter('Mailgun', {
    user: (_a = process.env.MAILGUN_USERNAME) !== null && _a !== void 0 ? _a : '',
    pass: (_b = process.env.MAILGUN_PASSWORD) !== null && _b !== void 0 ? _b : '',
});
const mailgunStrategy = new NodeMailerStrategy_1.NodemailerStrategy(mailgunTransporter);
emailService.addStrategy(mailgunStrategy);
// SendGrid configuration
const sendGridTransporter = TransporterFactory_1.TransporterFactory.createTransporter('SendGrid', {
    user: (_c = process.env.SENDGRID_USERNAME) !== null && _c !== void 0 ? _c : '',
    pass: (_d = process.env.SENDGRID_PASSWORD) !== null && _d !== void 0 ? _d : '',
});
const sendGridStrategy = new NodeMailerStrategy_1.NodemailerStrategy(sendGridTransporter);
emailService.addStrategy(sendGridStrategy);
exports.default = app;
