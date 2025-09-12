require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const {format, parse, union} = require("express-form-data");
const cors = require("cors");
const os = require("os");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 8001;

app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    req.body = {
        ...req.body,
        ...req.files
    };

    next();
});

app.use(parse({
    uploadDir: os.tmpdir(),
    autoClean: true
}));
app.use(format());
app.use(union());

// app.use(fileUpload({ createParentPath: true }));

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use(express.json());

const indexRoutes = require("./routes/index");
app.use("/api", indexRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
