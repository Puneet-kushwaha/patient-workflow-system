require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const { format, parse, union } = require("express-form-data");
const cors = require("cors");
const os = require("os");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8001;

const allowedOrigins = [
    "https://patient-workflow-system-frontend.onrender.com",
    "http://localhost:5173",
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

app.options(/.*/, cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    req.body = {
        ...req.body,
        ...req.files,
    };
    next();
});

app.use(parse({
    uploadDir: os.tmpdir(),
    autoClean: true,
}));
app.use(format());
app.use(union());

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

const indexRoutes = require("./routes/index");
app.use("/api", indexRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
