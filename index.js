"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var express_fileupload_1 = __importDefault(require("express-fileupload"));
var fs_1 = require("fs");
var p = __importStar(require("path"));
var cgroup = require('@adobe/cgroup-metrics');
var Worker = require('worker_threads').Worker;
var top = require('process-top')();
var app = (0, express_1["default"])();
var port = process.env.PORT || 3000;
app.use((0, express_fileupload_1["default"])({
    createParentPath: true
}));
app.use(express_1["default"].json());
app.use(express_1["default"].urlencoded({ extended: true }));
app.use('/ui', express_1["default"].static('ui'));
app.use('/images', express_1["default"].static('images'));
app.get('/', function (req, res) {
    res.sendFile(p.join(__dirname, '/ui/index.html'));
});
app.get('/name', function (req, res) {
    res.send(process.env.LAB_NAME || 'DEFAULT');
});
app.get('/cpu-usage', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cpu;
    return __generator(this, function (_a) {
        try {
            cpu = top.cpu();
            res.send("".concat(cpu.percent * 100));
        }
        catch (e) {
            res.status(500).send(e);
        }
        return [2 /*return*/];
    });
}); });
var _lastCpuAcctUsage = null;
app.get('/cpu-usage-cgroup', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cpu, currentCpuacctUsage, calculateUsage, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                cpu = cgroup.cpu;
                return [4 /*yield*/, cpu.usage()];
            case 1:
                currentCpuacctUsage = _a.sent();
                if (!_lastCpuAcctUsage) return [3 /*break*/, 3];
                return [4 /*yield*/, cpu.calculateUsage(_lastCpuAcctUsage, currentCpuacctUsage)];
            case 2:
                calculateUsage = _a.sent();
                _lastCpuAcctUsage = currentCpuacctUsage;
                res.send("".concat(calculateUsage));
                return [3 /*break*/, 4];
            case 3:
                _lastCpuAcctUsage = currentCpuacctUsage;
                res.send("0");
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                e_1 = _a.sent();
                res.status(500).send(e_1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
app.post('/cpu-load', function (req, res) {
    var workerScriptFilePath = require.resolve('./worker-script.js');
    var worker = new Worker(workerScriptFilePath);
    worker.on('message', function (output) { return console.log(output); });
    worker.on('error', function (error) { return console.error(error); });
    worker.on('exit', function (code) {
        if (code !== 0)
            throw new Error("Worker stopped with exit code ".concat(code));
    });
    res.status(202).send();
});
app.get('/env', function (req, res) {
    res.send(process.env);
});
app.post('/files', function (req, res) {
    try {
        if (!req.files) {
            res.status(400).send('No file uploaded');
        }
        else {
            var fileUpload_1 = req.files.fileUpload;
            fileUpload_1.mv('./uploads/' + fileUpload_1.name);
            res.status(200).send('File uploaded');
        }
    }
    catch (e) {
        res.status(500).send(e);
    }
});
app.get('/files', function (req, res) {
    var path = req.query.path;
    if (path) {
        var file = "".concat(__dirname, "/uploads/").concat(path);
        res.download(file);
    }
    else {
        var dir = (0, fs_1.readdirSync)('uploads');
        res.send(dir);
    }
});
app.listen(port, function () {
    console.log("App is listening on port ".concat(port, "."));
});
